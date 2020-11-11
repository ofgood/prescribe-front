
<h1 align="center">处方管理系统</h1>
<div align="center">
    处方管理系统前台说明
</div>

<div align="center">

[![License](https://img.shields.io/npm/l/package.json.svg?style=flat)](https://github.com/vueComponent/ant-design-vue-pro/blob/master/LICENSE)
[![Release](https://img.shields.io/github/release/vueComponent/ant-design-vue-pro.svg?style=flat)](https://github.com/vueComponent/ant-design-vue-pro/releases/latest)
[![Travis branch](https://travis-ci.org/vueComponent/ant-design-vue-pro.svg?branch=master)](https://travis-ci.org/vueComponent/ant-design-vue-pro)

</div>


Overview
----

![dashboard]()

环境和依赖
----

- node
- npm
- webpack
- eslint
- @vue/cli ~3
- [ant-design-vue](https://github.com/vueComponent/ant-design-vue) - Ant Design Of Vue 实现
- [vue-cropper](https://github.com/xyxiao001/vue-cropper) - 头像裁剪组件
- [@antv/g2](https://antv.alipay.com/zh-cn/index.html) - Alipay AntV 数据可视化图表
- [Viser-vue](https://viserjs.github.io/docs.html#/viser/guide/installation)  - antv/g2 封装实现




项目运行
----

- 安装依赖
```
npm install
```

- 开发模式运行
```
npm run serve
```

- 编译项目
```
npm run build
```

- Lints and fixes files
```
npm run lint
```



其他说明
----

- **关于 Issue 反馈 (重要!重要!重要!) 请在开 *Issue* 前，先阅读该内容：[Issue / PR 编写建议](https://github.com/vueComponent/ant-design-vue-pro/issues/90)** 

- 项目使用的 [vue-cli3](https://cli.vuejs.org/guide/), 请确保你所使用的 vue-cli 是新版，并且已经学习 cli 官方文档使用教程

- 关闭 Eslint (不推荐) 移除 `package.json` 中 `eslintConfig` 整个节点代码, `vue.config.js` 下的 `lintOnSave` 值改为 `false`

- 组件按需加载 `/src/main.js` L14 相关代码 `import './core/lazy_use'` / `import './core/use'` 

- [修改 Ant Design 配色 (@kokoroli)](https://github.com/kokoroli/antd-awesome/blob/master/docs/Ant_Design_%E6%A0%B7%E5%BC%8F%E8%A6%86%E7%9B%96.md)

- I18n: [多语言支持 (@musnow)](./src/locales/index.js)

- 生成环境默认不加载 `mock`，更多详情请看 `src/mock/index.js`

- **用于生产环境，请使用 `release` 版本代码，使用 master 代码出现的任何问题需要你自行解决**

## 浏览器兼容

Modern browsers and IE10.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --- | --- | --- | --- | --- |
| IE10, Edge | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

