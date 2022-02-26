const app = getApp();

Page({
  data: {
    defaultValue: ''
  },
  onload() {

  },
  setAddress() {
    wx.navigateTo({
      url: '../addressForm/addressForm'
    });
  },
  // 设置默认
  setDefault(event) {
    this.setData({
      defaultValue: event.detail
    })
  },
  deleteAddress() {
    app.globalData.$dialog.confirm({
      title: '提示',
      message: '确认删除？',
      beforeClose: (action) => new Promise((resolve, reject) => {
        if (action === 'confirm') {
          resolve(true)
        } else {
          resolve(true);
        }
      })

    })
  }
})