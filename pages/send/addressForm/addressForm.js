import { areaList } from '../../../miniprogram_npm/@vant/area-data/index';
Page({
  data: {
    showPlacePopup: false,
    areaList,
  },
  onload() {

  },
  selectAddress() {
    wx.navigateTo({
      url: '../address/address'
    });
  },
  openPlacePopup() {
    console.log(areaList)
    this.setShowPlacePopup(true)
  },
  closePlacePopup() {
    this.setShowPlacePopup(false)
  },
  setShowPlacePopup(bool) {
    this.setData({
      showPlacePopup: bool
    })
  }
})