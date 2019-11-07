const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  entry: './src/index.js',
  // entry: {
  //   // app: './src/index.js',
  //   // print: './src/print.js'
  // },
  mode: 'development',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  // devtool: 'inline-source-map',
  // devServer: {
  //   contentBase: './dist',
  //   port: 9009,
  //   hot: true,  // 开启模块热替换 而不是全部更新
  // },
  plugins: [
    // 每次打包前清理打包文件夹 默认会清除output.path指向的文件夹
    new CleanWebpackPlugin(),
    // 自动生成index.html
    new HtmlWebpackPlugin({
      title: 'Development',
    }),
    // 方便更容易查看要修补的依赖
    new webpack.NamedModulesPlugin(),
    // 运行模块热替换插件
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [
      // css支持
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      // less支持
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',  // 将 JS 字符串生成为 style 节点
          },
          {
            loader: 'css-loader',  // 将 CSS 转化成 CommonJS 模块
          },
          {
            loader: 'less-loader',   // 将 less 编译成 CSS
          },
        ]
      },
      // 图片支持
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader'    // 增加在js中引用图片和在css中设置背景图片支持
          }
        ]
      },
      // 字体支持
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      // 加载数据 默认支持json 所以不需要添加, 添加csv/tsv/xml类型的数据支持
      {
        test: /\.(csv|tsv)$/,
        use: [
          {
            loader: 'csv-loader'
          }
        ]
      },
      {
        test: /\.xml$/,
        use: [
          {
            loader: 'xml-loader'
          }
        ]
      },
    ]
  }
}