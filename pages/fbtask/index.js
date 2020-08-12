// pages/wallet/index.js
const AV = require('../../utils/av-weapp-min.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    // 故障车周围环境图路径数组
    picUrls: [],
    // 故障车编号和备注
    inputValue: {
      num: 0,
      desc: ""
    },
    // 故障类型数组
    checkboxValue: [],
    // 选取图片提示
    actionText: "拍照/相册",
    // 提交按钮的背景色，未勾选类型时无颜色
    btnBgc: "#191970",
  },
  // 页面加载
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '发布包裹记录'
    }),
      // 4.请求服务器，显示接单记录
      wx.request({
        url: app.apiUrl + '/mapControl/getAllMapLacation',
        // url:'app.apiUrl+/mapControl/getAllMapLacation',
        data: {},
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: (res) => {
          console.log("res size:" + res.data.length);
          this.setData({
            itemsValue: res.data
          })
        },
        fail: function (res) {
          // fail
          console.log("fail");
        },
        complete: function (res) {
          // complete
          console.log("complete");
        }
      })
  },
  // 
  selectChange: function (e) {
    // var gid = e.currentTarget.dataset.gid;
    // console.log("gid:" + gid);
    // wx.showModal({
    //   title: "随e带接单确认",
    //   content: e.currentTarget.dataset.title + ":" + e.currentTarget.dataset.money + " e币",
    //   showCancel: true,
    //   confirmText: "确定",
    //   success: function (res) {
    //     //更新gid对应包裹状态
    //     // TODO
    //     //插件接单人信息表
    //     // TODO
    //     //跳转回首页
    //     wx.redirectTo({
    //       url: '../index/index',
    //       success: function (res) {
    //         wx.showToast({
    //           title: '成功',
    //           icon: '成功',
    //           duration: 2000
    //         })
    //       }
    //     })
    //   }
    // });
  },
  // 输入单车编号，存入inputValue
  numberChange: function (e) {
    this.setData({
      inputValue: {
        num: e.detail.value,
        desc: this.data.inputValue.desc
      }
    })
  },
  // 输入备注，存入inputValue
  descChange: function (e) {
    this.setData({
      inputValue: {
        num: this.data.inputValue.num,
        desc: e.detail.value
      }
    })
  },
  search: function (e) {
    console.log("search:" + e.detail.value);
  },
  // 提交到服务器
  formSubmit: function (e) {
    if (this.data.picUrls.length > 0 && this.data.checkboxValue.length > 0) {
      wx.request({
        url: app.apiUrl + '/mapControl/getAllMapLacation',
        // url: 'https://www.easy-mock.com/mock/59098d007a878d73716e966f/ShareEdata/msg',
        data: {
          // picUrls: this.data.picUrls,
          // inputValue: this.data.inputValue,
          // checkboxValue: this.data.checkboxValue
        },
        method: 'get', // POST
        // header: {}, // 设置请求的 header
        success: function (res) {
          wx.showToast({
            title: res.data.data.msg,
            icon: 'success',
            duration: 2000
          })
        }
      })
    } else {
      wx.showModal({
        title: "请填写反馈信息",
        content: '看什么看，赶快填反馈信息，削你啊',
        confirmText: "我我我填",
        cancelText: "劳资不填",
        success: (res) => {
          if (res.confirm) {
            // 继续填
          } else {
            console.log("back")
            wx.navigateBack({
              delta: 1 // 回退前 delta(默认为1) 页面
            })
          }
        }
      })
    }

  },
  // 选择故障车周围环境图 拍照或选择相册
  bindCamera: function () {
    wx.chooseImage({
      count: 4,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        let tfps = res.tempFilePaths;
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
  // 删除选择的故障车周围环境图
  delPic: function (e) {
    let index = e.target.dataset.index;
    let _picUrls = this.data.picUrls;
    _picUrls.splice(index, 1);
    this.setData({
      picUrls: _picUrls
    })
  }
})