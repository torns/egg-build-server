/*
 * @Author: Whzcorcd
 * @Date: 2020-08-10 17:06:30
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-08-12 09:03:01
 * @Description: file content
 */

'use strict'

const which = require('which')

module.exports = {
  // 查找系统中用于安装依赖包的命令
  find() {
    const npms = ['yarn', 'npm', 'tnpm', 'cnpm']
    for (let i = 0; i < npms.length; i++) {
      try {
        // 查找环境变量下指定的可执行文件的第一个实例
        which.sync(npms[i])
        console.log('use npm: ' + npms[i])
        return npms[i]
      } catch (err) {
        throw new Error(err)
      }
    }
    throw new Error('please install Npm/Yarn')
  },

  /**
   * 生成 console 错误信息
   * @param {string} msg 错误信息
   */
  consoleError(msg) {
    return `console.error('${String(msg)}')`
  },

  /**
   * 返回客户端接口标准化内容
   * @param {number} status 返回状态
   * @param {any} data 返回内容
   * @param {string} msg 返回信息
   */
  returnCtxBody(status, data = {}, msg) {
    // this 即 ctx
    this.status = status
    this.body = {
      status,
      data,
      msg,
    }
  },
}
