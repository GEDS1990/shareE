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
    targetname: ""
  },
  userInfo: {
    avatarUrl: "",
    nickName: ""
  }
})