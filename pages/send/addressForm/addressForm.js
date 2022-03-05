// import { areaList } from '../../../miniprogram_npm/@vant/area-data/index';
import areaList from '../../../assets/js/region_code.js'
import { createAddress, updateAddress, getAddressDetail } from '../../../apis/send'
import qqmap from '../../../miniprogram_npm/qqmap-wx-jssdk/index';
import { verifyPhoneNumber } from '../../../utils/index'
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
    // submitParams: {
    //   contact: '',
    //   tel: '',
    //   province: '',
    //   city: '',
    //   county: '',
    //   address: ''
    // }
  },
  onLoad(opt) {
    this.setData(opt)
    this.getAddressDetail()
    console.log(areaList)
  },
  selectAddress() {
    wx.navigateTo({
      url: '../address/address'
    });
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
      // submitParams: {
      //   ...this.data.submitParams,
      //   province,
      //   city,
      //   county
      // }
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

    // check params
    const requiredField = {
      contact: '请填写收货人姓名',
      tel: '请填写收货人手机号码',
      province: '请选择所在地区',
      address: '请填写详细地址'
    }

    for (let key in requiredField) {
      if (!params[key]) {
        $toast(requiredField[key])
        return
      }
      if (key === 'tel' && !verifyPhoneNumber(params[key])) {
        $toast('您输入的手机号格式不正确')
        return
      }
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
        $toast('获取失败，请重新尝试')
      }
    })
  },
  // 获取定位经纬度
  getLocation() {
    const that = this;
    wx.chooseLocation({
      success: function (res) {
        that.getOnlineDistrict(res.latitude, res.longitude)
      },
      fail: function () {
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.userLocation']) {
              wx.authorize({
                scope: 'scope.userLocation',
                success() {
                  wx.chooseLocation({
                    success: function (res) {
                      that.getOnlineDistrict(res.latitude, res.longitude)
                    },
                  })
                }
              })
            }
          }
        })
      }
    })
  },
  //这里调用腾讯地图api 获取用户位置所在区
  getOnlineDistrict(latitude, longitude) {
    const that = this
    var map = new qqmap({
      key: "XY4BZ-XMQ6W-SIXRP-RBM3P-64VDH-FZFDE"
    })
    //通过这个方法来实现经纬度反推省市区
    map.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        const { address_component } = res.result;
        const { county_list } = that.data.areaList

        const { province, city, district, street_number } = address_component
        let code = ""
        for (let key in county_list) {
          if ([district].includes(county_list[key])) {
            code = key
          }
        }

        that.setData({
          area: `${province}/${city}/${district}`,
          province,
          city,
          county: district,
          currentAddressCode: code,
          address: street_number

        })
      },
      fail: function (err) {
        $toast('获取地址失败')
      }
    })
  }
})