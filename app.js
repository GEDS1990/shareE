//app.js
const AV = require('/utils/av-weapp-min.js'); 
AV.init({
  appId: 'wx5f7635c669b5f97b', 
  appKey: 'wx5f7635c669b5f97b'
})
App({
  globalData: {
    curlatitude: "",
    curlongitude: "",
    curaddress: "",
    curname: "",
    targetlatitude: "",
    targetlongitude: "",
    targetaddress: "",
    targetname: "",
    inputValue: {
      fromAddress: "",
      fromTel: "",
      fromName: "",
      toAddress: "",
      toTel: "",
      toName: "",
      comment: "",
      warningTel: "",
      money: ""
    },
  },
  userInfo: {
    avatarUrl: "",
    nickName: "",
    country: "",
    province: "",
    city: "",
    gender: "",
    language: "",
  },
  // apiUrl: "http://127.0.0.1:8888",
  apiUrl: "https://www.shzhyun.com",
  // wssUrl: "ws://localhost:8888",
  // wssUrl: "ws://47.99.89.71:8888",
  wssUrl: "wss://www.shzhyun.com",
})