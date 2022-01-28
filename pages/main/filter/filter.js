import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import { getRoleDoctorList } from '../../../apis/main'
import { formatDate } from '../../../utils/index'
import GetPeriod from "../../../utils/period.js"

Page({
  data: {

    // 收样来源
    showSampleSourcePop: false,
    sampleSourceOptions: [],
    sourceValue: '',
    // 选择时间pop
    showSelectDatePop: false,
    operationType: "",
    currentDate: new Date().getTime(),
    maxDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      return `${value}日`;
    },
    dateOptions: [
      {
        value: '',
        label: '全部'
      },
      {
        value: 1,
        label: '本月'
      },
      {
        value: 2,
        label: '上个月'
      },
      {
        value: 3,
        label: '最近3个月'
      },
      {
        value: 4,
        label: '最近半年'
      },
      {
        value: 5,
        label: '自定义'
      }
    ],

    // 数据情况
    statusOptions: [
      {
        value: '',
        label: '全部'
      },
      {
        value: 0,
        label: '待补充'
      },
      {
        value: 1,
        label: '完善'
      }
    ],
    // 列表参数
    params: {
      source: '',
      department: '',
      status: '',
      sample_received_date: '',
    },
    middleDate: '',
    sample_received_date_start: '',
    sample_received_date_end: ''
  },
  onLoad(opt) {
    this.time = new GetPeriod();
    const params = JSON.parse(opt.params)
    this.setData({
      params: params,
      sample_received_date_start: params.sample_received_date_start,
      sample_received_date_end: params.sample_received_date_end,
      sourceValue: params.source
    })

    getRoleDoctorList().then(res => {
      if (res.error_code !== 0) {
        Toast(res.msg)
        return
      }
      const { doctor_list } = res.data
      this.setData({
        sampleSourceOptions: doctor_list.map(item => ({ text: item.name }))
      })
    })
  },
  sampleSourceOpen() {
    this.setData({
      showSampleSourcePop: true
    })
  },
  sampleSourceClose() {

  },
  confirmSource(event) {
    const { text } = event.detail.value
    console.log(event)
    this.setData({
      sourceValue: text
    })
    this.cancelSource()
  },
  cancelSource() {
    this.setData({
      showSampleSourcePop: false
    })
  },
  // 选择数据情况或收样日期
  onSelected(event) {
    let { value, field } = event.currentTarget.dataset;

    // 如果选择自定义日期则清空默认
    if (field === 'sample_received_date') {
      let startDate = ''
      let endDate = ''
      switch (value) {
        case 1:
          startDate = this.time.getMonthStartDate();
          endDate = this.time.getMonthEndDate();
          break;
        case 2:
          startDate = this.time.getPrevMonthStartDate();
          endDate = this.time.getPrevMonthEndDate();
          break;
        case 3:
          startDate = this.time.getLastThreeMonthStartDate()
          endDate = this.time.getNowDate();
          break;
        case 4:
          startDate = this.time.getLastSixMonthStartDate()
          endDate = this.time.getNowDate();
          break;
      }
      this.setData({
        sample_received_date_start: startDate,
        sample_received_date_end: endDate,
        middleDate: new Date()
      })
    }
    this.setData({
      params: {
        ...this.data.params,
        [field]: value
      }
    })
  },
  selectDateClose() {
    this.setData({
      showSelectDatePop: false
    })
  },
  // 滑动选择时间同步更新中间值
  onInput(event) {
    this.setData({
      middleDate: event.detail,
    });
  },
  // 点击选择日期
  openSelectDate(event) {
    const { type } = event.currentTarget.dataset
    this.setData({
      operationType: type,
      showSelectDatePop: true
    })
  },
  selectDateConfirm() {
    const { operationType, middleDate } = this.data
    this.setData({
      showSelectDatePop: false,
      [`sample_received_date_${operationType}`]: formatDate(new Date(middleDate), "YYYY-MM-DD")
    })
  },
  selectDateCancel() {
    this.setData({
      showSelectDatePop: false
    })
  },
  // 提交筛选
  submitFilterOptions() {
    const pages = getCurrentPages();
    let prevPage = pages[pages.length - 2]
    const sample_received_date_start = this.data.sample_received_date_start
    const sample_received_date_end = this.data.sample_received_date_end
    prevPage.setData({
      searchParams: {
        ...this.data.params,
        sample_received_date_start,
        sample_received_date_end,
        source: this.data.sourceValue
      }
    })

    wx.navigateBack({//返回
      delta: 1
    })
  }
})