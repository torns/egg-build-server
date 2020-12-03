/*
 * @Author: Whzcorcd
 * @Date: 2020-12-03 11:32:32
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-03 13:54:24
 * @Description: file content
 */

'use strict'

let reportList = []

const Service = require('egg').Service

// 数据报告模块
class ReportService extends Service {
  async initReportList() {
    reportList = []
  }

  async addNewItem({ name, status, step = '' }) {
    reportList.push({ name, step, status })
  }

  async publishReport() {
    console.log('\n\n构建报告：')
    console.log(`构建总数：${reportList.length}`)
    console.log(
      `通过：${reportList.filter(item => item.status).length}，未通过：${
        reportList.filter(item => !item.status).length
      }`
    )
    console.log('\n')
    console.log('未通过项目报告：')

    const tableArr = reportList
      .filter(item => !item.status)
      .map(item => {
        return { 项目名: item.name, 异常步骤: item.step }
      })
    console.table(tableArr)
    console.log('\n')
    this.initReportList()
  }
}

module.exports = ReportService
