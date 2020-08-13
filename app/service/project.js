/*
 * @Author: Whzcorcd
 * @Date: 2020-08-13 10:18:42
 * @LastEditors: Wzhcorcd
 * @LastEditTime: 2020-08-13 16:31:53
 * @Description: file content
 */

'use strict'

const YAML = require('yamljs')
const fs = require('fs-extra')
const path = require('path')
const ncp = require('nginx-config-parser')

const Service = require('egg').Service

class ProjectService extends Service {
  async createNewProject(name) {
    const originalPath = path.resolve(__dirname, '../public/original')
    const configPath = path.resolve(__dirname, '../public/config')
    const filePath = `${configPath}/${name}.yml`
    const targetPath = path.resolve(__dirname, `../public/workspace/${name}`)

    if (!fs.existsSync(filePath)) {
      console.log('项目配置文件不存在')
      return false
    }

    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath)
      fs.mkdirSync(`${targetPath}/app`)
    }

    try {
      const data = YAML.parse(fs.readFileSync(filePath).toString())
      const { server, port } = data.property
      const files = fs.readdirSync(originalPath)

      files.forEach(item => {
        fs.copyFileSync(`${originalPath}/${item}`, `${targetPath}/${item}`)
      })

      const config = ncp.queryFromString(
        fs.readFileSync(`${targetPath}/nginx.conf`, 'utf-8')
      )

      fs.writeFileSync(
        `${targetPath}/nginx.conf`,
        config.stringify().replace('your_website_server_name', server)
      )
    } catch (err) {
      console.log(err)
      return false
    }

    return true
  }
}

module.exports = ProjectService
