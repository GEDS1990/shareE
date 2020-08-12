// pages/deploy/index.js
//获取应用实例
var app = getApp()
const AV = require('../../utils/av-weapp-min.js');
const UTIL = require('../../utils/util.js');
Page({
  data: {
    // 故障车周围环境图路径数组
    picUrls: [],
    // // 故障车编号和备注
    inputValue: {
      fromAddress: "",
      fromTel: "",
      fromName: "",
      toAddress: "",
      toTel: "",
      toName: "",
      comment: "",
      warningTel: "",
      money:""
    },
    btnBgc: "#191970",
    // 选取图片提示
    actionText: "拍照/相册",
    latitude: 0,
    longitude: 0,
    imgTempFilePaths: "/images/markerF.png",
  },
  // 页面加载
  onLoad: function (options) {
    console.log(options.type);
    if (options.type === "from") {
      app.globalData.inputValue.fromAddress = options.address;
      app.globalData.inputValue.fromName = options.name;
      app.globalData.inputValue.fromTel = options.tel;
    } else {
      app.globalData.inputValue.toAddress = options.address;
      app.globalData.inputValue.toName = options.name;
      app.globalData.inputValue.toTel = options.tel;
    }
    this.setData({
      inputValue: {
        fromAddress : app.globalData.inputValue.fromAddress,
        fromName : app.globalData.inputValue.fromName,
        fromTel : app.globalData.inputValue.fromTel,
        toAddress : app.globalData.inputValue.toAddress,
        toName : app.globalData.inputValue.toName,
        toTel : app.globalData.inputValue.toTel
      }
    })
    console.log(this.data.inputValue.fromAddress);
    // 设置本页导航标题
    wx.setNavigationBarTitle({
      title: '发布宝贝'
    })
  },
// 页面显示
  onShow: function () {
    // 1.创建地图上下文，移动当前位置到地图中心
    this.mapCtx = wx.createMapContext("ShareEMap");
    // this.movetoPosition()
  },
  // 跳转到接单页面
  movetoHisAddrFrom: function () {
    // 关闭当前页面，跳转到指定页面，返回时将不会回到当前页面
    wx.redirectTo({
      url: '../hisaddr/index?type=from'
    })
  },
  // 跳转到接单页面
  movetoHisAddrTo: function () {
    // 关闭当前页面，跳转到指定页面，返回时将不会回到当前页面
    wx.redirectTo({
      url: '../hisaddr/index?type=to'
    })
  },
  // 输入目的地，存入inputValue
  fromAddressChange: function (e) {
    this.setData({
      inputValue: {
        fromAddress: e.detail.value,
        title: this.data.inputValue.title,
        toAddress: this.data.inputValue.toAddress,
        warningTel: this.data.inputValue.warningTel,
        comment: this.data.inputValue.comment,
        warningTel: this.data.inputValue.warningTel,
        money: this.data.inputValue.money
      }
    })
  },

  // 输入目的地，存入inputValue
  toAddressChange: function (e) {
    this.setData({
      inputValue: {
        toAddress: e.detail.value,
        title: this.data.inputValue.title,
        fromAddress: this.data.inputValue.fromAddress,
        warningTel: this.data.inputValue.warningTel,
        comment: this.data.inputValue.comment,
        telTo: this.data.inputValue.telTo,
        money: this.data.inputValue.money
      }
    })
  },
  // 输入标题，存入inputValue
  titleChange: function (e) {
    this.setData({
      inputValue: {
        fromAddress: this.data.inputValue.fromAddress,
        warningTel: this.data.inputValue.warningTel,
        toAddress: this.data.inputValue.toAddress,
        title: e.detail.value,
        comment: this.data.inputValue.comment,
        money: this.data.inputValue.money
      }
    })
  },
  // 输入备注，存入inputValue
  descChange: function (e) {
    this.setData({
      inputValue: {
        title: this.data.inputValue.title,
        fromAddress: this.data.inputValue.fromAddress,
        warningTel: this.data.inputValue.warningTel,
        toAddress: this.data.inputValue.toAddress,
        comment: e.detail.value,
        money: this.data.inputValue.money
      }
    })
  },
  // 输入telTo，存入inputValue
  telToChange: function (e) {
    this.setData({
      inputValue: {
        warningTel: e.detail.value,
        title: this.data.inputValue.title,
        fromAddress: this.data.inputValue.fromAddress,
        toAddress: this.data.inputValue.toAddress,
        comment: this.data.inputValue.comment,
        money: this.data.inputValue.money
      }
    })
  },
  // 输入，存入inputValue
  moneyChange: function (e) {
    this.setData({
      inputValue: {
        title: this.data.inputValue.title,
        fromAddress: this.data.inputValue.fromAddress,
        toAddress: this.data.inputValue.toAddress,
        comment: this.data.inputValue.comment,
        warningTel: this.data.inputValue.warningTel,
        money: e.detail.value
      }
    })
  },
  // 提交到服务器
  formSubmit: function (e) {
    wx.request({
      url: app.apiUrl+'/mapControl/addLoc',
      method: 'POST',
      data: {
        userId: app.userInfo.avatarUrl,
        status: "发布",
        title: "" + this.data.inputValue.title,
        goodsId: UTIL.uuid(),
        money: this.data.inputValue.money,
        fromAddress: this.data.inputValue.fromAddress,
        fromTel: this.data.inputValue.fromTel,
        toAddress: this.data.inputValue.toAddress,
        toTel: this.data.inputValue.toTel,
        comment: this.data.inputValue.comment,
        warningTel: this.data.inputValue.warningTel,
        money: this.data.inputValue.money,
        latitudeFrom: app.globalData.curlatitude,
        longitudeFrom: app.globalData.curlongitude,
        latitudeTo: app.globalData.targetlatitude,
        longitudeTo: app.globalData.targetlongitude,
        iconPath: this.data.imgTempFilePaths,
        width: "20",
        height: "40"
      },
      success: function (res) {
        wx.showToast({
          title: "success",
          icon: 'success',
          duration: 2000
        });
        wx.navigateTo({
          url: '../index/index'
        });
      }
    })

  },
  // 选择宝贝拍照或选择相册
  bindCamera: function () {
    wx.chooseImage({
      count: 4,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        let tfps = res.tempFilePaths;
        this.data.imgTempFilePaths = tfps[0];
        let _picUrls = this.data.picUrls;
        for (let item of tfps) {
          _picUrls.push(item);
          this.setData({
            picUrls: _picUrls,
            actionText: "+"
          });
        };
        var tempFilePath = res.tempFilePaths[0];
        new AV.File('pictrue', {
          blob: {
            uri: tempFilePath,
          },
        }).save().then(
          file => console.log(file.url())
          ).catch(console.error);
      }
    })
  },
  // 删除选择的宝贝图
  delPic: function (e) {
    let index = e.target.dataset.index;
    let _picUrls = this.data.picUrls;
    _picUrls.splice(index, 1);
    this.setData({
      picUrls: _picUrls
    })
  },
  // 定位函数，移动位置到地图中心
  movetoPosition: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        app.globalData.targetlatitude = res.latitude;
        app.globalData.targetlongitude = res.longitude;
        app.globalData.targetaddress = res.address;
        app.globalData.targetname = res.name;
      },
      fail: function (err) {
        console.log(err)
      }
    });
    // this.mapCtx.moveToLocation();
  },
  // 地图控件点击事件
  bindcontroltap: function (e) {
    // 判断点击的是哪个控件 e.controlId代表控件的id，在页面加载时的第3步设置的id
    switch (e.controlId) {
      // 点击定位控件
      case 1: this.movetoPosition();
        break;
      // 点击maker
      case 4:
        wx.showModal({
          title: '目标位置信息',
          content: app.globalData.targetname + ":" + app.globalData.targettaddress,
        })
        break;
      default: break;
    }
  },

})