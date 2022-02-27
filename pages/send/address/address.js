import { getAddressList, removeAddressList } from '../../../apis/send'
const app = getApp();
const { $toast, $dialog } = app.globalData
Page({
  data: {
    defaultValue: '',
    addressList: []
  },
  onLoad() {
    this.getList()
  },
  getList() {
    getAddressList({
      contact_type: 1
    }).then(res => {
      if (res.error_code !== 0) {
        app.gobalData.$toast(res.msg)
        return
      }
      const { address_list } = res.data
      address_list.forEach((address, index) => {
        if (address.is_default) {
          this.setData({
            defaultValue: index
          })
        }
      })
      this.setData({
        addressList: address_list
      })
    })
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
  deleteAddress(event) {
    const { id } = event.target.dataset

    $dialog.confirm({
      title: '提示',
      message: '确认删除？',
      beforeClose: (action) => new Promise((resolve, reject) => {
        if (action === 'confirm') {
          removeAddressList({ id }).then(res => {
            if (res.error_code !== 0) {
              $toast(res.msg)
              return
            }
            $toast('删除成功')
            this.getList()
          })
          resolve(true)
        } else {
          resolve(true);
        }
      })

    })
  }
})