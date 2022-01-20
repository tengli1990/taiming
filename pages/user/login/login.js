const app = getApp();
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import { getAccessToken, getUserPhoneNumber, sendSmsCode, checkPhoneNumber } from '../../../apis/user'
import { verifyPhoneNumber } from '../../../utils/index'
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getPhoneNumber'),
    mobile: '',
    sms: '',
    username: '11',
    agreementChecked: true,
    // 发送验证码倒计时
    isSending: false,
    countDown: 60
  },
  onLoad: function (options) {
    // 登录
    wx.login({
      success: res => {
        const { code } = res
        getAccessToken({ js_code: code }).then(res => {
          if (res.error_code !== 0) {
            return
          }
          console.log(222, res)
          const { access_token, is_logined, openid } = res.data
          wx.setStorageSync('accessToken', access_token)
          wx.setStorageSync('openid', openid)
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
      access_token: wx.getStorageSync('accessToken'),
      phone_code: e.detail.code
    }
    console.log(params)
    getUserPhoneNumber(params).then(res => {
      console.log(1111, res)
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
    if(this.data.isSending){
      return
    }

    if(!phoneNumber){
      Toast('请先输入手机号码')
      return
    }
    if(!verifyPhoneNumber(phoneNumber)){
      Toast('您输入的手机号格式不正确')
      return
    }
    this.setData({
      isSending: true,
    })
    this.countDown()
    const params = {
      phone_number:phoneNumber ,
      open_id: wx.getStorageSync('openid')
    }
    sendSmsCode(params).then(res => {
      if (res.error_code !== 0) {
        return
      }

      const { } = res.data
    })
  },
  // 检查手机号是否在白名单
  checkWhiteList(){
    checkPhoneNumber({
      phoneNumber:this.data.mobile
    }).then(res=>{
      if(res.error_code !== 0){
        Toast(res.msg)
        return
      }

      console.log(res)
    })
  }
})
