/*
 * @Author: Whzcorcd
 * @Date: 2020-08-10 11:35:45
 * @LastEditors: Wzhcorcd
 * @LastEditTime: 2020-08-10 17:56:51
 * @Description: file content
 */

'use strict'

const Controller = require('egg').Controller

class HomeController extends Controller {
  async index() {
    const { ctx } = this
    ctx.body = 'hi, egg'
  }
}

module.exports = HomeController
