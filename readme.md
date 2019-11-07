# js_marquee

## 2019.10.25

### Webpack重构

目标：使用webpack重构，复原演示效果

```bash
npm init -y
yarn add webpack webpack-cli -D
```

> 对于大多数项目，我们建议本地安装。这可以使我们在引入破坏式变更(breaking change)的依赖时，更容易分别升级项目。


新建index.html(script引入lodash)和index.js

在此示例中，<script> 标签之间存在隐式依赖关系。index.js 文件执行之前，还依赖于页面中引入的 lodash。之所以说是隐式的是因为 index.js 并未显式声明需要引入 lodash，只是假定推测已经存在一个全局变量 _。

使用这种方式去管理 JavaScript 项目会有一些问题：

无法立即体现，脚本的执行依赖于外部扩展库(external library)。
如果依赖不存在，或者引入顺序错误，应用程序将无法正常运行。
如果依赖被引入但是并没有使用，浏览器将被迫下载无用代码。

#### 创建一个 bundle 文件

```
yarn add lodash
```

新建webpack.config.js并添加以下内容
```js
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
}
```

执行 npx webpack --config webpack.config.js 可以看到dist文件夹中有bundle.js

移动index.html至dist文件夹并将引用改为bundle.js，即可在浏览器中看到hello webpack的字样。

### 管理资源

#### 加载css

为了从 JavaScript 模块中 import 一个 CSS 文件，你需要在 module 配置中 安装并添加 style-loader 和 css-loader：

```bash
yarn add style-loader css-loader -D
```

```js
// src/index.js
element.classList.add('hello')
```

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
}
```

less支持

```bash
yarn add less-loader less -D
```

```js
module.exports = {
  module: {
    rules: [
      ...,
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',  // 从js中创建style标签
          },
          {
            loader: 'css-loader',  // 将css编译为CommonJS
          },
          {
            loader: 'less-loader',   // 编译less为css
          },
        ]
      }
    ]
  }
}
```

scss支持

```bash
yarn add sass-loader node-sass -D
```

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      ...,
      { 
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader',   // 将 Sass 编译成 CSS
            options: {

            }
          },
        ]
      },
    ]
  }
}
```

图片支持

file-loader可以支持在js中引用图片和在css中设置背景图片

```bash
yarn add file-loader -D
```

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      ...,
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      }
    ]
  }
}
```

那么，像字体这样的其他资源如何处理呢？
file-loader 和 url-loader 可以接收并加载任何文件，然后将其输出到构建目录。这就是说，我们可以将它们用于任何类型的文件，包括字体。

webpack是默认支持json的，所以import './data.json'是可以正常运行的。
导入json的值是一个对象，可以直接点出属性

```js
import jsonData from './assets/data/data.json'

console.log('jsonData', jsonData, typeof jsonData, jsonData.name)
// jsonData,  {name: 'cellerchan', object, 'cellerchan'}
```

添加loader支持其他的数据文件类型：

```bash
yarn add csv-loader xml-loader -D
```

```js
// wbepack.config.js
module.exports = {
  module: {
    ...,
    rules: [
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
```

与jsonData类似，通过添加loader支持后，可以通过import导入数据文件，返回值为一个对象

```js
import xmlData from './assets/data/data.xml'
console.log('xmlData', xmlData, typeof xmlData, xmlData.note)
// xmlData {note: {…}} object {to: Array(1), from: Array(1), heading: Array(1), body: Array(1)}
```

> 在使用 d3 等工具来实现某些数据可视化时，预加载数据会非常有用。我们可以不用再发送 ajax 请求，然后于运行时解析数据，而是在构建过程中将其提前载入并打包到模块中，以便浏览器加载模块后，可以立即从模块中解析数据。

**能不用就最好不用sass，因为node-sass只要一装依赖就会卡半天不动。**


### 管理输出

#### 设定 HtmlWebpackPlugin

```
yarn add html-webpack-plugin -D
```

```js
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  ...,
  plugins: {
    new HtmlWebpackPlugin({
      title: 'output management'
    })
  }
}
```

在我们构建之前，你应该了解，虽然在 dist/ 文件夹我们已经有 index.html 这个文件，然而 HtmlWebpackPlugin 还是会默认生成 index.html 文件。这就是说，它会用新生成的 index.html 文件，把我们的原来的替换。

参考： https://github.com/jantimon/html-webpack-plugin
https://github.com/jaketrent/html-webpack-template


#### 清理dist文件夹

```bash
yarn add clean-webpack-plugin -D
```

```js
// 这里注意CleanWebpackPlugin在新版本中是clean-webpack-plugin插件默认导出的对象的一个方法, 不再是默认导出了
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
module.exports = {
  // 每次打包前清理打包文件夹 默认会清除output.path指向的文件夹 不需要指定文件夹， 配置为一个对象
  //  If using webpack 4+'s default configuration,
  // * everything under <PROJECT_DIR>/dist/ will be removed.
  //  * Use cleanOnceBeforeBuildPatterns to override this behavior.
  new CleanWebpackPlugin(),
}
```

参考： https://github.com/johnagan/clean-webpack-plugin#options-and-defaults-optional

问：webpack中的manifest是什么？




### 开发

webpack中有几种不同的选项 可以帮助你在代码发生变化后自动编译代码。
- webpack的观察(watch)模式
- webpack-dev-server
- webpack-dev-middleware

多数场景中，你可能需要使用 webpack-dev-server，但是不妨探讨一下以上的所有选项。

#### 观察模式

添加一条script
```json
// package.json
{
  "scripts": {
    "watch": "webpack --watch"
  },
}
```

然后在命令行中运行 `yarn watch`

就会看到 webpack 编译代码，然而却不会退出命令行。这是因为 script 脚本还在观察文件。

此时更改文件并保存时webpack就会自动重新编译。

#### 使用webpack-dev-server

```bash
yarn add webpack-dev-server -D
```

添加script
```json
// package.json
{
  "scripts": {
    "dev": "webpack-dev-server --open"
  },
}
```

```js
// webpack.config.js
module.exports = {
  devServer: {
    contentBase: './dist',
    port: 9000
  },
}
```

以上配置告诉webpack-dev-server 在localhost:9000(不配置默认8080端口)下建立服务 将dist目录下的文件作为可访问文件。

此时执行 `yarn dev` 就会看到浏览器自动打开了localhost:9000加载页面。如果现在修改和保存任意源文件，web 服务器就会自动重新加载编译后的代码

#### webpack-dev-middleware

webpack-dev-middleware是一个容器，它可以把 webpack 处理后的文件传递给一个服务器(server)。 webpack-dev-server 在内部使用了它，同时，它也可以作为一个单独的包来使用，以便进行更多自定义设置来实现更多的需求。

这里不做深入了解。


### 模块热替换

模块热替换(Hot Module Replacement)是webpack提供的最有用的功能之一， 它允许在运行时更新各个模块而无需完全刷新。

> HMR 不适用于生产环境，这意味着它应当只在开发环境使用

[概念](https://www.webpackjs.com/concepts/hot-module-replacement/#%E8%BF%99%E4%B8%80%E5%88%87%E6%98%AF%E5%A6%82%E4%BD%95%E8%BF%90%E8%A1%8C%E7%9A%84-)

> 你可以通过命令来修改 webpack-dev-server 的配置：webpack-dev-server --hotOnly。

#### 开启模块热替换(HMR)

```js
// webpack.config.js
const webpack = require('webpack')
module.exports = {
  entry: {
    app: './src/index.js'   // index.js中引入了print.js 所以删除掉print.js入口
  },
  plugins: [
    // 方便更容易查看要修补的依赖
    new webpack.NamedModulesPlugin(),
    // 运行模块热替换插件
    new webpack.HotModuleReplacementPlugin(),
  ]
}
```

在index.js中加入以下代码

```js
// index.js
import printMe from './print'
if ( module.hot ) {
  // 监听print.js文件 如果print.js文件发生更改则开发服务会热替换, 仅替换print.js模块 如果没有这段代码 更改print.js后开发服务就会全量更新
  module.hot.accept('./print.js', function(){
    console.log('accepting the updated printMe module!')
    printMe()
  })
}
```

这时更新print.js就会发现控制台只是增加打印 之前的打印不会清除 页面也没有刷新，就证明模块热替换开启成功了。

但是存在一个问题，按钮的事件仍然绑定在旧的printMe函数上。

HMR需要深入研究，所以先不开启。




