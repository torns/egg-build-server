/*
 * @Author: Whzcorcd
 * @Date: 2020-08-10 20:05:26
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-08-24 12:54:13
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
  const runner = childProcess.spawn(cmd, args, {
    detached: true,
    stdio: 'inherit',
  })

  runner.on('error', err => {
    console.error('Failed to start child process')
    throw new Error(err)
  })

  runner.on('close', code => {
    if (fn) {
      fn(code)
    }
  })
}

class EstablishService extends Service {
  async build(name, path) {
    return new Promise((resolve, reject) => {
      const { ctx } = this
      // const ignoreList = ['.zip', '.DS_Store']

      try {
        const npm = ctx.find()
        const paths = fs.readdirSync(path)
        console.log(paths)
        if (!paths.includes(name)) reject(new Error('未找到对应项目目录'))

        paths.forEach(item => {
          if (!item.includes(name)) return
          if (item.includes('.zip')) return

          process.chdir(`${path}/${item}`)
          run(which.sync(npm), ['install'], () => {
            console.log('install complete')
            // TODO 私有化构建
            if (npm === 'yarn') {
              run(which.sync(npm), ['build'], async () => {
                console.log('build complete')
                await this.afterBuild(`${path}/${item}`).catch(err => {
                  console.error(err)
                }) // 当前 path 为 temp/...
                resolve('ok')
              })
            } else {
              run(which.sync(npm), ['run', 'build'], async () => {
                console.log('build complete')
                await this.afterBuild(`${path}/${item}`).catch(err => {
                  console.error(err)
                }) // 当前 path 为 temp/...
                resolve('ok')
              })
            }
          })
        })
      } catch (err) {
        console.error(`应用构建异常：${err}，请重新获取`)
        this.clearTemp()
          .then(() => reject(new Error(err)))
          .catch(e => reject(new Error(`${err} & ${e}`)))
        // throw new Error(err)
      }
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
