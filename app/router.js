/*
 * @Author: Whzcorcd
 * @Date: 2020-08-10 11:35:45
 * @LastEditors: Wzhcorcd
 * @LastEditTime: 2020-08-10 22:48:51
 * @Description: file content
 */

'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)
  router.post('/webhook', controller.webhook.index)
}
