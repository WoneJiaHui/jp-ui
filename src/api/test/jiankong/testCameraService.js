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
  save: function (inputForm) {
    return request({
      url: '/test/jiankong/testCamera/save',
      method: 'post',
      data: inputForm
    });
  }
}
