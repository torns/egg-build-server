/*
 * @Author: Whzcorcd
 * @Date: 2020-08-10 20:05:26
 * @LastEditors: Wzhcorcd
 * @LastEditTime: 2020-08-12 10:41:04
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

  runner.on('close', code => {
    if (fn) {
      fn(code)
    }
  })
}

class EstablishService extends Service {
  async build(name, path) {
    const { ctx } = this
    // const ignoreList = ['.zip', '.DS_Store']
    const npm = ctx.find()
    const paths = fs.readdirSync(path)
    console.log(paths)

    paths.forEach(item => {
      if (!item.includes(name)) return
      if (item.includes('.zip')) return
      process.chdir(`${path}/${item}`)
      // TODO 异常处理
      run(which.sync(npm), ['install'], () => {
        console.log('install complete')
        if (npm === 'yarn') {
          run(which.sync(npm), ['build'], () => {
            console.log('build complete')
            this.clearTemp(path)
          })
        } else {
          run(which.sync(npm), ['run', 'build'], () => {
            console.log('build complete')
            this.clearTemp(path)
          })
        }
      })
    })
  }

  async remove(path) {
    if (fs.existsSync(path)) {
      const files = fs.readdirSync(path)
      files.forEach(file => {
        const curPath = `${path}/${file}`
        if (fs.statSync(curPath).isDirectory()) {
          // recurse
          this.remove(curPath)
        } else {
          // delete file
          fs.unlinkSync(curPath)
        }
      })
      fs.rmdirSync(path)
    }
  }

  async clearTemp(filePath) {
    console.log(path.join(filePath, '../'))
    run('rm', ['-r', '-f', '/temp'], () => {
      console.log('build complete')
      this.clearTemp(path)
    })
  }
}

module.exports = EstablishService
