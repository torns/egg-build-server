// vue.config.js

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ?
    '/' : '/',
  productionSourceMap: true,
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/assets/styles/_variables.scss";`
      }
    }
  }
}