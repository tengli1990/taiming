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
      department: '',
      status: '',
      sample_received_date: '',
      sample_received_date_start: '',
      sample_received_date_end: ''
    },
    fuzzy_search:'',
    isFilter: false,
    refresh: true,
  },
  onShow() {
    this.setData({
      isFilter: false
    })
    for (let key in this.data.searchParams) {
      if (this.data.searchParams[key] !== '') {
        this.setData({
          isFilter: true
        })
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
    const { doctor_id, status, sample_received_date_start, sample_received_date_end } = this.data.searchParams
    const params = {
      doctor_id,
      status,
      sample_received_date_start,
      sample_received_date_end,
      fuzzy_search: this.data.fuzzy_search
    }
    getSubjectList(params).then(res => {
      if (res.error_code !== 0) {
        Toast(res.msg)
        return
      }
      console.log(res)
      const { subject_list } = res.data
      this.setData({
        subjectList: subject_list
      })
    })
  },
  onSearch(){
    this.getList()
  },
  toDetail(e) {
    console.log()
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../detail/detail?id=${id}`
    })
  }
})
