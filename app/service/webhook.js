/*
 * @Author: Whzcorcd
 * @Date: 2020-08-10 19:13:04
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-11-13 09:14:00
 * @Description: file content
 */

'use strict'

const QUEUE_NAME = 'task_list'
const TASK_LOCK = 'task_lock'
const ERROR_LIST = 'error_list'

// const download = require('download-git-repo')
const fs = require('fs-extra')
const path = require('path')
// const request = require('request')
const compressing = require('compressing')
const childProcess = require('child_process')

const Service = require('egg').Service

// 开启子进程来执行 node 命令
function run(cmd, args, fn) {
  args = args || []
  const runner = childProcess.spawn(cmd, args, {
    detached: true,
    stdio: 'inherit',
  })

  runner.on('error', err => {
    console.error('Failed to start child process')
    throw new Error(err)
  })

  runner.on('close', code => {
    if (fn) {
      fn(code)
    }
  })
}

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

class WebhookService extends Service {
  async addNewTask(solutions, info) {
    const { ctx, app } = this

    let taskList = []

    const res = await app.redis.get(QUEUE_NAME).catch(err => {
      console.error(err)
    })

    if (res) {
      taskList = isJSON(res) ? JSON.parse(res) : []
    }
    if (info instanceof Array) {
      taskList = taskList.concat(info)
    } else {
      taskList.push(info)
    }
    console.log(info)
    console.log(`加入新任务，当前任务队列长度：${taskList.length}`)
    await app.redis.set(QUEUE_NAME, JSON.stringify(taskList)).catch(err => {
      console.error(err)
    })
    await app.redis.persist(QUEUE_NAME).catch(err => {
      console.error(err)
    })

    const lockStatus = await this.getTaskLockStatus().catch(err => {
      console.error(err)
    })
    !lockStatus && this.runTask(solutions)

    return ctx.returnCtxBody(200, {}, 'success')
  }

  async runTask(solutions) {
    const { app } = this

    this.changeTaskLockStatus(true)
    // Consumer
    const res = await app.redis.get(QUEUE_NAME).catch(err => {
      console.error(err)
    })
    const taskList = isJSON(res) ? JSON.parse(res) : []

    if (taskList.length > 0) {
      const info = taskList.shift()
      console.log('当前任务：', info)
      if (info) {
        await this.getSource(solutions, info).catch(async err => {
          console.error(err)
        })
      }

      console.log(`已消费任务，当前任务队列长度：${taskList.length}`)
      await app.redis.set(QUEUE_NAME, JSON.stringify(taskList)).catch(err => {
        console.error(err)
      })
      await app.redis.persist(QUEUE_NAME).catch(err => {
        console.error(err)
      })

      if (taskList.length > 0) return this.runTask(solutions)
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

    await app.redis.set(TASK_LOCK, status ? 'true' : 'false').catch(err => {
      console.error(err)
    })
    await app.redis.persist(TASK_LOCK).catch(err => {
      console.error(err)
    })
    return
  }

  // async parse(id) {
  //   const { ctx } = this

  //   const { req } = ctx

  //   if (!id) return null

  //   const handlers = [
  //     {
  //       path: 'http://gitlab.aodianyun.com/common/gitlab-webhook-test',
  //       secret: '1d9f84d2bf0a3e759dd2995d1791168a',
  //       events: ['Push Hook'],
  //     },
  //     {
  //       path: 'http://www.test.com/test',
  //       secret: '1d9f84d2bf0a3e759dd2995d1791168a',
  //       events: ['Push Hook'],
  //     },
  //   ]

  //   let currentOptions
  //   if (Array.isArray(handlers)) {
  //     currentOptions = findHandler(
  //       req.headers.referer.split('?').shift(),
  //       handlers
  //     )
  //   } else {
  //     currentOptions = handlers
  //   }

  //   console.log(currentOptions)
  //   if (!currentOptions) {
  //     return ctx.returnCtxBody(400, {}, 'illegal access')
  //   }

  //   checkType(currentOptions)

  //   if (
  //     req.headers.referer.split('?').shift() !== currentOptions.path ||
  //     req.method !== 'POST'
  //   ) {
  //     return ctx.returnCtxBody(400, {}, 'illegal access')
  //   }

  //   const token = req.headers['x-gitlab-token']
  //   if (!token || token !== currentOptions.secret) {
  //     return ctx.returnCtxBody(
  //       400,
  //       {},
  //       'no X-Gitlab-Token found on request or the token did not match'
  //     )
  //   }

  //   const event = req.headers['x-gitlab-event']
  //   const events = currentOptions.events

  //   if (!event) {
  //     return ctx.returnCtxBody(400, {}, 'no X-Gitlab-Event found on request')
  //   }

  //   if (events && events.indexOf(event) === -1) {
  //     return ctx.returnCtxBody(400, {}, 'X-Gitlab-Event is not acceptable')
  //   }

  //   const { body } = ctx.request
  //   console.log(body)
  //   ctx.returnCtxBody(200, { ok: true }, 'success')

  //   await this.getSource(body)

  //   return
  // }

  async getSource(solutions, info) {
    const { ctx } = this
    const { name, git_http_url, branch } = info.repository

    return new Promise((resolve, reject) => {
      // const url = info.repository.git_http_url.split('.git')[0]

      const dirPath = path.resolve(__dirname, '../public/temp')
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath)
        console.log('temp 创建成功')
      }

      // 支持分支选择构建
      const args = branch
        ? ['clone', '-b', branch, git_http_url]
        : ['clone', git_http_url]

      // git clone
      process.chdir(dirPath)
      run('git', [...args], async () => {
        console.log(`branch:${branch} clone complete`)
        await ctx.service.establish
          .build(solutions, name, dirPath)
          .catch(err => {
            ctx.service.establish
              .clearTemp()
              .then(() => reject(new Error(err)))
              .catch(e => reject(new Error(`${err} & ${e}`)))
          })
        resolve('ok')
      })

      // git http download
      // const filePath = `${url}/repository/archive.zip?ref=master`
      // const fileName = `${name}.zip`

      // const stream = fs.createWriteStream(path.resolve(dirPath, fileName))

      // request(filePath, err => {
      //   if (err) {
      //     // throw new Error(err)
      //     reject(new Error(err))
      //   }
      // })
      //   .pipe(stream)
      //   .on('close', async () => {
      //     await this.unCompress(fileName)
      //     await ctx.service.establish.build(name, dirPath)
      //     resolve('ok')
      //   })
    })
  }

  async unCompress(from) {
    await compressing.zip
      .uncompress(
        path.resolve(__dirname, `../public/temp/${from}`),
        path.resolve(__dirname, '../public/temp')
      )
      .catch(err => {
        console.error(err)
      })
  }
}

module.exports = WebhookService
