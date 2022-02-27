// app.js
import Dialog from './miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from './miniprogram_npm/@vant/weapp/toast/toast';
import { formatDate } from './utils/index'
App({
  onLaunch() {
    // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

  },
  globalData: {
    userInfo: null,
    $dialog: Dialog,
    $toast: Toast,
    $formatDate: formatDate
  }
})
