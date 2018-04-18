//use es6;
"use strict";
//写文章关于严格模式的重要性;

const { Wechaty } = require("wechaty"); //import { Wechaty } from 'wechaty', node v9.11.1 not support all es6;
//es6，环境支持的配置方式;

// Singleton
Wechaty.instance()

  //scan QRCode, before login;
  /*
   * URL: {String} the QR code image URL
   * code: {Number} the scan status code. some known status of the code list here is:
   *
   * 0 initial_
   * 200 login confirmed
   * 201 scaned, wait for confirm
   * 408 waits for scan
  */
  .on("scan", (url, code) => {
    //the QRCode weblink;
    console.log(`Scan QR Code to login: ${code}\n${url}`);

    //$ npm install qrcode-terminal
    //transfer QRcode link to image;
    //require the npm qrcode-terminal package;
    //thi package has some bugs, so have try and have fun;
    let qrcode = require("qrcode-terminal");
    //https://github.com/gtanner/qrcode-terminal

    /*
     * example link: https://login.weixin.qq.com/qrcode/sonmethinghere==
     * You can even specify the error level (default is 'L'):
     * and only "q" and "L" does work;
     * so we must repleace the "qrcode" 
     * 猜测微信保护机制，不更改读取失败;
    */
    let loginUrl = url.replace("qrcode", "l"); //do not delete this line !!!

    //qrcode.generate(urllink);
    qrcode.generate(loginUrl);

    //徐帅，这个引用包的callback()函数我没懂，不要打我;
  })
  //console.log('Scan QR Code to login: '+code+'\n'+url)
  //${}使用方式，es5新特性,`vs";

  .on("login", user => console.log(`User ${user} logined`))

  .on("message", async reciveMessage => {
    const SPEAKPERSON = reciveMessage.from();
    const SPEAKWORDS = reciveMessage.content();
    const ROOM = reciveMessage.room();

    if (reciveMessage.self()) {
      return;
    }

    if (ROOM != null) {
      console.log(
        `Group Name: ${ROOM}; Speak Person: ${SPEAKPERSON}; Speak Words: ${SPEAKWORDS}`
      );
    } else {
      console.log(
        `This is personal message; Speak Person: ${SPEAKPERSON}; Speak Words: ${SPEAKWORDS}`
      );
    }

    //恶作剧，慎用！！！
    if (/^@机器人$/i.test(reciveMessage.content())) {
      await reciveMessage.say("@于鑫机器人");
    }
  })
  .start();
