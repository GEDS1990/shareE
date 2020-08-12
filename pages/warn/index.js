// pages/wallet/index.js
const AV = require('../../utils/av-weapp-min.js'); 
Page({
  data:{
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
    // 复选框的value，此处预定义，然后循环渲染到页面
    itemsValue: [
      {
        checked: false,
        value: "包裹丢失",
        color: "#191970"
      },
      {
        checked: false,
        value: "包裹缺损",
        color: "#191970"
      },
      {
        checked: false,
        value: "包裹被拆",
        color: "#191970"
      },
      {
        checked: false,
        value: "其他问题",
        color: "#191970"
      }
    ]
  },
// 页面加载
  onLoad:function(options){
    wx.setNavigationBarTitle({
      title: '投诉建议'
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
// 输入单车编号，存入inputValue
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
// 提交到服务器
  formSubmit: function(e){
    if(this.data.picUrls.length > 0 && this.data.checkboxValue.length> 0){
      wx.request({
        url: app.apiUrl + '/mapControl/getAllMapLacation',
        data: {
          // picUrls: this.data.picUrls,
          // inputValue: this.data.inputValue,
          // checkboxValue: this.data.checkboxValue
        },
        method: 'POST', // POST
        // header: {}, // 设置请求的 header
        success: function(res){
          wx.showToast({
            title: res.data.data.msg,
            icon: 'success',
            duration: 2000
          })
        }
      })
    }else{
      wx.showModal({
        title: "确认反馈信息",
        content: '您的反馈我们会尽快安排处理',
        confirmText: "确定",
        cancelText: "取消",
        success: (res) => {
          if(res.confirm){
            // 继续填
            wx.navigateBack({
              delta: 1 // 回退前 delta(默认为1) 页面
            })
          }else{
          }
        }
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
  },
  sendDYMsg: function(e) {
    wx.requestSubscribeMessage({
      tmplIds: ['7qfcpKXAOAdSTT9S6aZvhX81rWekhthGc6NwQKWZonM'],
      success(res) {
        console.log("可以给用户推送一条中奖通知了。。。");
      }
    })
  }
})