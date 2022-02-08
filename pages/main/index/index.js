import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import { getSubjectList } from '../../../apis/main'
// 获取应用实例
const app = getApp()

Page({
  data: {
    moduleList: [
      {
        key: 0,
        icon: 'http://static.timingbio.com/frontend/%20%E7%94%BB%E6%9D%BF%20%E2%80%93%201%402x.png',
        title: '寄样'
      },
      {
        key: 1,
        icon: 'http://static.timingbio.com/frontend/%20%E7%94%BB%E6%9D%BF%20%E2%80%93%202%402x.png',
        title: '物流'
      },
      {
        key: 2,
        icon: 'http://static.timingbio.com/frontend/%20%E7%94%BB%E6%9D%BF%20%E2%80%93%203%402x.png',
        title: '建档'
      },
      {
        key: 3,
        icon: 'http://static.timingbio.com/frontend/%20%E7%94%BB%E6%9D%BF%20%E2%80%93%204%402x.png',
        title: '收样品'
      }
    ],
    headPortrait: {
      0: 'http://static.timingbio.com/frontend/%20u%402x.png', // 未知
      1: 'http://static.timingbio.com/frontend/%20m%402x.png', // 男
      2: 'http://static.timingbio.com/frontend/%20f%402x.png' // 女
    },
    gender: {
      0: '未知',
      1: '男',
      2: '女'
    },
    emptyIcon: 'search',
    subjectList: [],
    searchParams: {
      doctor_id: '',
      status: '',
      sample_received_date: ''
    },
    page: 1,
    per_page: 20,
    totalPage: 1,
    fuzzy_search: '',
    isFilter: false,
    refresh: true,
  },
  onShow() {
    this.setData({
      isFilter: false
    })

    // 排除不需要依赖判断的字段，如果选择的医生为全部 那么doctor_name的值是存在的所以需要忽略判断
    const excludesKey = ['doctor_name']
    for (let key in this.data.searchParams) {
      if (!excludesKey.includes(key) && this.data.searchParams[key] !== '') {
        this.setData({
          isFilter: true
        })
        this.resetPage()
      }
    }
    if (this.data.refresh) {
      this.getList()
    }
  },
  // 跳转到筛选
  toFilterPage() {
    console.log(JSON.stringify(this.data.searchParams))
    wx.navigateTo({
      url: `../filter/filter?params=${JSON.stringify(this.data.searchParams)}`
    })
  },

  // 获取列表接口
  getList() {
    const { doctor_id, status, sample_received_date_start = '', sample_received_date_end = '' } = this.data.searchParams
    const params = {
      doctor_id,
      status,
      sample_received_date_start,
      sample_received_date_end,
      fuzzy_search: this.data.fuzzy_search,
      page: this.data.page,
      per_page: this.data.per_page
    }
    getSubjectList(params).then(res => {
      if (res.error_code !== 0) {
        Toast(res.msg)
        return
      }
      console.log(res)
      const { subject_list, current_page, pages } = res.data
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
          subjectList: subject_list
        })
        return
      }
      this.setData({
        subjectList: [...this.data.subjectList, ...subject_list]
      })
    })
  },
  onSearch() {
    this.resetPage()
    this.getList()
  },
  toDetail(e) {
    console.log()
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../detail/detail?id=${id}`
    })
  },
  resetPage() {
    this.setData({
      page: 1
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
  },
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
