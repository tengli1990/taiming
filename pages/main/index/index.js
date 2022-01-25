import { getSubjectList } from '../../../apis/main'
// 获取应用实例
const app = getApp()

Page({
  data: {
    moduleList: [
      {
        icon: 'http://static.timingbio.com/frontend/%20%E7%94%BB%E6%9D%BF%20%E2%80%93%201%402x.png',
        title: '寄样'
      },
      {
        icon: 'http://static.timingbio.com/frontend/%20%E7%94%BB%E6%9D%BF%20%E2%80%93%202%402x.png',
        title: '物流'
      },
      {
        icon: 'http://static.timingbio.com/frontend/%20%E7%94%BB%E6%9D%BF%20%E2%80%93%203%402x.png',
        title: '建档'
      },
      {
        icon: 'http://static.timingbio.com/frontend/%20%E7%94%BB%E6%9D%BF%20%E2%80%93%204%402x.png',
        title: '收样品'
      }
    ],
    headPortrait: {
      0: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Finews.gtimg.com%2Fnewsapp_bt%2F0%2F13455144170%2F1000.jpg', // 未知
      1: 'https://test-res.kaikeba.com/image/123/20220121172842-96063/FqMBz2DIeQPHWyi4av0hR4E2fHyk.jpeg?imageView2/0/interlace/1/q/70|imageslim', // 男
      2: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Finews.gtimg.com%2Fnewsapp_bt%2F0%2F13505141991%2F1000.jpg' // 女
    },
    gender: {
      0: '未知',
      1: '男',
      2: '女'
    },
    emptyIcon: 'search',
    subjectList: []
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    this.getList()
  },
  // 跳转到筛选
  toFilterPage() {
    console.log(111)
    wx.navigateTo({
      url: '../filter/filter'
    })
  },
  // 获取列表接口
  getList() {
    const params = {}
    getSubjectList(params).then(res => {
      if (res.error_code !== 0) {
        return
      }
      console.log(res)
      const { subject_list } = res.data
      this.setData({
        subjectList: subject_list
      })
    })
  },
  toDetail(e) {
    console.log()
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../detail/detail?id=${id}`
    })
  }
})
