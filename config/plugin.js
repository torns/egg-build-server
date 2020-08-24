/*
 * @Author: Whzcorcd
 * @Date: 2020-08-10 11:35:45
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-08-15 18:28:50
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
  amqplib: {
    enable: true,
    package: 'egg-amqplib',
  },
  redis: {
    enable: true,
    package: 'egg-redis',
  },
}
