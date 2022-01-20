import envConfig, { currentEnv } from '../config/env'
const app = getApp();
const request = (options) => {

  const baseURL = envConfig[currentEnv].baseURL

  if (options.loading) {
    wx.showLoading({
      title: '加载中...',
    });
  }
  return new Promise((resolve, reject) => {
    const accessToken = wx.getStorageSync('accessToken')

    const config = {
      method: 'GET',
      dataType: 'json',
      ...options,
      url: baseURL + options.url,
      headers: {
        'content-type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${accessToken}`,
        ...options.headers
      }
    }
    wx.request({
      ...config,
      success: (res)=>resolve(res.data),
      fail: reject,
      complete: info => {
        if (options.needLoading) {
          wx.hideLoading();
        }
      }
    })
  })
}

export default request