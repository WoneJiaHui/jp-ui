<!--
 * @Descripttion: 图像裁剪组件
-->

<template>
	<div class="jp-cropper">
		<div class="jp-cropper__img">
			<img :src="src" ref="img" />
		</div>
		<div class="jp-cropper__preview">
			<h4>图像预览</h4>
			<div class="jp-cropper__preview__img" ref="preview"></div>
		</div>
	</div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

export default {
  props: {
    src: { type: String, default: '' },
    compress: { type: Number, default: 1 },
    aspectRatio: { type: Number, default: NaN }
  },
  data () {
    return {
      crop: null
    }
  },
  watch: {
    aspectRatio (val) {
      this.crop.setAspectRatio(val)
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.crop = new Cropper(this.$refs.img, {
        viewMode: 2,
        dragMode: 'move',
        responsive: false,
        aspectRatio: this.aspectRatio,
        preview: this.$refs.preview
      })
    },
    setAspectRatio (aspectRatio) {
      this.crop.setAspectRatio(aspectRatio)
    },
    getCropData (cb, type = 'image/jpeg') {
      cb(this.crop.getCroppedCanvas().toDataURL(type, this.compress))
    },
    getCropBlob (cb, type = 'image/jpeg') {
      this.crop.getCroppedCanvas().toBlob((blob) => { cb(blob) }, type, this.compress)
    },
    getCropFile (cb, fileName = 'fileName.jpg', type = 'image/jpeg') {
      this.crop.getCroppedCanvas().toBlob((blob) => {
        let file = new File([blob], fileName, { type: type })
        cb(file)
      }, type, this.compress)
    }
  }
}
</script>

<style scoped>
.jp-cropper {
	height: 300px;
}
.jp-cropper__img {
	height: 100%;
	width: 400px;
	float: left;
	background: #ebeef5;
}
.jp-cropper__img img {
	display: none;
}
.jp-cropper__preview {
	width: 120px;
	margin-left: 20px;
	float: left;
}
.jp-cropper__preview h4 {
	font-weight: normal;
	font-size: 12px;
	color: #999;
	margin-bottom: 20px;
}
.jp-cropper__preview__img {
	overflow: hidden;
	width: 120px;
	height: 120px;
	border: 1px solid #ebeef5;
}
</style>
