/*
 * @Author: Whzcorcd
 * @Date: 2020-08-13 16:26:38
 * @LastEditors: Wzhcorcd
 * @LastEditTime: 2020-08-13 18:56:00
 * @Description: file content
 */

'use strict'

const Controller = require('egg').Controller

class ProjectController extends Controller {
  async create() {
    const { ctx, service } = this

    const rule = { name: { type: 'string', required: true } }

    try {
      ctx.validate(rule, ctx.request.body)
    } catch (err) {
      ctx.logger.warn(err.errors)
      ctx.returnCtxBody(400, {}, 'illegal parameters')
      return
    }

    const { name } = ctx.request.body

    const res = await service.project.createNewProject(name)

    if (!res) {
      return ctx.returnCtxBody(403, {}, 'failed')
    }

    return ctx.returnCtxBody(200, {}, 'success')
  }

  async pack() {
    const { ctx, service } = this

    const rule = { name: { type: 'string', required: true } }

    try {
      ctx.validate(rule, ctx.request.body)
    } catch (err) {
      ctx.logger.warn(err.errors)
      ctx.returnCtxBody(400, {}, 'illegal parameters')
      return
    }

    const { name } = ctx.request.body

    service.project.packProject(name)

    return ctx.returnCtxBody(200, {}, 'success')
  }
}

module.exports = ProjectController
