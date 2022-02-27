import request from '../utils/request'
import uploadRequest from '../utils/uploadRequest'
// 上传图片接口
export const uploadDeliveryPicture = ({ filePath }) => {
  return uploadRequest({
    url: '/delivery/picture',
    method: 'POST',
    filePath: filePath,
  })
}


// 新增地址
export const createAddress = (data) => {
  return request({
    url: '/address',
    method: 'POST',
    data
  })
}

// 获取地址列表
export const getAddressList = (data) => {
  return request({
    url: '/address/list',
    loading: true,
    data
  })
}

// 删除物流地址
export const removeAddressList = (data) => {
  return request({
    url: '/address',
    method: 'DELETE',
    data
  })
}


// 获取默认物流信息
export const getAddressDefault = (data) => {
  return request({
    url: '/address/default',
    data
  })
}

// 下单接口
export const submitDeliveryOrder = (data) => {
  return request({
    url: '/delivery',
    method: 'POST',
    data
  })
}