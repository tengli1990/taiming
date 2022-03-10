

import request from '../utils/request'

// 查询物流订单列表
export const getDeliveryList = (data) => {
  return request({
    url: '/delivery/list',
    loading: true,
    data
  })
}

// 取消订单接口
export const cancelOrder = (data) => {
  return request({
    url: '/delivery/cancel',
    method: 'PUT',
    data
  })
}

// 获取未读数量
export const getUnread = (data) => {
  return request({
    url: '/delivery/unread/count',
    data
  })
}

// 设置已读
export const setRead = (data) => {
  return request({
    url: '/delivery/read',
    method: 'PUT',
    data
  })
}

// 获取运单详情
export const getDeliveryRoutes = (data)=>{
  return request({
    url:'/delivery/routes',
    data
  })
}