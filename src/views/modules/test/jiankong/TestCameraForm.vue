<template>
  <div class="camera-form">
    <video
      width="100%"
      height="100%"
      controls
      :src="videoStreamUrl"
      @error="handleVideoError"
    >
      您的浏览器不支持视频播放。
    </video>
  </div>
</template>

<script>
import testCameraService from '@/api/test/jiankong/testCameraService'

export default {
  props: {
    cameraId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      videoStreamUrl: '',
      loading: false
    }
  },
  mounted() {
    this.loadVideoStream()
  },
  methods: {
    loadVideoStream() {
      this.loading = true
      testCameraService.getVideoStream(this.cameraId)
        .then(response => {
          this.videoStreamUrl = response.data.url
          this.loading = false
        })
        .catch(error => {
          console.error('获取视频流失败:', error)
          this.loading = false
          this.$message.error('获取视频流失败，请稍后重试。')
        })
    },
    handleVideoError() {
      this.$message.error('视频播放出错，请检查摄像头或网络。')
    }
  }
}
</script>

<style scoped>
.camera-form {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

video {
  object-fit: cover;
}
</style>