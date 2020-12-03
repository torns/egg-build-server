/*
 * @Author: Whzcorcd
 * @Date: 2020-08-10 20:05:26
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-03 16:40:19
 * @Description: file content
 */

'use strict'

const fs = require('fs-extra')
const which = require('which')

const Service = require('egg').Service

// 项目构建模块
class EstablishService extends Service {
  async build(solutions, name, path) {
    return new Promise((resolve, reject) => {
      const { ctx } = this
      // const ignoreList = ['.zip', '.DS_Store']

      const npm = ctx.find()
      const paths = fs.readdirSync(path)
      console.log(paths)
      if (!paths.includes(name)) reject(new Error('未找到对应项目目录'))

      paths.forEach(async item => {
        if (!item.includes(name)) return
        if (item.includes('.zip')) return

        const config = await ctx.service.analysis
          .getProjectConfig(solutions, `${path}/${item}`)
          .catch(err => {
            console.error(err)
          })

        // console.log(`${path}/${item}`, config)
        // eslint-disable-next-line no-extra-boolean-cast
        if (Boolean(config.config.ssr)) {
          // ssr 项目不参与主包构建
          console.log('当前为 SSR 项目')
          await this.afterBuild(solutions, `${path}/${item}`).catch(err => {
            console.error(err)
          })
          return resolve('skip')
        }

        const command = config.command ? config.command.build : 'build:private'

        process.chdir(`${path}/${item}`)

        // await run(which.sync(npm), ['install'], `${path}/${item}`).catch(
        //   err => {
        //     console.error(`应用安装依赖异常：${err}，请重新尝试`)
        //     this.clearTemp()
        //       .then(() => reject(new Error(err)))
        //       .catch(e => reject(new Error(`${err} & ${e}`)))
        //   }
        // )
        console.log('开始安装依赖')

        try {
          // await ctx.runCommandWithSpawn(npm, ['install'], true)
          await ctx.runCommandWithExec(
            `${npm} install --force`,
            `${path}/${item}`
          )
        } catch (err) {
          console.error(`依赖安装异常：${err}，请重新尝试`)
          ctx.service.report.addNewItem({
            name,
            status: false,
            step: 'install',
          })
          await this.clearTemp()
          return reject(new Error(err))
        }

        console.log('依赖安装完成')
        console.log('\n')
        console.log(`开始项目构建，当前构建命令:${command}`)

        try {
          await ctx.runCommandWithExec(
            `${npm} run ${command}`,
            `${path}/${item}`,
            {
              NODE_ENV: 'production',
            }
          )
        } catch (err) {
          console.error(`项目构建异常：${err}，请重新尝试`)
          ctx.service.report.addNewItem({
            name,
            status: false,
            step: 'build',
          })
          await ctx.clearTemp()
          return reject(new Error(err))
        }

        console.log('项目构建完成')

        await this.afterBuild(solutions, `${path}/${item}`).catch(err => {
          console.error(err)
        })

        ctx.service.report.addNewItem({ name, status: true })
        return resolve('ok')
      })
    })
  }

  async afterBuild(solutions = '', path) {
    const { ctx } = this

    await ctx.service.deploy.index(solutions, path).catch(err => {
      console.error(err)
    })

    await ctx.clearTemp().catch(err => {
      console.error(err)
    })
    return
  }
}

module.exports = EstablishService
