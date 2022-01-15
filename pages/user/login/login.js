Page({
  data: {
    title: "太铭生物",
    fillMode: 'man', // auto
    mobile: '15810660233',
    sms: '',
    username: '11',
    agreementChecked: true
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {

  },
  changeMode() {
    this.setData({
      fillMode: 'manual'
    })
  },
  // 授权协议选中
  onAgreementChange(e) {
    const { agreementChecked } = this.data
    this.setData({
      agreementChecked: !agreementChecked
    })
  }
})