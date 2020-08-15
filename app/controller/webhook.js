/*
 * @Author: Whzcorcd
 * @Date: 2020-08-10 18:40:49
 * @LastEditors: Wzhcorcd
 * @LastEditTime: 2020-08-16 02:30:03
 * @Description: file content
 */

'use strict'

const QUEUE_NAME = 'task_list'
const TASK_LOCK = 'task_lock'

const handlers = [
  {
    path: 'http://gitlab.aodianyun.com/common/gitlab-webhook-test',
    secret: '1d9f84d2bf0a3e759dd2995d1791168a',
    events: ['Push Hook'],
  },
  {
    path: 'http://www.test.com/test',
    secret: '1d9f84d2bf0a3e759dd2995d1791168a',
    events: ['Push Hook'],
  },
]

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

const Controller = require('egg').Controller

class WebhookController extends Controller {
  async addNewTask(info) {
    const { ctx, app } = this

    let taskList = []

    // Publisher
    // const msg = JSON.stringify(info)
    // const ch = await app.amqplib.createChannel()
    // await ch.assertQueue(queueName, { durable: true })
    // const ok = await ch.sendToQueue(queueName, Buffer.from(msg))
    // console.log(ok)
    // await ch.close()

    const res = await app.redis.get(QUEUE_NAME)

    if (res) {
      taskList = isJSON(res) ? JSON.parse(res) : []
    }
    taskList.push(info)
    console.log(`加入新任务，当前任务队列长度：${taskList.length}`)
    await app.redis.set(QUEUE_NAME, JSON.stringify(taskList))
    await app.redis.persist(QUEUE_NAME)

    !(await this.getTaskLockStatus()) && this.runTask()

    ctx.returnCtxBody(200, {}, 'success')
    return
  }

  async runTask() {
    const { app, service } = this

    this.changeTaskLockStatus(true)
    // Consumer
    const res = await app.redis.get(QUEUE_NAME)
    const taskList = isJSON(res) ? JSON.parse(res) : []

    if (taskList.length > 0) {
      const info = taskList.shift()
      console.log(`当前任务：${info}`)
      try {
        if (info) {
          await service.webhook.getSource(info)
        }
      } catch (err) {
        // TODO 多次失败的处理
        throw new Error(err)
      }
      console.log(`已消费任务，当前任务队列长度：${taskList.length}`)
      await app.redis.set(QUEUE_NAME, JSON.stringify(taskList))
      await app.redis.persist(QUEUE_NAME)

      if (taskList.length > 0) return this.runTask()
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

    await app.redis.set(TASK_LOCK, status ? 'true' : 'false')
    await app.redis.persist(TASK_LOCK)
    return
  }

  async task() {
    const { ctx } = this
    const { req } = ctx

    // const rule = {
    //   id: { type: 'string', required: true },
    // }

    // try {
    //   ctx.validate(rule, ctx.query)
    // } catch (err) {
    //   ctx.logger.warn(err.errors)
    //   ctx.returnCtxBody(400, {}, 'illegal parameters')
    //   return
    // }

    // const { id } = ctx.query

    let currentOptions
    if (Array.isArray(handlers)) {
      currentOptions = findHandler(
        req.headers.referer.split('?').shift(),
        handlers
      )
    } else {
      currentOptions = handlers
    }

    console.log(currentOptions)
    if (!currentOptions) {
      return ctx.returnCtxBody(400, {}, 'illegal access')
    }

    checkType(currentOptions)

    if (
      req.headers.referer.split('?').shift() !== currentOptions.path ||
      req.method !== 'POST'
    ) {
      return ctx.returnCtxBody(400, {}, 'illegal access')
    }

    const token = req.headers['x-gitlab-token']
    if (!token || token !== currentOptions.secret) {
      return ctx.returnCtxBody(
        400,
        {},
        'no X-Gitlab-Token found on request or the token did not match'
      )
    }

    const event = req.headers['x-gitlab-event']
    const events = currentOptions.events

    if (!event) {
      return ctx.returnCtxBody(400, {}, 'no X-Gitlab-Event found on request')
    }

    if (events && events.indexOf(event) === -1) {
      return ctx.returnCtxBody(400, {}, 'X-Gitlab-Event is not acceptable')
    }

    // 校验通过
    const { body } = ctx.request
    console.log(body)
    return this.addNewTask(body)
  }

  async index() {
    const { service } = this

    return await service.webhook.parse(1)
  }
}

module.exports = WebhookController
