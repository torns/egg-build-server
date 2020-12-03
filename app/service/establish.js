/*
 * @Author: Whzcorcd
 * @Date: 2020-08-10 20:05:26
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-03 11:15:21
 * @Description: file content
 */

'use strict'

const fs = require('fs-extra')
const rimraf = require('rimraf')
const path = require('path')
const which = require('which')
const childProcess = require('child_process')

const Service = require('egg').Service

// 开启子进程来执行 node 命令
// function run(cmd, args, cwd) {
//   return new Promise((resolve, reject) => {
//     args = args || []
//     childProcess.execFile(
//       cmd,
//       args,
//       {
//         cwd,
//         timeout: 300000,
//         maxBuffer: 4096 * 1024,
//         shell: true,
//       },
//       (error, stdout, stderr) => {
//         if (error) {
//           console.error(error)
//           return reject(error)
//           // TODO 继续构建
//         }
//         console.log(stdout)
//         console.log(stderr)
//         return resolve('ok')
//       }
//     )
//   })
// }

function run(cmd, cwd, env = {}) {
  return new Promise(resolve => {
    childProcess.exec(
      cmd,
      {
        cwd,
        timeout: 300000,
        maxBuffer: 4096 * 1024,
        env: Object.assign({}, process.env, env),
      },
      (error, stdout, stderr) => {
        if (error) {
          console.error(error)
          // TODO 继续构建
        }
        console.log(stdout)
        console.log(stderr)
        return resolve('ok')
      }
    )
  })
}

class EstablishService extends Service {
  async build(solutions, name, path) {
    return new Promise((resolve, reject) => {
      const { ctx } = this
      // const ignoreList = ['.zip', '.DS_Store']

      const npm = ctx.find()
      const paths = fs.readdirSync(path)
      console.log(paths)
      if (!paths.includes(name)) reject(new Error('未找到对应项目目录'))

      paths.forEach(async item => {
        if (!item.includes(name)) return
        if (item.includes('.zip')) return

        const config = await ctx.service.analysis
          .getProjectConfig(solutions, `${path}/${item}`)
          .catch(err => {
            console.error(err)
          })

        // console.log(`${path}/${item}`, config)
        // eslint-disable-next-line no-extra-boolean-cast
        if (Boolean(config.config.ssr)) {
          // ssr 项目不参与主包构建
          console.log('当前为 SSR 项目')
          await this.afterBuild(solutions, `${path}/${item}`).catch(err => {
            console.error(err)
          })
          return resolve('skip')
        }

        const command = config.command ? config.command.build : 'build:private'

        process.chdir(`${path}/${item}`)

        // await run(which.sync(npm), ['install'], `${path}/${item}`).catch(
        //   err => {
        //     console.error(`应用安装依赖异常：${err}，请重新尝试`)
        //     this.clearTemp()
        //       .then(() => reject(new Error(err)))
        //       .catch(e => reject(new Error(`${err} & ${e}`)))
        //   }
        // )
        console.log('开始安装依赖')

        await run(`${which.sync(npm)} install`, `${path}/${item}`).catch(
          err => {
            console.error(`依赖安装异常：${err}，请重新尝试`)
            this.clearTemp()
              .then(() => reject(new Error(err)))
              .catch(e => reject(new Error(`${err} & ${e}`)))
          }
        )

        console.log('依赖安装完成')
        console.log('\n')
        console.log(`开始项目构建，当前构建命令:${command}`)

        await run(`${which.sync(npm)} run ${command}`, `${path}/${item}`, {
          NODE_ENV: 'production',
        }).catch(err => {
          console.error(`项目构建异常：${err}，请重新尝试`)
          this.clearTemp()
            .then(() => reject(new Error(err)))
            .catch(e => reject(new Error(`${err} & ${e}`)))
        })

        console.log('项目构建完成')

        await this.afterBuild(solutions, `${path}/${item}`).catch(err => {
          console.error(err)
        })
        return resolve('ok')
      })
    })
  }

  async afterBuild(solutions = '', path) {
    const { ctx } = this

    await ctx.service.deploy.index(solutions, path).catch(err => {
      console.error(err)
    })

    await this.clearTemp().catch(err => {
      console.error(err)
    })
    return
  }

  async clearTemp() {
    // 移除 temp 文件夹
    return new Promise((resolve, reject) => {
      const finalPath = path.resolve(__dirname, '../public')

      try {
        process.chdir(finalPath)
        rimraf(`${finalPath}/temp`, err => {
          if (err) console.log(err)
          console.log('临时空间清空完成')

          fs.mkdirSync(`${finalPath}/temp`)
          resolve('ok')
        })
        // run('rm', ['-r', '-f', 'temp'], () => {
        //   console.log('clear temp area complete')
        //   fs.mkdirSync(`${finalPath}/temp`)
        //   console.log('rebuild temp area complete')
        //   resolve('ok')
        // })
      } catch (err) {
        console.error(err)
        reject(err)
      }
    })
  }
}

module.exports = EstablishService
