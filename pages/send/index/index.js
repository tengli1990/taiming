Page({
  data: {
    value: ""
  },
  onload() {

  },
  selectAddress() {
    wx.navigateTo({
      url: '../address/address'
    });
  }
})