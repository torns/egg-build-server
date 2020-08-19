/*
 * @Author: Whzcorcd
 * @Date: 2020-08-10 18:40:49
 * @LastEditors: Wzhcorcd
 * @LastEditTime: 2020-08-19 15:07:44
 * @Description: file content
 */

'use strict'

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
