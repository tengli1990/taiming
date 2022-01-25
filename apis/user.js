import request from '../utils/request'


// 登录接口
export const getAccessToken = (data) => {
  return request({
    url: '/token',
    method: 'POST',
    checkToken: false,
    data
  })
}

// 获取授权手机号
export const getUserPhoneNumber = (data) => {
  return request({
    url: '/token/phone_number',
    checkToken: false,
    data
  })
}

// 发送短信验证码
export const sendSmsCode = (data) => {
  return request({
    url: '/sms',
    checkToken: false,
    data
  })
}

// 短信验证码验证接口
export const checkSmsCode = (data) => {
  return request({
    url: '/sms',
    method: 'POST',
    checkToken: false,
    data
  })
}

// 检查手机号是否在白名单
export const checkPhoneNumber = (data) => {
  return request({
    url: '/token/verify_phone_number',
    checkToken: false,
    data
  })
}