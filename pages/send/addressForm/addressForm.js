import { areaList } from '../../../miniprogram_npm/@vant/area-data/index';
import { createAddress } from '../../../apis/send'
const app = getApp();
const { $toast } = app.globalData;
Page({
  data: {
    showPlacePopup: false,
    areaList,
    area: "",
    contact: '',
    tel: '',
    address: '',
    submitParams: {
      is_default: false,
      contact: '',
      tel: '',
      province: '',
      city: '',
      county: '',
      address: ''
    }
  },
  onload() {

  },
  selectAddress() {
    wx.navigateTo({
      url: '../address/address'
    });
  },
  // 设置默认
  setDefaultChange({ detail }) {
    this.setData({
      submitParams: {
        ...this.data.submitParams,
        is_default: detail
      }
    })
  },
  /**
   * @name 选择地区相关
   */
  // 打开popup
  openPlacePopup() {
    this.setShowPlacePopup(true)
  },
  // 关闭popup
  closePlacePopup() {
    this.setShowPlacePopup(false)
  },
  setShowPlacePopup(bool) {
    this.setData({
      showPlacePopup: bool
    })
  },
  // 选择
  selectedArea({ detail }) {
    const { values } = detail

    // values.forEach(((value,index)=>{

    // }))
    console.log(detail)
    const province = values[0].name
    const city = values[1].name
    const county = values[2].name
    this.setData({
      area: `${province}/${city}/${county}`,
      submitParams: {
        ...this.data.submitParams,
        province,
        city,
        county
      }
    })
    this.closePlacePopup()
  },

  // 保存并使用
  saveFn() {

    const { submitParams, contact, tel, address } = this.data
    this.setData({
      submitParams: {
        ...submitParams,
        contact,
        tel,
        address
      }
    })
    console.log(this.data.submitParams)
    createAddress(this.data.submitParams).then(res => {
      if (res.error_code !== 0) {
        app.globalData.$toast(res.msg)
        return
      }
      app.globalData.$toast('保存成功')
      wx.navigateBack()
    })
  },
  //  调用通讯录
  callMailList() {
    console.log(111)
    wx.chooseContact({
      success: (res) => {
        const { displayName, phoneNumber } = res

        this.setData({
          contact: displayName,
          tel: phoneNumber,
        })

      },
      fail: (err) => {
        console.log(err)
        $toast('获取失败，请重新尝试')
      }
    })
  }
})