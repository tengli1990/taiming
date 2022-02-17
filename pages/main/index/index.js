import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import { getSubjectList } from '../../../apis/main'
// 获取应用实例
const app = getApp()

Page({
  data: {
    moduleList: [
      {
        key: 0,
        icon: 'http://static.timingbio.com/collected_sample_wx_app/index_icon/lab.png',
        title: '寄样'
      },
      {
        key: 1,
        icon: 'http://static.timingbio.com/collected_sample_wx_app/index_icon/car.png',
        title: '物流'
      },
      {
        key: 2,
        icon: 'http://static.timingbio.com/collected_sample_wx_app/index_icon/doc.png',
        title: '建档'
      },
      {
        key: 3,
        icon: 'http://static.timingbio.com/collected_sample_wx_app/index_icon/photo.png',
        title: '收样品'
      }
    ],
    headPortrait: {
      0: 'http://static.timingbio.com/collected_sample_wx_app/gender_icon/unknow.png', // 未知
      1: 'http://static.timingbio.com/collected_sample_wx_app/gender_icon/male.png', // 男
      2: 'http://static.timingbio.com/collected_sample_wx_app/gender_icon/female.png' // 女
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
      sample_received_date: '',
      sample_received_date_end: '',
      sample_received_date_start: ''
    },
    page: 1,
    per_page: 7,
    totalPage: 1,
    scrollTop: 0,
    fuzzy_search: '',
    isFilter: false,
    refresh: true,
    animationData: null
  },
  onShow() {
    this.setData({
      isFilter: false
    })

    // 排除不需要依赖判断的字段，如果选择的医生为全部 那么doctor_name的值是存在的所以需要忽略判断
    const excludesKey = ['doctor_name']
    for (let key in this.data.searchParams) {
      if (!excludesKey.includes(key) && this.data.searchParams[key] !== '') {
        console.log(key)
        this.setData({
          isFilter: true
        })
      }
    }
    if (this.data.refresh) {
      this.resetPage()
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
  // 重制页面
  resetPage() {
    this.setData({
      page: 1
    })
    this.setData({
      scrollTop: 0
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
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
  },
  // 点击刷新列表
  onReplay() {
    // 顺时针旋转实例
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease'
    })
    // 逆时针旋转实例
    var animation1 = wx.createAnimation({
      duration: 10,
      timingFunction: 'ease'
    })

    animation.rotate(450).step()
    this.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation1.rotate(0).step()
      this.setData({
        animationData: animation1.export()
      })
    }.bind(this), 1300);

    this.resetPage()
    this.getList()
  }
})
