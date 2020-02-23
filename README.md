# yapi-markdown-render

核心代码从[tui.editor](https://github.com/nhn/tui.editor)中提取
利用[markdown-it](https://github.com/markdown-it/markdown-it)将`markdown`渲染成`html`

# 初始化
```shell script
yarn install
```
或者
```shell script
npm install
```
# 渲染markdown文件

```shell script
/node render.js xxx.md
```

# 获取`easy-yapi`配置


## 服务器渲染配置

1.将服务器上部署此项目

执行
```shell script
yarn start
#yarn start 3000
```
或者
```shell script
npm start
#npm start 3000
```

2.在`easy-yapi`配置文件中做如下配置

配置示例:
```properties
markdown.render.server=http://服务器ip:端口/render
```

## 本地渲染配置

本地渲染性能稍高，无需部署

1.执行shell,复制脚本输出的内容(即为配置)
```shell script
./script/build_conf.sh
```
2.将配置放入项目中的配置文件里,项目配置文件配置方法见: [项目配置方法](http://easyyapi.com/setting/local-file-config.html)

配置示例:
```properties
markdown.render.shell=/usr/local/bin/node render.js
markdown.render.work.dir=/项目路径/yapi-markdown-render
markdown.render.timeout=3000
```