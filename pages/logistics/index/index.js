import { getDeliveryList, cancelOrder, getUnread, setRead } from '../../../apis/logistics'
const app = getApp()
const { $toast, $dialog } = app.globalData

Page({
  data: {
    searchText:"",
    isLoadedAll: false,
    page: 1,
    per_page: 10,
    totalPage: 1,
    orderList: [],
    currentStatus: 1,
    unreadData: { delivering_count: 0, collected_count: 0, exception_count: 0 }
  },
  onLoad() {
    this.getList()
    this.getUnreadData()
  },
  // 获取订单列表
  getList() {
    const params = {
      page: this.data.page,
      per_page: this.data.per_page,
      status: this.data.currentStatus,
      waybill_no: this.data.searchText
    }
    getDeliveryList(params).then(res => {
      if (res.error_code !== 0) {
        $toast(res.msg)
        return
      }
      const { delivery_order_list, current_page, pages } = res.data

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
          orderList: delivery_order_list
        })
        return
      }
      this.setData({
        orderList: [...this.data.orderList, ...delivery_order_list]
      })
    })
  },
  // 获取未读数据
  getUnreadData() {
    getUnread().then(res => {
      if (res.error_code !== 0) {
        $toast(res.msg)
        return
      }
      console.log(res)
      const { delivering_count, collected_count, exception_count } = res.data
      this.setData({
        unreadData: {
          delivering_count: delivering_count > 99 ? "99+": delivering_count,
          collected_count: collected_count > 99 ? "99+": collected_count,
          exception_count: exception_count > 99 ? "99+": exception_count,
        }
      })

      setRead().then(res => {
        console.log(res)
      })
    })
  },
  onTabChange({ detail }) {
    const { name } = detail
    this.setData({
      currentStatus: name,
      page: 1
    })
    this.getList()

  },
  // 取消寄件
  cancelOrderConfirm(event) {
    const { id } = event.currentTarget.dataset
    $dialog.confirm({
      title: '提示',
      message: '确认删除？',
      beforeClose: (action) => new Promise((resolve, reject) => {
        if (action === 'confirm') {
          cancelOrder({
            id
          }).then(res => {
            if (res.error_code !== 0) {
              $toast(res.msg)
              return
            }
            resolve(true)
            $toast('操作成功')
          })
        }
        resolve(true)
      })
    })
  },
  // 搜索
  onSearchChange(){
    // console.log(111)
  },
  onSearchSubmit(){
    this.setData({
      page: 1
    })
     this.getList()
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