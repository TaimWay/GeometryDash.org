<div align="center">

<h1>GeometryDash.org</h1>
一个更优质的 Geometry Dash 网站<br><br>

[![版本](https://img.shields.io/badge/版本-b0.1-orange?style=for-the-badge)](https://github.com/TaimWay/GeometryDash.org)
[![许可证](https://img.shields.io/badge/许可证-GPLv3-yellow.svg?style=for-the-badge&logo=opensourceinitiative)](https://github.com/TaimWay/GeometryDash.org)

[![Github](https://img.shields.io/badge/Github-181717?style=for-the-badge&logo=Github)](https://github.com/TaimWay/GeometryDash.org)
[![Node.js](https://img.shields.io/badge/node.js-22.15.0-5FA04E?style=for-the-badge&logo=Node.js)](https://nodejs.org/)
[![Vue.js](https://img.shields.io/badge/vue.js-3.5.25-4FC08D?style=for-the-badge&logo=Vue.js)](https://vuejs.org)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=Vite)](https://vite.dev)

[**English**](../README.md) | [**中文简体**](./README_ZH-CN.md)

</div>

---

GeometryDash.org 是一个为 Geometry Dash 打造的用户网站，它创建了一个简约红色调的日常使用网站（毕竟工作室的主题色是红色）。

## 如何构建？

若想在本地计算机上构建可运行的 GeometryDash.org 项目，您可以通过发行版安装已打包的程序，或下载源码自行打包。

### 通过安装预打包的发行版

点击首页的发行版本，下载 GeometryDash.org.zip 解压至空目录，随后启动终端，cd到该目录下，使用命令 node server.cjs 启动服务器（默认端口80，可在config.json中修改）

### 下载源码包

下载源代码并解压至空目录，启动终端，cd到该目录下，执行以下命令：

```shell
npm run build
npm install
```

若一切顺利，您将获得 dist 文件夹。随后在该目录创建启动脚本，使用 node 启动服务器。

注意：本项目使用 vue-router 进行 URL 映射，因此无法通过常规方式成功创建服务器，但您可以通过以下代码创建服务器。

```javascript
const http = require('http')
const fs = require('fs')
const httpPort = 80

http
    .createServer((req, res) => {
        fs.readFile('./dist/index.html', 'utf-8', (err, content) => {
            if (err) {
                console.log('无法打开 "index.html" 文件')
            }

            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            })

            res.end(content)
        })
    })
    .listen(httpPort, () => {
        console.log('服务器运行于: http://localhost:%s', httpPort)
    })
```

## 社区

本项目将调用现有服务来获取部分信息，例如来自 NG/NCS 的音乐信息、来自 RopTop 的服务器信息等