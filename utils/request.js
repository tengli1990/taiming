import envConfig, { currentEnv } from '../config/env'
const app = getApp();
const request = (options) => {

  const baseURL = envConfig[currentEnv].baseURL

  if (options.loading) {
    wx.showLoading({
      title: options.loadingText || '加载中...',
    });
  }
  return new Promise((resolve, reject) => {
    const accessToken = wx.getStorageSync('accessToken') || "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDMxMzg2NTEuMDA0OTA4MywiZXhwIjoxNjQzMjI1MDUxLCJ1aWQiOjUsIm9wZW5pZCI6Im92SnJyNG81ZDRUSzNSakY1Zmpkb3Vmc2E0dFkifQ.EywmJH0kg11I3zIcXvMNpCy16_TlzBGQ7BLSME0T8OU"

    if(options.checkToken && !accessToken){
      wx.redirectTo({
        url:'/pages/user/login/login'
      })
      return
    }
    wx.request({
      method: 'GET',
      ...options,
      url: baseURL + options.url,
      header: {
        'content-type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${accessToken}`,
        ...options.header
      },
      success: (res) => resolve(res.data),
      fail: function (err) {
        console.log(11111,err)
      },
      complete: info => {
        if (options.loading) {
          setTimeout(() =>{
            wx.hideLoading();
          },500)
        }
      }
    })
  })
}

export default request