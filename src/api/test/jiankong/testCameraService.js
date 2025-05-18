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
  // 获取摄像头实时视频流
  getVideoStream: function (cameraId) {
    return request({
      url: '/test/jiankong/testCamera/video-stream/{cameraId}',
      method: 'get'
    })
  }
}
