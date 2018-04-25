//use es6;
"use strict";

const { Wechaty } = require("wechaty"); //import { Wechaty } from 'wechaty', node v9.11.1 not support all es6;

const qrcode = require("qrcode-terminal");
//this package has some bugs, so have try and have fun;

//---------闲聊 api package-------------------------------;
const _ = require("underscore");
const md5 = require("blueimp-md5");
const axios = require("axios");
const qs = require("qs");

//---------闲聊 api id and key----------------------------;
let appID = chanegYourOwn;
let appKey = "ChangeYourOwn";

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

    /*
     * transfer QRcode link to image;
     * example link: https://login.weixin.qq.com/qrcode/sonmethinghere==
     * You can even specify the error level (default is 'L'):
     * and only "q" and "L" does work;
     * so we must repleace the "qrcode" 
     * 猜测微信保护机制，不更改读取失败;
    */
    let loginUrl = url.replace("qrcode", "l"); //do not delete this line !!!

    qrcode.generate(loginUrl);
  })

  .on("login", user => console.log(`User ${user} logined`))

  .on("message", reciveMessage => {
    const SPEAKPERSON = reciveMessage.from();
    const SPEAKWORDS = reciveMessage.content();
    const ROOM = reciveMessage.room();

    //check if people send message to hiself, otherwise it will loop;
    if (reciveMessage.self()) {
      return;
    }

    if (ROOM != null) {
      let obj = `Group: ${ROOM}, People: ${SPEAKPERSON} Say: ${SPEAKWORDS}`;
      console.log(obj);
    } else {
      let obj = `People: ${SPEAKPERSON} Say: ${SPEAKWORDS}`;
      console.log(obj);
    }

    if (/^@texevaxis/i.test(reciveMessage.content())) {
      let words = SPEAKWORDS.replace("@texevaxis", "");
      let session = md5(`${ROOM}${SPEAKPERSON}`);
      let reply = "";
      //--------------------------------------闲聊 api------------;
      let hash = [];

      let randomString =
        Math.random()
          .toString(36)
          .substring(2, 10) +
        Math.random()
          .toString(36)
          .substring(2, 10) +
        Math.random()
          .toString(36)
          .substring(2, 10) +
        Math.random()
          .toString(36)
          .substring(2, 10);

      hash["app_id"] = appID; //int >0;
      hash["time_stamp"] = Math.round(new Date().getTime() / 1000); //int >0;
      hash["nonce_str"] = randomString; //string upTo 32 bytes;
      hash["sign"] = ""; //string 32 bytes;
      hash["session"] = session; //string UTF-8, not null, upTo 32 bytes;
      hash["question"] = words;

      function getSign(hash, appKey) {
        //--------------------------------------------------------------------;
        //1.re-order the hash list;
        let reOrderHash = _.pairs(hash).sort();
        //console.log(reOrderHash);

        //--------------------------------------------------------------------;
        //2.add URLstring;
        let string = "";
        for (let index = 0; index < reOrderHash.length; index++) {
          if (reOrderHash[index][1] !== "") {
            if (
              reOrderHash[index][1] == encodeURIComponent(reOrderHash[index][1])
            ) {
              string =
                string +
                reOrderHash[index][0] +
                "=" +
                reOrderHash[index][1] +
                "&";
            } else {
              string =
                string +
                reOrderHash[index][0] +
                "=" +
                encodeURIComponent(reOrderHash[index][1]) +
                "&";
            }
          }
        }

        string = string.replace("%20", "+");
        //console.log(string);

        //--------------------------------------------------------------------;
        //3.add app_key;
        string = string + "app_key=" + appKey;
        //console.log(string);

        //--------------------------------------------------------------------;
        //4.MD5+uppercase;
        let sign = md5(string).toUpperCase();
        //console.log(sign);

        return sign;
      }

      hash["sign"] = getSign(hash, appKey);

      let options = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify(hash),
        url: "https://api.ai.qq.com/fcgi-bin/nlp/nlp_textchat"
      };

      axios(options)
        .then(function(response) {
          reply = reply + response.data.data.answer;
        })
        .catch(function(error) {
          reply = reply + error;
        });
      //----------------------闲聊api 结束，输出 reply---------;

      setTimeout(async () => {
        await reciveMessage.say(`${reply}`);
      }, Math.random() * 10 * 1000);
    }
  })
  .start();
