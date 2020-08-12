// pages/scanresult/index.js
//获取应用实例
var app = getApp()
const AV = require('../../../utils/av-weapp-min.js');
Page({
  data: {
    // 故障车周围环境图路径数组
    picUrls: [],
    // 故障车编号和备注
    inputValue: {
      province: "",
      city: "",
      address: "",
      name: "",
      tel: "",
      userId: ""
    },
    btnBgc: "#191970",
    // 选取图片提示
    actionText: "拍照/相册",
    scale: 18,
    latitude: 0,
    longitude: 0,
    imgTempFilePaths: "",
  },
  // 页面加载
  onLoad: function (options) {
    console.log(options)
    // 设置本页导航标题
    wx.setNavigationBarTitle({
      title: '添加地址'
    }),
      // // 获取宝贝图片
      // this.setData({
      //   imgTempFilePaths: options.imgTempFilePaths
      // }),
      // 2.获取并设置当前位置经纬度
      wx.getLocation({
        type: "gcj02",
        success: (res) => {
          this.setData({
            longitude: res.longitude,
            latitude: res.latitude
          });
        }
      });
    // let _picUrls = options.imgTempFilePaths;
    // this.setData({
    //   picUrls: _picUrls
    // }),
    // 3.设置地图控件的位置及大小，通过设备宽高定位
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          controls: [{
            id: 1,
            iconPath: '/images/location.png',
            position: {
              left: res.windowWidth / 2 - 12 - 50,
              top: res.windowHeight / 2 - 222 + 50,
              width: 40,
              height: 40
            },
            clickable: true
          },
          {
            id: 4,
            iconPath: '/images/marker.png',
            position: {
              left: res.windowWidth / 2 - 12,
              top: res.windowHeight / 2 - 222,
              width: 22,
              height: 45
            },
            clickable: true
          }
          ]
        })
      }
    });
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
      url: '../hisaddr/index?type = from'
    })
  },
  // 跳转到接单页面
  movetoHisAddrTo: function () {
    // 关闭当前页面，跳转到指定页面，返回时将不会回到当前页面
    wx.redirectTo({
      url: '../hisaddr/index?type = to'
    })
  },
  // 输入province，存入inputValue
  provinceChange: function (e) {
    this.setData({
      inputValue: {
        province: e.detail.value,
        city: this.data.inputValue.city,
        address: this.data.inputValue.address,
        name: this.data.inputValue.name,
        tel: this.data.inputValue.tel
      }
    })
  },

  // 输入city，存入inputValue
  cityChange: function (e) {
    this.setData({
      inputValue: {
        province: this.data.inputValue.province,
        city: e.detail.value,
        address: this.data.inputValue.address,
        name: this.data.inputValue.name,
        tel: this.data.inputValue.tel
      }
    })
  },
  // 输入address，存入inputValue
  addressChange: function (e) {
    this.setData({
      inputValue: {
        province: this.data.inputValue.province,
        city: this.data.inputValue.city,
        address: e.detail.value,
        name: this.data.inputValue.name,
        tel: this.data.inputValue.tel
      }
    })
  },
  // 输入name，存入inputValue
  nameChange: function (e) {
    this.setData({
      inputValue: {
        province: this.data.inputValue.province,
        city: this.data.inputValue.city,
        address: this.data.inputValue.address,
        name: e.detail.value,
        tel: this.data.inputValue.tel
      }
    })
  },
  // 输入tel，存入inputValue
  telChange: function (e) {
    this.setData({
      inputValue: {
        province: this.data.inputValue.province,
        city: this.data.inputValue.city,
        address: this.data.inputValue.address,
        name: this.data.inputValue.name,
        tel: e.detail.value
      }
    })
  },
  // 提交到服务器
  formSubmit: function (e) {
    wx.request({
      url: app.apiUrl + '/addressControl/addAddress',
      // url: 'app.apiUrl+/addressControl/addAddress',
      method: 'POST',
      data: {
        province: this.data.inputValue.province,
        city: this.data.inputValue.city,
        address: this.data.inputValue.address,
        name: this.data.inputValue.name,
        tel: this.data.inputValue.tel,
        userId: md5(app.userInfo.avatarUrl)
      },
      success: function (res) {
        wx.showToast({
          title: "success",
          icon: 'success',
          duration: 2000
        });
        wx.navigateTo({
          url: '../../deploy/index'
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