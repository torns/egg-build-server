/*
 * @Author: Whzcorcd
 * @Date: 2020-08-16 11:44:34
 * @LastEditors: Wzhcorcd
 * @LastEditTime: 2020-08-16 19:51:39
 * @Description: file content
 */

'use strict'

const Controller = require('egg').Controller

class TriggerController extends Controller {
  async index() {
    const { ctx } = this

    const rule = {
      name: { type: 'string', required: true },
      url: { type: 'string', required: true },
    }

    try {
      ctx.validate(rule, ctx.query)
    } catch (err) {
      ctx.logger.warn(err.errors)
      ctx.returnCtxBody(400, {}, 'illegal parameters')
      return
    }

    const { name, url } = ctx.query
    const perload = {
      repository: {
        name,
        git_http_url: url,
      },
    }

    return ctx.controller.webhook.addNewTask(perload)
  }
}

module.exports = TriggerController
