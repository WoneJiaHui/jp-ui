<template>
  <div class="camera-form">
    <video
      width="100%"
      height="100%"
      controls
      :src="cameraAddress"
      @error="handleVideoError">
      您的浏览器不支持视频播放。
    </video>
    <p>摄像头地址: {{ cameraAddress }}</p>
  </div>
</template>

<script>

export default {
  props: {
    cameraId: {
      type: String,
      required: true
    },
    cameraAddress: {
      type: String,
      default:'',
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
    console.log('接收到的摄像头地址:', this.cameraAddress);
  },
  methods: {
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