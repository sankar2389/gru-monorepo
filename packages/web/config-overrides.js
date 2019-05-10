const fs = require('fs')
const path = require('path')
const resolve = require('resolve')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

const appIncludes = [
  resolveApp('src'),
  resolveApp('../components/src'),
]

module.exports = function override(config, env) {
  config.resolve.alias['deepmerge$'] = 'deepmerge/dist/umd.js'
  config.resolve.alias['react-native$'] = 'react-native-web'

  // allow importing from outside of src folder
  config.resolve.plugins = config.resolve.plugins.filter(
    plugin => plugin.constructor.name !== 'ModuleScopePlugin',
  )

  config.module.rules[0].include = appIncludes
  config.module.rules[1] = null
  config.module.rules[2].oneOf[1].include = appIncludes
  config.module.rules[2].oneOf[1].options.plugins = [
    require.resolve('babel-plugin-react-native-web'),
  ].concat(config.module.rules[2].oneOf[1].options.plugins)
  config.module.rules = config.module.rules.filter(Boolean)

  config.plugins.push(
    new webpack.DefinePlugin({ __DEV__: env !== 'production' }),
  )

  config.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'report.html',
    }),
  )

  config.plugins.push(
    env === 'production' ? new webpack.DefinePlugin({
      'process.env.CMS_API': JSON.stringify(process.env.CMS_API || 'http://104.248.145.85:1337/')
    }) :
    new webpack.DefinePlugin({
      'process.env.CMS_API': JSON.stringify(process.env.CMS_API || 'http://localhost:1337/')
    })
  )

  return config
}
