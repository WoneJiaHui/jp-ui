import request from '@/utils/httpRequest'

export default {
  // 获取摄像头列表
  list (params) {
    return request({
      url: '/test/jiankong/testCamera/list',
      method: 'get',
      params
    })
  },
  // 获取摄像头实时视频流
  getVideoStream (cameraId) {
    return request({
      url: `/test/jiankong/testCamera/video-stream/${cameraId}`,
      method: 'get'
    })
  }
}
