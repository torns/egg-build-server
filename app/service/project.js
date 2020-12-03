/*
 * @Author: Whzcorcd
 * @Date: 2020-08-13 10:18:42
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-03 13:27:53
 * @Description: file content
 */

'use strict'

const YAML = require('yamljs')
const fs = require('fs-extra')
const path = require('path')
const ncp = require('nginx-config-parser')

const Service = require('egg').Service

// 项目操作模块
class ProjectService extends Service {
  async createNewSolutions(name) {
    const targetPath = path.resolve(__dirname, `../public/workspace/${name}`)

    try {
      if (fs.existsSync(targetPath)) {
        console.log('项目已存在，请勿重复创建')
        return false
      }

      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath)
      }
    } catch (err) {
      throw new Error(err)
    }

    return true
  }

  async createNewProject(solutions, name, configuration) {
    const originalPath = path.resolve(__dirname, '../public/original')
    const configPath = path.resolve(
      __dirname,
      `../public/workspace/${solutions}/${name}/config.yml`
    )
    const targetPath = path.resolve(
      __dirname,
      `../public/workspace/${solutions}/${name}`
    )

    try {
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath)
        fs.mkdirSync(`${targetPath}/app`)
      }
      if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, '')
      } else {
        console.log('项目配置文件已存在')
        return false
      }

      const data = {
        property: {
          server: configuration.server,
          domain: configuration.domain,
          port: configuration.port,
          sslport: configuration.sslport,
          ssl: configuration.ssl,
          certificate: configuration.certificate,
          key: configuration.key,
        },
        configuration: { imagename: configuration.imagename },
      }
      // const data = YAML.parse(json.toString())
      fs.writeFileSync(configPath, YAML.stringify(data))
      const {
        server,
        domain,
        port,
        sslport,
        ssl,
        certificate,
        key,
      } = data.property
      const files = fs.readdirSync(originalPath)

      files.forEach(item => {
        fs.copyFileSync(`${originalPath}/${item}`, `${targetPath}/${item}`)
      })

      const config = ncp.queryFromString(
        fs.readFileSync(`${targetPath}/nginx.conf`, 'utf-8')
      )

      fs.writeFileSync(
        `${targetPath}/nginx.conf`,
        config
          .stringify()
          .replace('your_website_server_name', server)
          .replace('your_website_domain', domain)
          .replace('your_website_domain', domain)
          .replace('your_website_port', port)
          .replace('your_website_ssl_port', sslport)
          .replace('your_ssl_certificate_address', certificate)
          .replace('your_ssl_certificate_key_address', key)
      )
    } catch (err) {
      throw new Error(err)
    }

    return true
  }

  async packProject(solutions, name, tag) {
    const { ctx } = this

    const filePath = path.resolve(
      __dirname,
      `../public/workspace/${solutions}/${name}/config.yml`
    )
    const projectPath = path.resolve(
      __dirname,
      `../public/workspace/${solutions}/${name}`
    )

    try {
      if (!fs.existsSync(filePath)) {
        console.log('项目配置文件不存在')
        return false
      }

      if (!fs.existsSync(projectPath)) {
        console.log('项目不存在')
        return false
      }

      const data = YAML.parse(fs.readFileSync(filePath).toString())
      const { imagename } = data.configuration

      process.chdir(projectPath)

      await ctx
        .runCommandWithSpawn('docker', [
          'image',
          'build',
          '-f',
          'Dockerfile',
          '-t',
          `${imagename}:${tag}`,
          '.',
        ])
        .catch(err => console.error(err))

      console.log('镜像构建完成，开始推送')

      await ctx
        .runCommandWithSpawn('docker', ['push', `${imagename}:${tag}`])
        .catch(err => console.error(err))

      console.log('镜像推送完成')
      return true
    } catch (err) {
      throw new Error(err)
    }
  }
}

module.exports = ProjectService
