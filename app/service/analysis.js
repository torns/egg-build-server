/*
 * @Author: Whzcorcd
 * @Date: 2020-08-10 20:05:48
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-03 13:35:45
 * @Description: file content
 */

'use strict'

const YAML = require('yamljs')
const fs = require('fs-extra')

const Service = require('egg').Service

// 配置文件分析模块
class AnalysisService extends Service {
  async getProjectConfig(solutions, path) {
    return new Promise((resolve, reject) => {
      try {
        if (fs.existsSync(`${path}/build.yml`)) {
          const file = fs.readFileSync(`${path}/build.yml`).toString()

          if (!file) {
            reject(new Error('项目内配置文件不能为空'))
          }

          const data = YAML.parse(file)

          if (data[solutions]) {
            return resolve(data[solutions])
          }
          return reject(new Error('配置文件格式错误'))
        }
        return reject(new Error('项目内配置文件不存在'))
      } catch (err) {
        return reject(err)
      }
    })
  }
}

module.exports = AnalysisService
