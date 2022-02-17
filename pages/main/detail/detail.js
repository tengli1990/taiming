import { getSubjectDetail, updateSubjectInfo, uploadSubjectPicture } from '../../../apis/main'
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({
  data: {
    fileList: [],
    id: null,
    // 收集状态
    checked: false,
    updateParams: {}
  },
  onLoad(opt) {
    this.setData({
      id: opt.id
    })
    this.getDetailInfo()
  },
  // 获取详情接口
  getDetailInfo() {
    const params = {
      id: this.data.id
    }
    getSubjectDetail(params).then(res => {
      if (res.error_code !== 0) {
        Toast(res.msg)
        return
      }
      const { picture_list, status } = res.data
      this.setData({
        fileList: picture_list,
        updateParams: res.data,
        checked: !!status
      })
    })
  },
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
      // wx.compressImage({
      //   src: file[i].url, // 图片路径
      //   quality: 80, // 压缩质量
      //   success: function (res) {
      //     uploadPromiseTask.push(that.uploadFile(res.tempFilePath));
      //     uploadIndex++
      //     if (file.length === uploadIndex) {
      //       startUpload()
      //     }
      //   }
      // })
      uploadPromiseTask.push(this.uploadFile(file[i].url));
    }
    // function startUpload() {
    Promise.all(uploadPromiseTask)
      .then(res => {
        const currentUpload = []
        for (let item of res) {
          currentUpload.push(item.data)
        }
        that.setData({
          fileList: that.data.fileList.concat(currentUpload)
        })
        that.data.updateParams.picture_list = that.data.fileList
        that.updateSubjectInfo()
        wx.hideLoading();
      })
      .catch(error => {
        wx.hideLoading();
        wx.showToast({
          title: '上传失败！',
          icon: 'none'
        });
      });
    // }
  },
  // 上传单张图片
  uploadFile(uploadFile) {
    return new Promise((resolve, reject) => {
      uploadSubjectPicture({
        filePath: uploadFile,
        subject_id: this.data.id
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
          this.data.updateParams.picture_list.forEach((item, index) => {
            if (index === event.detail.index) {
              item.is_deleted = true
            }
          })
          this.data.updateParams.picture_list = this.data.fileList
          this.updateSubjectInfo(() => {
            const currentFileList = this.data.fileList
            currentFileList.splice(event.detail.index, 1)
            this.setData({
              fileList: currentFileList
            })
            resolve(true)
          })
        } else {
          resolve(true);
        }
      })

    });
  },
  // 收集状态变化
  onSwitchChange({ detail }) {
    this.setData({ checked: detail });
    this.updateSubjectInfo()
  },
  // 更新数据
  updateSubjectInfo(callback) {
    const params = {
      ...this.data.updateParams,
      id: this.data.id,
      status: +this.data.checked
    }
    updateSubjectInfo(params).then(res => {
      if (res.error_code !== 0) {
        Toast(res.msg)
        return
      }

      if (callback) {
        callback()
      }
      Toast('操作成功')
    })
  }

})