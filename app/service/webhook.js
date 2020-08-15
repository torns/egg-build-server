/*
 * @Author: Whzcorcd
 * @Date: 2020-08-10 19:13:04
 * @LastEditors: Wzhcorcd
 * @LastEditTime: 2020-08-16 01:41:37
 * @Description: file content
 */

'use strict'

// const download = require('download-git-repo')
const fs = require('fs-extra')
const path = require('path')
const request = require('request')
const compressing = require('compressing')

const Service = require('egg').Service

class WebhookService extends Service {
  async parse(id) {
    const { ctx } = this

    const { req } = ctx

    if (!id) return null

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

    const { body } = ctx.request
    console.log(body)
    ctx.returnCtxBody(200, { ok: true }, 'success')

    await this.getSource(body)

    return
  }

  async getSource(info) {
    return new Promise((resolve, reject) => {
      const { ctx } = this

      const name = info.repository.name
      const url = info.repository.git_http_url.split('.git')[0]

      try {
        const dirPath = path.resolve(__dirname, '../public/temp')
        console.log(dirPath)
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath)
          console.log('temp 创建成功')
        }

        const filePath = `${url}/repository/archive.zip?ref=master`
        const fileName = `${name}.zip`

        const stream = fs.createWriteStream(path.resolve(dirPath, fileName))

        request(filePath, err => {
          if (err) {
            // throw new Error(err)
            reject(new Error(err))
          }
        })
          .pipe(stream)
          .on('close', async () => {
            await this.unCompress(fileName)
            await ctx.service.establish.build(name, dirPath)
            resolve('ok')
          })
      } catch (err) {
        console.error(`资源获取异常：${err}，请重新获取`)
        // TODO 修改为异步
        ctx.service.establish
          .clearTemp()
          .then(() => reject(new Error(err)))
          .catch(e => reject(new Error(`${err} & ${e}`)))
        // throw new Error(err)
      }
    })
  }

  async unCompress(from) {
    try {
      await compressing.zip.uncompress(
        path.resolve(__dirname, `../public/temp/${from}`),
        path.resolve(__dirname, '../public/temp')
      )
    } catch (err) {
      throw new Error(err)
    }
  }
}

module.exports = WebhookService
