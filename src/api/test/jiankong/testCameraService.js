// src/api/test/jiankong/testCameraService.js
import request from '@/utils/httpRequest'

export default {
  // 获取摄像头列表
  list: function (params) {
    return request({
      url: '/test/jiankong/testCamera/list',
      method: 'get',
      params: params
    })
  },
  // 保存摄像头信息
  save: function (inputForm) {
    return request({
      url: '/test/jiankong/testCamera/save',
      method: 'post',
      data: inputForm
    })
  },
  // 删除摄像头信息
  delete: function (id) {
    return request({
      url: `/test/jiankong/testCamera/delete/${id}`,
      method: 'delete'
    })
  },
  // 更新摄像头信息
  update: function (inputForm) {
    return request({
      url: '/test/jiankong/testCamera/update',
      method: 'put',
      data: inputForm
    })
  },
  // 根据 ID 查询摄像头信息
  queryById: function (id) {
    return request({
      url: `/test/jiankong/testCamera/queryById/${id}`,
      method: 'get'
    })
  },
  exportExcel: function (params) {
    return request({
      url: '/test/jiankong/testCamera/export',
      method: 'get',
      params: params,
      responseType: 'blob'
    })
  },
  importExcel: function (data) {
    return request({
      url: '/test/jiankong/testCamera/import',
      method: 'post',
      data: data
    })
  }
}
