/*
 * @Author: Whzcorcd
 * @Date: 2020-08-10 20:05:48
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-11-18 11:00:16
 * @Description: file content
 */

'use strict'

const YAML = require('yamljs')
const fs = require('fs-extra')

const Service = require('egg').Service

class AnalysisService extends Service {
  async getProjectConfig(solutions, path) {
    return new Promise((resolve, reject) => {
      try {
        if (fs.existsSync(`${path}/build.yml`)) {
          const file = fs.readFileSync(`${path}/build.yml`).toString()
          if (!file) reject(new Error('项目内配置文件不能为空'))

          const data = YAML.parse(file)
          console.log(data[solutions])
          resolve(data[solutions])
        } else {
          reject(new Error('项目内配置文件不存在'))
        }
      } catch (err) {
        reject(err)
      }
    })
  }
}

module.exports = AnalysisService
