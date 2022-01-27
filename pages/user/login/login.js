const app = getApp();
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import { getAccessToken, getUserPhoneNumber, sendSmsCode, checkPhoneNumber, checkSmsCode } from '../../../apis/user'
import { verifyPhoneNumber } from '../../../utils/index'
import { WECHAT_TOKEN, TOKEN, OPENID } from '../../../utils/constants'
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getPhoneNumber'),
    mobile: '',
    sms: '',
    realSms: '',
    username: '',
    agreementChecked: true,
    // 发送验证码倒计时
    isSending: false,
    countDown: 60,
    launchScreen: true
  },
  onLoad: function (options) {
    //初始化加载，先判断用户登录状态
    const isLoginedIn = wx.getStorageSync(TOKEN)
    if (isLoginedIn) {
      wx.redirectTo({
        url: '/pages/main/index/index'
      })
      return
    }
    setTimeout(() => {
      this.setData({
        launchScreen: false
      })
    },300)
    // 登录
    wx.login({
      success: res => {
        const { code } = res
        getAccessToken({ js_code: code }).then(res => {
          if (res.error_code !== 0) {
            return
          }
          const { access_token, is_logined, openid } = res.data
          wx.setStorageSync(WECHAT_TOKEN, access_token)
          wx.setStorageSync(OPENID, openid)
        })
      }
    })
  },
  // 授权协议选中
  onAgreementChange(e) {
    const { agreementChecked } = this.data
    this.setData({
      agreementChecked: !agreementChecked
    })
  },
  // 获取手机号
  getPhoneNumber(e) {
    const params = {
      access_token: wx.getStorageSync(WECHAT_TOKEN),
      phone_code: e.detail.code
    }
    console.log(params)
    getUserPhoneNumber(params).then(res => {
      console.log(1111, res)
      if (res.error_code !== 0) {
        return
      }
      const { phone_number } = res.data
      this.setData({
        mobile: phone_number
      })
    })
  },
  countDown() {
    if (this.data.countDown < 0) {
      this.setData({
        isSending: false,
        countDown: 60
      })
      return
    }
    this.setData({
      countDown: --this.data.countDown
    })
    setTimeout(() => {
      this.countDown()
    }, 1000)
  },
  // 发送短信验证码
  sendCode() {
    const phoneNumber = this.data.mobile
    if (this.data.isSending) {
      return
    }

    if (!phoneNumber) {
      Toast('请先输入手机号码')
      return
    }
    if (!verifyPhoneNumber(phoneNumber)) {
      Toast('您输入的手机号格式不正确')
      return
    }
    this.setData({
      isSending: true,
    })
    console.log(1111, OPENID)
    this.countDown()
    const params = {
      phone_number: phoneNumber,
      open_id: wx.getStorageSync(OPENID)
    }
    sendSmsCode(params).then(res => {
      if (res.error_code !== 0) {
        return
      }
      console.log(res.data)
      // const { } = res.data
    })
  },
  checkPhoneNumber() {
    checkPhoneNumber({
      phone_number: this.data.mobile
    }).then(res => {
      if (res.error_code !== 0) {
        Toast(res.msg)
        return
      }
      Toast('登录成功')
      wx.redirectTo({ url: '/pages/main/index/index' })
    })
  },
  // 检查手机号是否在白名单
  checkWhiteList() {
    const params = {
      phone_number: this.data.mobile,
      sms_code: this.data.sms,
      open_id: wx.getStorageSync(OPENID)
    }
    checkSmsCode(params).then(res => {
      if (res.error_code !== 0) {
        Toast(res.msg)
        return
      }
      const { access_token } = res.data
      wx.setStorageSync(TOKEN, access_token)
      this.checkPhoneNumber()
    })


  }
})
