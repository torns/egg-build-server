/*
 * @Author: Whzcorcd
 * @Date: 2020-08-10 17:06:30
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-03 16:52:25
 * @Description: file content
 */

'use strict'

const which = require('which')
const childProcess = require('child_process')
const rimraf = require('rimraf')
const path = require('path')
const fs = require('fs-extra')

module.exports = {
  /**
   * 查找系统中用于安装依赖包的命令
   */
  find() {
    const tools = ['yarn', 'npm', 'tnpm', 'cnpm']
    for (let i = 0; i < tools.length; i++) {
      try {
        // 查找环境变量下指定的可执行文件的第一个实例
        which.sync(tools[i])
        console.log(`当前构建工具：${tools[i]}`)
        return tools[i]
      } catch (err) {
        throw err
      }
    }
    throw new Error('please install Npm/Yarn')
  },

  /**
   * 返回客户端接口标准化内容
   * @param {number} status 返回状态
   * @param {any} data 返回内容
   * @param {string} msg 返回信息
   */
  returnCtxBody(status, data = {}, msg) {
    // this 即 ctx
    this.status = status
    this.body = {
      status,
      data,
      msg,
    }
  },

  runCommandWithExec(cmd, cwd, env = {}) {
    return new Promise((resolve, reject) => {
      childProcess.exec(
        cmd,
        {
          cwd,
          timeout: 300000,
          maxBuffer: 4096 * 1024,
          env: Object.assign({}, process.env, env),
          shell: '/bin/sh',
        },
        (error, stdout, stderr) => {
          // 进程退出或终止时操作
          if (error) {
            // 不可中断
            console.error(error)
            return reject(error)
          }
          console.error(stderr)
          return resolve()
        }
      )
    })
  },

  runCommandWithSpawn(cmd, args = [], sync = false) {
    return new Promise((resolve, reject) => {
      if (!sync) {
        const runner = childProcess.spawn(cmd, args, {
          detached: true,
          stdio: 'inherit',
          shell: true,
        })

        // runner.stderr.on('data', data => {
        //   console.log(`子进程运行中错误，错误内容 ${data}`)
        // })

        runner.on('error', code => {
          console.log(`子进程错误，错误码 ${code}`)
        })

        runner.on('close', code => {
          console.log(`子进程退出，退出码: ${code}`)

          if (code === 0) {
            return resolve(code)
          }
          return reject(code)
        })
      } else {
        const { status, error } = childProcess.spawnSync(cmd, args, {
          detached: true,
          stdio: 'inherit',
          maxBuffer: 4096 * 1024,
        })
        if (error) return reject(error)

        console.log(`子进程退出，退出码: ${status}`)

        return resolve()
      }
    })
  },

  clearTemp() {
    // 移除 temp 文件夹
    return new Promise((resolve, reject) => {
      const finalPath = path.resolve(__dirname, '../public')

      try {
        process.chdir(finalPath)

        rimraf(`${finalPath}/temp`, err => {
          if (err) console.log(err)

          console.log('临时空间清空完成')

          fs.mkdirSync(`${finalPath}/temp`)
          return resolve()
        })
      } catch (err) {
        console.error(err)
        return reject(err)
      }
    })
  },

  sleep(delay = 0) {
    return new Promise(resolve => {
      setTimeout(() => resolve(), delay)
    })
  },
}
