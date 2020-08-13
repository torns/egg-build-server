/*
 * @Author: Whzcorcd
 * @Date: 2020-08-10 20:05:48
 * @LastEditors: Wzhcorcd
 * @LastEditTime: 2020-08-13 16:16:53
 * @Description: file content
 */

'use strict'

const YAML = require('yamljs')
const fs = require('fs-extra')
const path = require('path')
const ncp = require('nginx-config-parser')

const NGINX_LOCATION = path.resolve(__dirname, '../public/original/nginx.conf')

const Service = require('egg').Service

class DeployService extends Service {
  async index(path) {
    return new Promise((resolve, reject) => {
      try {
        const file = fs.readFileSync(`${path}/build.yml`).toString()

        if (!file) return

        const data = YAML.parse(file)
        this.deployProject(path, data)
        resolve(data)
      } catch (err) {
        reject(err)
      }
    })
  }

  async deployProject(filePath, yamlData) {
    const project = yamlData.target.project
    const location = yamlData.target.location
    const server = yamlData.target.server
    const spa = Boolean(yamlData.config.spa)
    const ssr = Boolean(yamlData.config.ssr)
    const folder = yamlData.config.folder || 'dist'

    const projectPath = path.resolve(
      __dirname,
      `../public/workspace/${project}`
    )
    // 统一为先创建项目
    // if (!fs.existsSync(projectPath)) {
    //   fs.mkdirSync(projectPath)
    //   fs.copyFileSync(NGINX_LOCATION, `${projectPath}/nginx.conf`)
    //   console.log('项目创建成功')
    // }

    if (!fs.existsSync(`${projectPath}/app/${location}`)) {
      fs.mkdirSync(`${projectPath}/app/${location}`)
      console.log('子项目创建成功')
    }

    try {
      fs.renameSync(
        `${filePath}/${folder}`,
        path.resolve(
          __dirname,
          `../public/workspace/${project}/app/${location}`
        )
      )
    } catch (err) {
      console.log(err)
    }

    this.addNginxLocation(server, location, `${projectPath}/nginx.conf`)
  }

  async addNginxLocation(server, location, nginxPath) {
    // TODO 异常处理
    const config = ncp.queryFromString(fs.readFileSync(nginxPath, 'utf-8'))

    config
      .find('http', 'server')
      .where('server_name')
      .match(new RegExp(server))
      .find(`location /${location}`)
      .remove()

    // TODO 支持 spa 区分
    config
      .find('http', 'server')
      .where('server_name')
      .match(new RegExp(server))
      .createNewNode(`location /${location}`)
      .addDirective('add_header', 'Cache-Control', '"no-cache, no-store"')
      .addDirective('try_files', '$uri', '$uri/', `/${location}/index.html`)
      .addToQuery()

    fs.writeFileSync(nginxPath, config.stringify())
  }
}

module.exports = DeployService