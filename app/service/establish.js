/*
 * @Author: Whzcorcd
 * @Date: 2020-08-10 20:05:26
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-08-26 09:33:56
 * @Description: file content
 */

'use strict'

const fs = require('fs-extra')
const path = require('path')
const which = require('which')
const childProcess = require('child_process')

const Service = require('egg').Service

// 开启子进程来执行 node 命令
function run(cmd, args, fn) {
  args = args || []
  childProcess.execFile(
    cmd,
    args,
    { timeout: 300000, maxBuffer: 4096 * 1024 },
    (error, stdout) => {
      if (error) {
        console.error(error)
      }
      console.log(stdout)
      if (fn) {
        fn()
      }
    }
  )
}

class EstablishService extends Service {
  async build(name, path) {
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
          .getProjectConfig(`${path}/${item}`)
          .catch(err => {
            console.error(err)
          })

        const command = config.command ? config.command.build : 'build'

        process.chdir(`${path}/${item}`)
        run(which.sync(npm), ['install'], () => {
          console.log('install complete')
          console.log(`构建命令:${command}`)
          // TODO 私有化构建
          try {
            run(
              which.sync(npm),
              npm === 'yarn' ? [command] : ['run', command],
              async () => {
                console.log('build complete')
                await this.afterBuild(`${path}/${item}`).catch(err => {
                  console.error(err)
                }) // 当前 path 为 temp/...
                resolve('ok')
              }
            )
          } catch (err) {
            console.error(`应用构建异常：${err}，请重新尝试`)
            this.clearTemp()
              .then(() => reject(new Error(err)))
              .catch(e => reject(new Error(`${err} & ${e}`)))
          }
        })
      })
    })
  }

  async afterBuild(path) {
    const { ctx } = this

    await ctx.service.deploy.index(path).catch(err => {
      console.error(err)
    })

    await this.clearTemp().catch(err => {
      console.error(err)
    })
    return
  }

  async clearTemp() {
    // 使用系统 rm 命令移除 temp 文件夹
    return new Promise((resolve, reject) => {
      const finalPath = path.resolve(__dirname, '../public')

      try {
        process.chdir(finalPath)
        run('rm', ['-r', '-f', 'temp'], () => {
          console.log('clear temp area complete')
          fs.mkdirSync(`${finalPath}/temp`)
          console.log('rebuild temp area complete')
          resolve('ok')
        })
      } catch (err) {
        console.error(err)
        reject(err)
      }
    })
  }
}

module.exports = EstablishService
