const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

function getEntries () {
  /**
   * 1. 找到根文件夹，获取文件夹下的目录列表A
   * 2. 遍历A,判断A中的元素item_A （文件名）加上路径以及 加上/app.ts 这个文件是否存在
   * 3. 如果存在，将item_A作为键，app.ts的绝对路径作为值，放入对象中
   */
  // fs.readdirSync(__dirname) -> [ 'base', 'webpack.config.js' ]
  fs.readdirSync(__dirname).reduce((entries, dir) => {
    const fullDir = path.join(__dirname, dir)
    const entry = path.join(fullDir, 'app.ts')
    // fs.statSync(entry).isDirectory() 判断路径是否是文件夹
    // fs.existsSync(entry) 用于判断文件是否存在
    if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
      entries[dir] = ['webpack-hot-middleware/client?noInfo=true&reload=true', entry]
    }

    return entries
  }, {})
}
module.exports = {
  mode: 'development',
  entry: getEntries(),
  output: {
    path: path.join(__dirname, '__build__'),
    publicPath: '/__build__/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /.ts$/,
        enforce: 'pre',
        use: [
          'tslint-loader'
        ]
      },
      {
        test: /.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              // 谨慎开启，设为true,关闭typescript的语义检查,提高了编译速度，代价就是失去了类型检查以及声明文件的导出
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}
