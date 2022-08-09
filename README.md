Hos App Web 用户组织中心

目录结构
----
```     
    ├── README.md
    ├── babel.config.js
    ├── package-lock.json
    ├── package.json
    ├── public                  静态资源
    ├── src                   项目源码目录
    |     ├── api                 定义调用接口的文件
    │     ├── assets              静态资源
    │     ├── axios               封装的http方法
    │     ├── components          组件
    │     ├── constant            常量定义
    │     ├── directive           指令
    │     ├── enum                枚举类型定义
    │     ├── i18n                国际化文件
    │     ├── router              路由
    │     ├── store               全局状态管理
    │     ├── style               样式变量定义
    │     ├── utils               工具类
    │     ├── views               页面
    │     ├── App.vue
    │     ├── main.js
    │     └── permission.js       全局路由守卫和登录判断
    └── vue.config.js

```

项目下载和运行
----

- 拉取项目代码
```bash(git客户端，在文件中使用git bash here打开命令行，复制以下命令下载项目)
git clone http://119.255.194.80/hos/hos-app-web.git
```

- 安装依赖
```
在当前项目根目录下,执行以下脚本:
  登录私服: 
    npm login  --registry=http://119.255.194.80:8081/repository/npm-public/
  输入用户名: 
    vue-admin
  输入密码: 
    hos1234qwer
  输入邮箱: 
    chenyuan@mediway.cn
  安装依赖: 
    npm install --registry=http://119.255.194.80:8081/repository/npm-public/

```

- 开发模式运行
```
npm run serve
```
附属文档
----
- [Hosui](http://114.242.246.250:8035/#/zh-CN)

- [Vue](https://cn.vuejs.org/v2/guide)

- [应用框架文档](http://114.242.246.250:8034/)

- 其他待补充...


更新日志
----
#### 1.0.1-RELEASE
- 用户组织权限基本功能
