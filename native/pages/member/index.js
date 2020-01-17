// pages/member/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },
  bindGetUserInfo() {
    // console.log('----------userinfoEvent')
    wx.getSetting({
      success: function(res){
        console.log('用户信息', res)
    //    if (res.authSetting['scope.userInfo']) {
    //     // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //     wx.getUserInfo({
    //      success: (res)=> {
    //       console.log(res.userInfo)
    //       this.setData({
    //         userInfo: res.userInfo
    //       });
    //      }
    //     })
    //    }
      }
     })
  },
  touchEvent() {
    var app = getApp();
    console.log(app)
    app.ests.event({
      event_id: 'clickAvatar',//事件唯一ID，自定义，驼峰命名规则
      event_name: "点击头像",//事件名称，用作展示
      event_param: {//选填自定义参数
        name: "张三",
        age: 25
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
});
