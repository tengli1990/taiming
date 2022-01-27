import envConfig, { currentEnv } from '../config/env'
const app = getApp();
const uploadRequest = (options) => {

  const baseURL = envConfig[currentEnv].baseURL
  return new Promise((resolve, reject) => {
    const accessToken = wx.getStorageSync('accessToken')
    console.log(options.filePath)
    wx.uploadFile({
      method: 'GET',
      ...options,
      url: baseURL + options.url,
      filePath: options.filePath, // 上传文件
      name:'picture',
      header: {
        'Authorization': `Bearer ${accessToken}`,
      },
      success: res => resolve(JSON.parse(res.data)),
      fail: err => reject(err)
    });
  })
}

export default uploadRequest