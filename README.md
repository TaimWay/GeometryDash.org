<div align="center">

<h1>GeometryDash.org</h1>
A better Geometry Dash website<br><br>

[![Version](https://img.shields.io/badge/Verison-b0.1-orange?style=for-the-badge)](https://github.com/TaimWay/GeometryDash.org)
[![License](https://img.shields.io/badge/LICENSE-GPLv3-yellow.svg?style=for-the-badge&logo=opensourceinitiative)](https://github.com/TaimWay/GeometryDash.org)

[![Github](https://img.shields.io/badge/Github-181717?style=for-the-badge&logo=Github)](https://github.com/TaimWay/GeometryDash.org)
[![Node.js](https://img.shields.io/badge/node.js-22.15.0-5FA04E?style=for-the-badge&logo=Node.js)](https://nodejs.org/)
[![Vue.js](https://img.shields.io/badge/vue.js-3.5.25-4FC08D?style=for-the-badge&logo=Vue.js)](https://vuejs.org)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=Vite)](https://vite.dev)

[**English**](./README.md) | [**中文简体**](./doc/README_ZH-CN.md)

</div>

---

GeometryDash.org is a user website for Geometry Dash, which creates a simple red-tinted style daily-use website (after all, the studio's theme color is red).

## How to build?

If you want to build a GeometryDash.org project that can run on your computer, you can install the packaged program through a release version, or download the source code and package it yourself.

### By Installing the Pre-packaged Release Version

Click the release version on the previous page, download GeometryDash.org.zip, extract it to an empty directory, then start the terminal, cd into that directory, and use the command node server.cjs to start the server (default port is 80, can be modified in config.json)

### Download the Source Code Package

Download the source code and extract it to an empty directory, start the terminal, cd into that directory, and execute the following commands:

```shell
npm run build
npm install
```

If everything goes well, you will get a dist folder. Then create a startup script in that directory and start the server using node.

Note: This project uses vue-router to map URLs, so you cannot successfully create a server using conventional methods, but you can create a server using the following code.

```javascript
const http = require('http')
const fs = require('fs')
const httpPort = 80

http
    .createServer((req, res) => {
        fs.readFile('./dist/index.html', 'utf-8', (err, content) => {
            if (err) {
                console.log('We cannot open "index.html" file.')
            }

            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8',
            })

            res.end(content)
        })
    })
    .listen(httpPort, () => {
        console.log('Server listening on: http://localhost:%s', httpPort)
    })
```

## Community

The project will call existing services to obtain some information, such as music information from NG/NCS, server information from RopTop, etc
