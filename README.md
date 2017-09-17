# carder-frontend

> The frontend for Carder.

# 主要依赖

- webpack
- vue
- quasar-framework

# 部署说明

``` bash
# 安裝依赖
$ npm install

# 安裝quasar﹣cli
$ npm install -g quasar-cli

# 运行dev server
$ quasar dev

# 编译生成生产环境代码到dist目录
$ quasar build

# 运行eslint
$ quasar lint
```

## 额外说明

在`build/script.dev.js`中配置reverse proxy
``` javascript
app.use(proxyMiddleware('/api/v1/', {
  target: 'api目标地址',
  pathRewrite: {'^/api/v1' : ''},
}))
```