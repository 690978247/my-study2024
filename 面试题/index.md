### JS

#### JS 为什么会阻碍渲染？

因为 JS 是单线程的，JS 代码执行和页面渲染都在一个线程上面，执行js时页面渲染会等待js执行完成之后才会继续执行

### 工程化

#### 什么是前端工程化？

前端工程化是指在前端开发过程中，通过一系列标准化、模块化、工具化、自动化的方法，提高开发效率，代码质量和团队协作能力的实践

带来的意义：

- 提高开发效率
- 提升代码质量
- 增强团队协作
- 提高项目可维护性
- 加速项目交付

#### Webpack 和 Vite 有什么区别? 各自优缺点是什么?

webpack和 vite 都是前端构建工具，但它们在构建理念和实现方式上有较大区别

webpack 是一种模块打包工具，主要功能是将各种资源（如 Javascript、Css、图片等）通过 loader 和 plugin 转换和打包成可以直接在浏览器中运行的代码，其核心思想是以代码分割、按需加载和优化资源来提升性能

vite 是一种新型构建工具，利用原生（ESM）和现代浏览器特性，提供快速开发和构建体验。vite 的核心思想是在开发环境中直接利用浏览器的 ESM 功能，以提升启动和热更新速度

**webpack 优缺点：**

- 优点：
  - 高度可配置，可以应对各种复杂的项目需求
  - 社区资源丰富，有大量的loader和plugin可以使用
  - 得到了广泛的应用和支持，在生产环境中非常成熟和稳定

- 缺点
  - 配置较为复杂，新手上手难度高
  - 开发环境下编译速度较慢，尤其是在大项目中
  - 热更新（HMR）速度慢

**vite 优缺点**

- 优点：
  - 开发环境下编译速度快，启动速度快。因为它是基于现代浏览器的 ESM 处理
  - 热更新速度非常快，几乎是瞬时的。
  - 开箱即用，配置较为简单，适合小型和中型项目

- 缺点：
  - 生态系统不如webpack丰富，某些复杂需求需要自定义解决方案
  - 在某些环境下会有兼容性问题
  - 生产环境打包速度和webpack相差无几，但没有webpack成熟

### webpack

#### webpack 核心原理

webpack的核心原理是通过模块打包的方式将代码和资源转化为浏览器可执行的静态文件。它会递归的解析项目中的各种依赖，然后通过loader和plugin进行代码转换和扩展，最终生成优化后的静态资源文件。具体来说，它主要包括入口（entry）、输出（output）、loader、plugin、和模式（mode）五个核心概念

要更详细的理解webpack的核心原理，我们需要了解以下几个方面

- 模块化依赖管理：webpack 是一个模块打包工具，它通过配置入口文件来解析项目中的模块依赖关系。它会从入口文件出发，递归的将各个依赖的模块和资源打包在一起。
- loader: webpack 本身只理解 Javascript, 但项目中可能包含各种各样的静态资源（比如CSS, 图片）。loader 是一种文件转换器，它用于将非 Javascript 文件转换为webpack可以识别和处理的模块。常用的loader包括css-loader,style-loader, babel-loader,file-loader等。
- plugin: 插件用于扩展webpack的功能，插件的范围非常广泛，可以用来优化打包后的代码、自动生成HTML文件、进行代码分割等。常见的插件包括HtmlWebpackPlugin, CleanWebpackPlugin, MiniCssExtractPlugin等。
- 输出：输出定义了打包后文件存放路径和文件名。webpack 会根据配置将打包生成的文件输出到指定的文件中
- 模式（mode）: webpack 有两种模式：开发模式（develop）和生产模式（production）。开发模式侧重与提升构建速度和调试体验，而生产模式则会进行代码压缩和优化以提高效率。

总结来说，webpack 的核心原理在于通过配置文件来描述模块之间的依赖关系，使用loader处理不同类型的文件，并通过插件扩展功能，最终生成浏览器使用的静态资源文件。这种机制大幅度提高了前端开发的效率和代码的可维护性

#### Webpack的 Tree Shaking 机制的原理是什么?

通过静态分析代码的模块依赖图，将未使用的代码移除掉，主要依赖于ES6 的模块系统

**过程：**

1. **标记（Marking）**: Webpack 会从入口文件出发，递归的分析代码中的模块依赖，标记出用到的模块和导出的函数或变量
2. **摇树（Shaking）**: 基于上一步的标记结果，Webpack会移除未被使用的模块和代码（即那些没有被标记的部分）
3. **生成（Bundle Generation）**: 最后，Webpack会生成最终的打包文件，只包含被使用的必要代码

Tree Shaking 的前提是对代码进行静态分析。静态分析是一种在无需运行代码的情况下，基于代码的语法和结构，分析代码的行为以及性能的方法。Webpack 使用的是 UglifyJS/Terser 插件来完成这项工作

webpack5 可以使用 Esbuild?

#### 如何使用 webpack 进行异步加载？

Webpack 的异步加载主要是通过`import()`语法。这种方法可以让我们在需要某个模块时再进行加载，而不是在初始加载时一次性加载所有模块，从而提高性能和首屏加载速度。Webpack 会根据这个语法将模块打包成独立的文件，等到实际使用时才进行加载

**1.使用场景**

-当某些模块是只有在某些用户操作（比如点击按钮）时才需要加载
-页面中有一些非常大的模块,但初始访问时并不需要它们

**2.实例代码**

``` eg
// 普通import语法
import something from './module'

// 异步加载
document.getElementById('myButton').addEventListener('click', () => {
  import('./module').then(module => {
    //模块加载成功，现在可以使用其导出的内容
    const something  = module.default
    something.dosomething()
  }).catch(err => {
    console.error('模块加载失败'，err)
  })
})

```

**3. Webpack 配置：**
通常情况下，只需要在项目中安装好 Webpack 和其所需的 Loader 和插件，Webpack默认就可以支持`import()`语法，无需额外配置。

**4. 代码分离：**
Webpack 的代码分离功能不仅可以通过异步加载实现，还可以通过`entry`配置、`SplitChunksPlugin` 插件等不同的方法来优化代码分离。以下是通过`SplitChunkPlugin`插件分离第三方库(如`lodash`)的示例：

``` javascript
// webpack.config.js
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
}

```



### Vue

#### Vue 常见优化手段

1.使用Key

- 对于通过循环生成的列表，应给每个列表项一个稳定且唯一的key, 这有利于在列表变动时，尽量少的删除、新增、改动元素

2.使用冻结的对象

- 冻结的对象不会被响应化

3.使用函数式组件
