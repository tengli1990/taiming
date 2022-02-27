import envConfig, { currentEnv } from '../config/env'
import { TOKEN } from './constants'
import { objectConvertToQuery } from './index'
const app = getApp();
const request = (options) => {

  const baseURL = envConfig[currentEnv].baseURL

  if (options.loading) {
    wx.showLoading({
      title: options.loadingText || '加载中...',
    });
  }

  if (options.method && options.method.toUpperCase() === "DELETE") {
    options.url += objectConvertToQuery(options.data || {})
  }

  console.log(11, options.url)

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
            wx.removeStorageSync(TOKEN);
            console.log('401')
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