// src/api/cameraMonitorService.js
import request from '@/utils/httpRequest'

export default {
  // 获取摄像头列表
  list: function (params) {
    return request({
      url: '/camera/monitor/list',
      method: 'get',
      params: params
    })
  },
  // 获取摄像头实时视频流
  getVideoStream: function (cameraId) {
    return request({
      url: `/camera/monitor/${cameraId}/stream`,
      method: 'get'
    })
  }
}