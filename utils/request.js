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
    const accessToken = wx.getStorageSync('accessToken') 
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
      fail: (err) => reject(err),
      complete: error => {
        if (options.loading) {
          wx.hideLoading();
        }

        const { statusCode } = error
        switch (statusCode) {
          case 401:
            wx.reLaunch({
              url: '/pages/user/login/login'
            })
            break;
          case 500:
            break;
        }

      }
    })
  })
}

export default request