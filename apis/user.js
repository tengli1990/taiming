import request from '../utils/request'


// 登录接口
export const getAccessToken = (data) => {
  return request({
    url: '/token',
    method: 'POST',
    data
  })
}

// 获取授权手机号
export const getUserPhoneNumber = (data) => {
  return request({
    url: '/token/phone_number',
    data
  })
}

// 发送短信验证码
export const sendSmsCode = (data) => {
  return request({
    url: '/sms',
    data
  })
}

// 检查手机号是否在白名单
export const checkPhoneNumber = (data) => {
  return request({
    url:'/token/verify_phone_number',
    data
  })
}