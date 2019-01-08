> A Vue.js 2.0 UI Toolkit for Web.

- [docs](http://qastatic.ymmoa.com/ymm-design/#/zh-CN/component/)
- [npm](http://192.168.199.131:4873/)
- [gitlab](http://code.ymmoa.com/ymmoa/ymm-design.git)

## 使用
``` javascript
import Vue from 'vue'
import Ymm from 'ymm-design'
import 'ymm-design/lib/theme-default/index.css'

Vue.use(Ymm)
```

## 开发
- `npm run dev` - localhost:8085

- `npm run dev:play`

- 新增组件
  - 在`./package/`中创建组件
  - 在`./package/theme-default`中创建样式
  - 在`./components.json`中注册
  - 在`./example/nav.config.js`中配置路由
  - 在`./example/docs/zh-CN`中编写文档

- `node build/bin/new [组件名]` - 自动生成以上文件

## 发布
`npm run pub`

## 文档
`npm run page`

## 测试
`npm run test`

`npm run test:watch`

## 代办事项
- [ ] ts