// pages/wallet/index.js
//获取应用实例
var app = getApp()
const AV = require('../../utils/av-weapp-min.js');
Page({
  data:{
    // 故障车周围环境图路径数组
    picUrls: [],
    userInfo:{},
    type: "",
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
    btnBgc: "",
    // 复选框的value，此处预定义，然后循环渲染到页面
    itemsValue: [
      {
        address: "",
        name: "",
        tel: ""
      }
    ]
  },
// 页面加载
  onLoad:function(options){
    wx.setNavigationBarTitle({
      title: '地址管理'
    }),
    this.setData({
      type: options.type
    }),
    // 4.请求服务器，显示接单记录
    wx.request({
      url: app.apiUrl + '/addressControl/queryHistoryAddress',
      data: { "userId": app.userInfo.avatarUrl },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: (res2) => {
        this.setData({
          itemsValue: res2.data
        })
      }
    });
  },
  // 跳转至添加地址页
  movetoAddAddr: function () {
    wx.navigateTo({
      url: './add/index'
    })
  },
// 勾选故障类型，获取类型值存入checkboxValue
  checkboxChange: function(e){
    let _values = e.detail.value;
    if(_values.length == 0){
      this.setData({
        btnBgc: ""
      })
    }else{
      this.setData({
        checkboxValue: _values,
        btnBgc: "#191970"
      })
    }   
  },
// 输入编号，存入inputValue
  numberChange: function(e){
    this.setData({
      inputValue: {
        num: e.detail.value,
        desc: this.data.inputValue.desc
      }
    })
  },
// 输入备注，存入inputValue
  descChange: function(e){
    this.setData({
      inputValue: {
        num: this.data.inputValue.num,
        desc: e.detail.value
      }
    })
  },
// 提交到上级页面
  formSubmit: function (event){
    var address = event.currentTarget.dataset.start;
    var name = event.currentTarget.dataset.personid;
    var tel = event.currentTarget.dataset.tel;
    if (this.data.type == "to") {
      wx.navigateTo({
        url: '../deploy/index?type=to&address=' + address+'&tel='+tel+'&name='+name+'',
      })
    } else {
      wx.navigateTo({
        url: '../deploy/index?type=from&address=' + address + '&tel=' + tel + '&name=' + name + '',
      })
    }    
  },
// 选择故障车周围环境图 拍照或选择相册
  bindCamera: function(){
    wx.chooseImage({
      count: 4, 
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'], 
      success: (res) => {
        let tfps = res.tempFilePaths;
        let _picUrls = this.data.picUrls;
        for(let item of tfps){
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
  delPic: function(e){
    let index = e.target.dataset.index;
    let _picUrls = this.data.picUrls;
    _picUrls.splice(index,1);
    this.setData({
      picUrls: _picUrls
    })
  }
})