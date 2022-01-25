import request from '../utils/request'
import uploadRequest from '../utils/uploadRequest'

// 获取检测者列表接口
export const getSubjectList = (data) => {
  return request({
    url: '/subject/list',
    loading: true,
    data
  })
}


// 获取检测者详情接口
export const getSubjectDetail = (data) => {
  return request({
    url: `/subject/${data.id}`,
    loading: true
  })
}

// 修改检测者信息接口
export const updateSubjectInfo = (data, header) => {
  return request({
    url: `/subject/${data.id}`,
    method: 'PUT',
    loading: true,
    loadingText:'提交中...',
    data,
    header
  })
}

// 上传图片接口
export const uploadSubjectPicture = (data)=>{
  console.log(data)
  return uploadRequest({
    url:'/subject/picture',
    method: 'POST',
    filePath: data.filePath
  })
}

// 删除图片接口
export const removeSubjectPic = (data) => {
  return request({
    url: ``,
    method: '',
    loading: true,
    data
  })
}