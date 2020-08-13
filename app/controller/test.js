/*
 * @Author: Whzcorcd
 * @Date: 2020-08-12 19:57:17
 * @LastEditors: Wzhcorcd
 * @LastEditTime: 2020-08-13 16:03:16
 * @Description: file content
 */

'use strict'

const fs = require('fs-extra')
const path = require('path')
const ncp = require('nginx-config-parser')

const Controller = require('egg').Controller

class TestController extends Controller {
  async index() {
    const { ctx } = this

    const nginxPath = path.resolve(__dirname, '../public/original/nginx.conf')

    const config = ncp.queryFromString(fs.readFileSync(nginxPath, 'utf-8'))

    console.log(config.stringify().replace('your_website_server_name', '*****'))

    fs.writeFileSync(nginxPath, config.stringify())

    return ctx.returnCtxBody(200, config.find('http', 'server'), 'ok')
  }
}

module.exports = TestController
