import request from '../utils/request'

// 获取地址列表
export const getAreaList = (data) => {
  return request({
    baseURL:'',
    url: 'https://static.timingbio.com/collected_sample_wx_app/json_file/region_code.json',
    data
  })
}