import envConfig, { currentEnv } from '../config/env'
const app = getApp();
const uploadRequest = (options) => {

  const baseURL = envConfig[currentEnv].baseURL
  return new Promise((resolve, reject) => {
    const accessToken = wx.getStorageSync('accessToken')
    wx.uploadFile({
      method: 'GET',
      ...options,
      url: baseURL + options.url,
      filePath: options.filePath, // 上传文件
      name: 'picture',
      formData: options.formData || {},
      header: {
        'Authorization': `Bearer ${accessToken}`,
      },
      success: res => resolve(JSON.parse(res.data)),
      fail: err => reject(err),
      complete: error => {
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
    });
  })
}

export default uploadRequest