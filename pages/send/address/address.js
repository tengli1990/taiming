import { getAddressList, removeAddressList } from '../../../apis/send'
const app = getApp();
const { $toast, $dialog } = app.globalData
Page({
  data: {
    isLoadedAll: false,
    page: 1,
    per_page: 10,
    totalPage: 1,
    defaultValue: '',
    addressList: [],
    selectType: null,
    request: false
  },
  onLoad(opt) {
    console.log(opt)
    this.setData({
      selectType: Number(opt.type)
    })
    this.getList()
  },
  onShow(e) {
    if (this.data.request) {
      this.setData({
        request: false
      })
      this.getList()
    }
  },
  getList() {
    const contactType = {
      '0': 1,
      '1': 2
    }
    const params = {
      page: this.data.page,
      per_page: this.data.per_page,
      contact_type: contactType[this.data.selectType]
    }
    getAddressList(params).then(res => {
      if (res.error_code !== 0) {
        app.gobalData.$toast(res.msg)
        return
      }
      const { address_list, current_page, pages } = res.data
      address_list.forEach((address, index) => {
        if (address.is_default) {
          this.setData({
            defaultValue: index
          })
        }
      })

      this.setData({
        totalPage: pages
      })
      if (current_page === pages) {
        this.setData({
          isLoadedAll: true
        })
      }
      if (current_page === 1) {
        this.setData({
          addressList: address_list
        })
        return
      }
      this.setData({
        addressList: [...this.data.addressList, ...address_list]
      })
    })
  },
  editAddress(event) {
    const { id } = event.currentTarget.dataset
    wx.navigateTo({
      url: `../addressForm/addressForm?addressId=${id}`
    });
  },
  createAddress() {
    wx.navigateTo({
      url: `../addressForm/addressForm`
    });
  },
  // 设置默认
  setDefault(event) {
    console.log(event)
    this.setData({
      defaultValue: event.detail
    })
  },
  // 删除地址
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
  },
  // 选择地址返回上一页
  onSelect(event) {
    console.log()
    const { selectType } = this.data
    const pages = getCurrentPages();
    let prevPage = pages[pages.length - 2]
    prevPage.data.addressList[selectType] = {
      ...prevPage.data.addressList[selectType],
      ...event.currentTarget.dataset.item
    }
    prevPage.setData({
      addressList: prevPage.data.addressList
    })

    wx.navigateBack({//返回
      delta: 1
    })
  },
  // 上啦加载
  onReachBottom() {
    if (this.data.page >= this.data.totalPage) {
      return
    }
    this.setData({
      page: ++this.data.page
    })
    this.getList()
  }
})