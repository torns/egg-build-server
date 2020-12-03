/*
 * @Author: Whzcorcd
 * @Date: 2020-08-10 19:13:04
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-03 14:42:18
 * @Description: file content
 */

'use strict'

const QUEUE_NAME = 'task_list'
const TASK_LOCK = 'task_lock'
const ERROR_LIST = 'error_list'

const fs = require('fs-extra')
const path = require('path')

const Service = require('egg').Service

function isJSON(str) {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str)
      if (typeof obj === 'object' && obj) {
        return true
      }
      return false
    } catch (e) {
      console.log('error：' + str + '!!!' + e)
      return false
    }
  }
}

function findHandler(url, arr) {
  const res = arr.filter(item => item.path === url)
  return res[0]
}

function checkType(options) {
  // TODO
  // if (options instanceof Object && !Array.isArray(options)) {
  //   throw new TypeError('must provide an options object')
  // }

  if (typeof options.path !== 'string') {
    throw new TypeError("must provide a 'path' option")
  }

  if (typeof options.secret !== 'string') {
    throw new TypeError("must provide a 'secret' option")
  }
}

// hook 模块
class WebhookService extends Service {
  async addNewTask(solutions, info) {
    const { ctx, app } = this

    let taskList = []

    const res = await app.redis.get(QUEUE_NAME).catch(err => {
      console.error(err)
    })

    if (res) {
      taskList = isJSON(res) ? JSON.parse(res) : []
    }
    if (info instanceof Array) {
      taskList = taskList.concat(info)
    } else {
      taskList.push(info)
    }
    console.log(info)
    console.log(`加入新任务，当前任务队列长度：${taskList.length}`)
    await app.redis.set(QUEUE_NAME, JSON.stringify(taskList)).catch(err => {
      console.error(err)
    })
    await app.redis.persist(QUEUE_NAME).catch(err => {
      console.error(err)
    })

    const lockStatus = await this.getTaskLockStatus().catch(err => {
      console.error(err)
    })
    !lockStatus && this.runTask(solutions)

    return ctx.returnCtxBody(200, {}, 'success')
  }

  async runTask(solutions) {
    const { app, ctx } = this

    this.changeTaskLockStatus(true)
    // Consumer
    const res = await app.redis.get(QUEUE_NAME).catch(err => {
      console.error(err)
    })
    const taskList = isJSON(res) ? JSON.parse(res) : []

    if (taskList.length > 0) {
      const info = taskList.shift()
      console.log('当前任务：', info)
      if (info) {
        await this.getSource(solutions, info).catch(async err => {
          console.error(err)
        })
      }

      console.log(`已消费任务，当前任务队列长度：${taskList.length}`)
      await app.redis.set(QUEUE_NAME, JSON.stringify(taskList)).catch(err => {
        console.error(err)
      })
      await app.redis.persist(QUEUE_NAME).catch(err => {
        console.error(err)
      })

      if (taskList.length > 0) {
        // 仍然剩余任务
        return this.runTask(solutions)
      }
      // 任务已清空
      ctx.service.report.publishReport()
    }

    this.changeTaskLockStatus(false)
    return
  }

  async getTaskLockStatus() {
    const { app } = this

    try {
      const status = await app.redis.get(TASK_LOCK)
      return status === 'true'
    } catch (err) {
      await app.redis.set(TASK_LOCK, 'false')
      await app.redis.persist(TASK_LOCK)
      return false
    }
  }

  async changeTaskLockStatus(status = true) {
    const { app } = this

    // const lockStatus = await app.redis.get(TASK_LOCK)
    if (typeof status !== 'boolean') {
      throw new TypeError('无效的锁状态')
    }

    await app.redis.set(TASK_LOCK, status ? 'true' : 'false').catch(err => {
      console.error(err)
    })
    await app.redis.persist(TASK_LOCK).catch(err => {
      console.error(err)
    })
    return
  }

  async getSource(solutions, info) {
    const { ctx } = this
    const { name, git_http_url, branch } = info.repository

    return new Promise(async (resolve, reject) => {
      // const url = info.repository.git_http_url.split('.git')[0]

      const dirPath = path.resolve(__dirname, '../public/temp')
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath)
        console.log('temp 创建成功')
      }

      // 支持分支选择构建
      const args = branch
        ? ['clone', '-b', branch, git_http_url]
        : ['clone', git_http_url]

      // git clone
      process.chdir(dirPath)

      await ctx.runCommandWithSpawn('git', [...args])

      console.log('\n项目拉取完成')

      try {
        await ctx.service.establish.build(solutions, name, dirPath)
      } catch (err) {
        // 临时空间清空
        await ctx.clearTemp()
        return reject(err)
      }

      return resolve()
    })
  }
}

module.exports = WebhookService
