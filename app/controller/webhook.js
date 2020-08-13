/*
 * @Author: Whzcorcd
 * @Date: 2020-08-10 18:40:49
 * @LastEditors: Wzhcorcd
 * @LastEditTime: 2020-08-13 16:27:29
 * @Description: file content
 */

'use strict'

const Controller = require('egg').Controller

class WebhookController extends Controller {
  constructor(ctx) {
    super(ctx)
    this.appidRule = {
      id: { type: 'string', required: true },
    }
  }

  async index() {
    const { ctx, service } = this

    // try {
    //   ctx.validate(this.appidRule, ctx.params)
    // } catch (err) {
    //   ctx.logger.warn(err.errors)
    //   ctx.returnCtxBody(400, {}, 'illegal parameters')
    //   return
    // }

    // const { id } = ctx.params

    return await service.webhook.parse(1)
  }
}

module.exports = WebhookController
