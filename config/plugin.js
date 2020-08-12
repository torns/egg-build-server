/*
 * @Author: Whzcorcd
 * @Date: 2020-08-10 11:35:45
 * @LastEditors: Wzhcorcd
 * @LastEditTime: 2020-08-10 19:47:54
 * @Description: file content
 */

'use strict'

/** @type Egg.EggPlugin */
module.exports = {
  validate: {
    enable: true,
    package: 'egg-validate',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  snowflake: {
    enable: true,
    package: 'egg-snowflake',
  },
}
