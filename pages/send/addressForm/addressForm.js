import { areaList } from '../../../miniprogram_npm/@vant/area-data/index';
import { createAddress, updateAddress, getAddressDetail } from '../../../apis/send'
// import { getAreaList } from '../../../apis/index'
const app = getApp();
const { $toast } = app.globalData;
Page({
  data: {
    currentAddressCode: '',
    addressId: '',
    showPlacePopup: false,
    areaList,
    area: "",
    contact: '',
    tel: '',
    address: '',
    is_default: false,
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
  onLoad(opt) {
    this.setData(opt)
    this.getAddressDetail()
    this.getAreaList()
  },
  selectAddress() {
    wx.navigateTo({
      url: '../address/address'
    });
  },
  getAreaList() {
    // getAreaList().then(res=>{
    //   console.log(res)
    // })
  },
  getAddressDetail() {
    if (!this.data.addressId) return
    getAddressDetail({
      id: this.data.addressId
    }).then(res => {
      if (res.error_code !== 0) {
        $toast(res.msg)
        return
      }
      const { county_list } = this.data.areaList
      const { address, contact, tel, province, city, county, is_default } = res.data
      let code = ""
      for (let key in county_list) {
        if ([county].includes(county_list[key])) {
          code = key
        }
      }
      console.log(code)
      this.setData({
        area: province + '/' + city + "/" + county,
        address,
        contact,
        tel,
        is_default: !!is_default,
        currentAddressCode: code
      })
    })
  },
  // 设置默认
  setDefaultChange({ detail }) {
    this.setData({
      is_default: detail
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
    const { addressId, contact, tel, address, is_default, area } = this.data
    const areaArr = area.split('/')
    const params = {
      contact,
      tel: Number(tel),
      address,
      province: areaArr[0],
      city: areaArr[1],
      county: areaArr[2],
      is_default
    }
    let apiName = createAddress

    if (addressId) {
      params.id = Number(addressId)
      apiName = updateAddress
    }

    apiName(params).then(res => {
      if (res.error_code !== 0) {
        app.globalData.$toast(res.msg)
        return
      }
      app.globalData.$toast('保存成功')

      const pages = getCurrentPages();
      let prevPage = pages[pages.length - 2]
      prevPage.setData({
        request: true
      })
      wx.navigateBack({
        delta: 1  // 返回上一级页面。
      })
    })
  },
  //  调用通讯录
  callMailList() {
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