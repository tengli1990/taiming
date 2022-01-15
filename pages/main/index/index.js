// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    moduleList:[
      {
        icon:'',
        title:'寄样'
      },
      {
        icon:'',
        title:'物流'
      },
      {
        icon:'',
        title:'建档'
      },
      {
        icon:'',
        title:'收样品'
      }
    ]
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
   
  },
  // 跳转到筛选
  toFilterPage(){
    console.log(111)
    wx.navigateTo({
      url: '../filter/filter'
    })
  }
})
