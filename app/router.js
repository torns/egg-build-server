/*
 * @Author: Whzcorcd
 * @Date: 2020-08-10 11:35:45
 * @LastEditors: Wzhcorcd
 * @LastEditTime: 2020-08-14 17:56:15
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
  router.post('/webhook/task', controller.webhook.task)
  // router.post('/webhook/queue', controller.webhook.addNewTask)

  router.post('/project/create', controller.project.create)
  router.post('/project/pack', controller.project.pack)

  router.get('/test', controller.test.index)
}
