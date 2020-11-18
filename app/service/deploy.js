/*
 * @Author: Whzcorcd
 * @Date: 2020-08-10 20:05:48
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-11-18 15:10:50
 * @Description: file content
 */

'use strict'

const fs = require('fs-extra')
const rimraf = require('rimraf')
const path = require('path')
const ncp = require('nginx-config-parser')

const Service = require('egg').Service

function remove(path) {
  return new Promise((resolve, reject) => {
    rimraf(path, err => {
      if (err) {
        console.log(err)
        return reject(err)
      }
      return resolve('ok')
    })
  })
}

class DeployService extends Service {
  async index(solutions, path) {
    const { ctx } = this
    return new Promise(async (resolve, reject) => {
      const config = await ctx.service.analysis
        .getProjectConfig(solutions, path)
        .catch(err => {
          console.error(err)
          reject(err)
        })
      this.deployProject(solutions, path, config)
      resolve(config)
    })
  }

  async deployProject(solutions, filePath, yamlData) {
    const project = yamlData.target.project
    const location = yamlData.target.location
    const server = yamlData.target.server
    const spa = Boolean(yamlData.config.spa)
    const ssr = Boolean(yamlData.config.ssr)
    const folder = yamlData.config.folder || 'dist'
    const proxy = yamlData.config.proxy || ''

    const projectPath = path.resolve(
      __dirname,
      `../public/workspace/${solutions}/${project}`
    )
    // 统一为先创建项目
    // if (!fs.existsSync(projectPath)) {
    //   fs.mkdirSync(projectPath)
    //   fs.copyFileSync(NGINX_LOCATION, `${projectPath}/nginx.conf`)
    //   console.log('项目创建成功')
    // }
    if (!ssr) {
      // ssr 项目不参与主包部署
      console.log('子项目开始部署', projectPath)

      if (!fs.existsSync(`${projectPath}/app/${location}`)) {
        fs.mkdirSync(`${projectPath}/app/${location}`)
        console.log('子项目创建成功')
      } else {
        await remove(`${projectPath}/app/${location}`).catch(err => {
          throw new Error(err)
        })
      }

      try {
        fs.renameSync(`${filePath}/${folder}`, `${projectPath}/app/${location}`)
        console.log('子项目部署完成')
      } catch (err) {
        // TODO 完善已存在的情况
        console.warn('目标子项目已存在，将被覆盖')
        throw new Error(err)
      }
    }

    this.addNginxLocation(
      server,
      location,
      spa,
      ssr,
      proxy,
      `${projectPath}/nginx.conf`
    )
  }

  async addNginxLocation(
    server,
    location,
    spa = false,
    ssr = false,
    proxy = '',
    nginxPath = ''
  ) {
    try {
      const config = ncp.queryFromString(fs.readFileSync(nginxPath, 'utf-8'))

      config
        .find('http', 'server')
        .where('server_name')
        .match(new RegExp(server))
        .find(`location /${location}`)
        .remove()

      if (spa && ssr) {
        throw new Error('spa 和 ssr 模式不可同时设置')
      }

      // 常规
      if (!spa && !ssr) {
        config
          .find('http', 'server')
          .where('server_name')
          .match(new RegExp(server))
          .createNewNode(`location /${location}`)
          .addDirective('add_header', 'Cache-Control', '"no-cache, no-store"')
          .addDirective('index', `/${location}/index.html`)
          .addToQuery()
      }

      // spa
      if (spa && !ssr) {
        config
          .find('http', 'server')
          .where('server_name')
          .match(new RegExp(server))
          .createNewNode(`location /${location}`)
          .addDirective('add_header', 'Cache-Control', '"no-cache, no-store"')
          .addDirective('try_files', '$uri', '$uri/', `/${location}/index.html`)
          .addToQuery()
      }

      // ssr，直接填写代理地址
      if (!spa && ssr) {
        // TODO 大部分修改
        config
          .find('http', 'server')
          .where('server_name')
          .match(new RegExp(server))
          .find('location /')
          .remove()

        config
          .find('http', 'server')
          .where('server_name')
          .match(new RegExp(server))
          .find('location ~* .(css|js)$')
          .remove()

        config
          .find('http', 'server')
          .where('server_name')
          .match(new RegExp(server))
          .find('location ~* .(jpg|jpeg|png|gif|webp|bmp|swf)$')
          .remove()

        config
          .find('http', 'server')
          .where('server_name')
          .match(new RegExp(server))
          .find('location ~ ^.*[^/]$')
          .remove()

        config
          .find('http', 'server')
          .where('server_name')
          .match(new RegExp(server))
          .find('location @rewrite')
          .remove()

        config
          .find('http', 'server')
          .where('server_name')
          .match(new RegExp(server))
          .createNewNode(`location /${location}`)
          .addDirective('add_header', 'Vary', '"Accept-Encoding, User-Agent"')
          .addDirective('proxy_http_version', '1.1')
          .addDirective('proxy_pass', proxy)
          .addDirective('index', 'index.html', 'index.htm')
          .addToQuery()
      }

      fs.writeFileSync(nginxPath, config.stringify())
    } catch (err) {
      throw new Error(err)
    }
  }
}

module.exports = DeployService
