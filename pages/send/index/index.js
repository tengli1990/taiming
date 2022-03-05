import { getAddressDefault, uploadDeliveryPicture, submitDeliveryOrder } from '../../../apis/send'
const app = getApp();
const { $toast, $formatDate } = app.globalData
Page({
  data: {
    skeleton: true,
    consigneeInfo: {},
    consignorInfo: {},
    addressList: [
      {
        index: 0,
        typeName: '寄',
        selectable: true,
      },
      {
        index: 1,
        typeName: '收',
        selectable: false,
      }
    ],
    //时段数据
    timeIntervalIndex: 0,
    timeIntervalVal: 0,
    timeIntervalText: '一个小时内',
    timeIntervalColumn: (() => {
      let timeGroup = []
      for (let i = 10; i <= 19; i++) {
        timeGroup.push({
          text: `${i}:00~${i + 1}:00`,
          value: i
        })
      }
      return [
        { value: 0, text: '一个小时内' },
        ...timeGroup
      ]
    })(),
    // 物品图片
    fileList: [],
    cargoDetails: '',
    submitParams: {
      consignor_address_id: '', // 寄件人id
      consignee_address_id: '', // 收件人id
      except_take_datetime_start: $formatDate(new Date(new Date().getTime() - 60 * 60 * 1000), 'yyyy-mm-dd HH:mi:ss'),// 预约取件开始时间
      except_take_datetime_end: $formatDate(new Date(), 'yyyy-mm-dd HH:mi:ss'),// 预约取件结束时间
      cargo_details: '', // 物品数量信息
      pay_method: 2, //  1 寄付，2到付
      image_list: [] // 物品照片
    }
  },
  onLoad() {
    this.getInitInfo()
  },
  getInitInfo() {
    getAddressDefault().then(res => {
      if (res.error_code !== 0) {
        $toast(res.msg)
        return
      }
      const { consignee_address, consignor_address } = res.data
      this.data.addressList = [
        { ...this.data.addressList[0], ...consignor_address },
        { ...this.data.addressList[1], ...consignee_address }
      ]
      this.setData({
        addressList: this.data.addressList,
        skeleton: false,
      })

    })
  },
  selectAddress(event) {
    const { index } = event.currentTarget.dataset

    if (!this.data.addressList[index].selectable) {
      return
    }
    wx.navigateTo({
      url: '../address/address?type=' + index
    });
  },
  /**
   * @name 选择时间段
   * @param {} event 
   */
  openTimePopup() {
    this.setData({
      showTimePopup: true
    })
  },
  closeTimePopup() {
    this.setData({
      showTimePopup: false
    })
  },
  timeIntervalConfirm({ detail }) {
    const { submitParams } = this.data
    if (detail.value.value === 0) {
      this.setData({
        submitParams: {
          ...submitParams,
          except_take_datetime_start: $formatDate(new Date(new Date().getTime() - 60 * 60 * 1000), 'yyyy-mm-dd HH:mi:ss'),
          except_take_datetime_end: $formatDate(new Date(), 'yyyy-mm-dd HH:mi:ss')
        }
      })
      return
    }
    const val = detail.value.value
    const text = detail.value.text

    this.closeTimePopup()
    const datePrefix = $formatDate(new Date(), 'yyyy-mm-dd')
    this.setData({
      timeIntervalIndex: detail.index,
      timeIntervalText: text,
      timeIntervalVal: val,
      submitParams: {
        ...submitParams,
        except_take_datetime_start: `${datePrefix} ${val}:00:00`,
        except_take_datetime_end: `${datePrefix} ${val + 1}:00:00`
      }
    })
  },
  /** 
   * @name 上传图片
   */
  // 上传图片前
  beforeRead(event) {
    const { callback } = event.detail
    callback(true)
  },
  // 上传图片后
  afterRead(event) {
    let that = this;
    wx.showLoading({
      title: '上传中...'
    });
    const { file } = event.detail;

    let uploadPromiseTask = [];
    let uploadIndex = 0
    for (let i = 0; i < file.length; i++) {
      wx.compressImage({
        src: file[i].url, // 图片路径
        quality: 60, // 压缩质量
        success: function (res) {
          uploadPromiseTask.push(that.uploadFile(res.tempFilePath));
          uploadIndex++
          if (file.length === uploadIndex) {
            startUpload()
          }
        }
      })
      // uploadPromiseTask.push(this.uploadFile(file[i].url));
    }
    function startUpload() {
      Promise.all(uploadPromiseTask)
        .then(res => {
          const currentUpload = []
          for (let item of res) {
            currentUpload.push(item.data)
          }
          that.setData({
            fileList: that.data.fileList.concat(currentUpload)
          })
          wx.hideLoading();
        })
        .catch(error => {
          wx.hideLoading();
          wx.showToast({
            title: '上传失败！',
            icon: 'none'
          });
        });
    }
  },
  // 上传单张图片
  uploadFile(uploadFile) {
    return new Promise((resolve) => {
      uploadDeliveryPicture({
        filePath: uploadFile
      }).then(resolve)
    });
  },
  // 删除图片
  removeFile(event) {
    Dialog.confirm({
      title: '提示',
      message: '确认删除？',
      beforeClose: (action) => new Promise((resolve, reject) => {
        if (action === 'confirm') {
          const currentFileList = this.data.fileList
          currentFileList.splice(event.detail.index, 1)
          this.setData({
            fileList: currentFileList
          })
        } else {
          resolve(true);
        }
      })
    });
  },
  submit() {
    const { submitParams, cargoDetails, addressList, fileList } = this.data

    this.setData({
      submitParams: {
        ...submitParams,
        cargo_details: Number(cargoDetails || 0),
        consignor_address_id: addressList[0].id, // 寄件人id
        consignee_address_id: addressList[1].id, // 收件人id
        image_list: fileList.map(item => item.url)
      }
    })
    submitDeliveryOrder(this.data.submitParams).then(res => {
      if (res.error_code !== 0) {
        $toast(res.msg)
        return
      }
      $toast('下单成功')
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/logistics/index/index'
        });
      }, 1000)
    })
  }
})