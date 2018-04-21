//use es6;
"use strict";
//写文章关于严格模式的重要性;

const { Wechaty } = require("wechaty"); //import { Wechaty } from 'wechaty', node v9.11.1 not support all es6;
//es6，环境支持的配置方式;

//let fs = require("fs");

//npm install --save jsonfile
let jsonfile = require("jsonfile");
//https://github.com/jprichardson/node-jsonfile

//npm install moment-timezone
let moment = require("moment-timezone");
//http://momentjs.com/timezone/docs/#/using-timezones/converting-to-zone/

var dateFileRead = require("./test.json");
let dateFileWrite = "./dataWriteForAll.txt";

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

    let Time = moment()
      .tz("Asia/Shanghai")
      .format(); //make sure no matter where are you, the time is in Beijing;

    //check if people send message to hiself, otherwise it will loop;
    if (reciveMessage.self()) {
      return;
    }

    if (ROOM != null) {
      let obj = `${Time} This message from group: ${ROOM} and person ${SPEAKPERSON} says ${SPEAKWORDS}`;
      console.log(obj);
      jsonfile.writeFileSync(dateFileWrite, obj, { flag: "a" });
    } else {
      let obj = `${Time} This message from person ${SPEAKPERSON} says ${SPEAKWORDS}`;
      console.log(obj);
      jsonfile.writeFileSync(dateFileWrite, obj, { flag: "a" });
    }

    //You may change code which above this line.
    //----------------------------------------------------------------;

    if (/^淘宝$/i.test(reciveMessage.content())) {
      await reciveMessage.say("兔子，我爱你");
    }

    //load json file;
    if (/^电影$/i.test(reciveMessage.content())) {
      let index = 1;
      let body = dateFileRead[index];
      await reciveMessage.say(
        `电影史排名#${body.index}
        ${body.title}
        (${body.original_title})
        豆瓣评分：${body.average}
        影片类型：${body.genres[0]} ${body.genres[1]}
        上映年份：${body.year}
        导演：${body.directors[0]}
        主演：${body.casts[0]} ${body.casts[1]}
        `
      );
    }

    if (
      /^淘宝$/i.test(reciveMessage.content()) &&
      reciveMessage.from().name() == `我是611的小奶狗`
    ) {
      await reciveMessage.say("兔子，我爱你1");
    }

    if (/^时间$/i.test(reciveMessage.content())) {
      await reciveMessage.say(Time);
    }

    if (/^徐帅$/i.test(reciveMessage.content())) {
      await reciveMessage.say("http://xugaoyang.com/");
    }

    //恶作剧，慎用！！！
    if (/^@机器人$/i.test(reciveMessage.content())) {
      await reciveMessage.say("@于鑫机器人");
    }

    //----------------------------------------------------------------;
    //Add you code below this line, thank you.
  })
  .start();
