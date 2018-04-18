# wei_chat_bot

---

## Bot for WeChat. Powered by Puppeteer / Node.js / TypeScript / Docker [https://chatie.io/wechaty/](https://chatie.io/wechaty/)

## WECHATY [https://github.com/Chatie/wechaty/](https://github.com/Chatie/wechaty/)

:octocat: <https://github.com/chatie/wechaty>  
:beetle: <https://github.com/chatie/wechaty/issues>  
:book: <https://github.com/chatie/wechaty/wiki>  
:whale: <https://hub.docker.com/r/zixia/wechaty>

---

### A Great Live Coding Tutorial

<div align="center">
<a target="_blank" href="https://blog.chatie.io/guide/2017/01/01/getting-started-wechaty.html"><img src="http://blog.chatie.io/download/2017/lijiarui-wechaty-quick-start-guide-video.jpg" border=0 width="60%"></a>
</div>

The above 15 minute video tutorial is a good start point if you are new to Wechaty.

> Source code in the video can be found at: [Wechaty Starter Repository](https://github.com/lijiarui/wechaty-getting-started)

---

### NPM

```shell
npm init
npm install wechaty             //引入微信框架;
npm install qrcode-terminal     //引入修改QRCode link to image in iterm;
npm install moment-timezone     //引入Time-zones 保证时间唯一性;
node mybot.js
```

---

```javascript
const { Wechaty } = require("wechaty");
let qrcode = require("qrcode-terminal");
let moment = require("moment-timezone");
```
