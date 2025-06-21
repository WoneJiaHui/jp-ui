<template>
  <div>
    <!-- 弹窗 -->
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="visible"
    >
      <el-form
        :model="inputForm"
        size="small"
        ref="inputForm"
        v-loading="loading"
        :class="method === 'view' ? 'readonly' : ''"
        :disabled="method === 'view'"
        label-width="120px"
      >
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item
              label="摄像头编号"
              prop="id"
              :rules="[
                { required: true, message: '摄像头编号不能为空', trigger: 'blur' }
              ]"
            >
              <el-input v-model="inputForm.id" placeholder="自动生成编号" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="摄像头名称"
              prop="name"
              :rules="[
                { required: true, message: '摄像头名称不能为空', trigger: 'blur' }
              ]"
            >
              <el-input v-model="inputForm.name" placeholder="请填写摄像头名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="摄像头地址"
              prop="address"
              :rules="[
                { required: true, message: '摄像头地址不能为空', trigger: 'blur' }
              ]"
            >
              <el-input v-model="inputForm.address" placeholder="请填写摄像头地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="备注信息"
              prop="remarks"
              :rules="[
                { required: true, message: '备注信息不能为空', trigger: 'blur' }
              ]"
            >
              <el-input
                type="textarea"
                v-model="inputForm.remarks"
                placeholder="请填写备注信息"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false">关闭</el-button>
        <el-button size="small" type="primary" v-if="method !== 'view'" @click="doSubmit()" v-noMoreClick>确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import testCameraService from '@/api/test/jiankong/testCameraService'

export default {
  props: {
    cameraId: {
      type: String,
      required: false
    },
    cameraAddress: {
      type: String,
      default: '',
      required: false
    }
  },
  data() {
    return {
      title: '',
      method: '',
      visible: false,
      loading: false,
      inputForm: {
        id: '',
        name: '',
        address: '',
        remarks: ''
      },
      cameraCount: 0
    }
  },
  methods: {
    init(method, id) {
      this.method = method
      this.inputForm.id = id
      if (method === 'add') {
        this.title = `新建摄像头`
      } else if (method === 'edit') {
        this.title = '修改摄像头'
      } else if (method === 'view') {
        this.title = '查看摄像头'
      }
      this.visible = true
      this.loading = false
      this.$nextTick(() => {
        this.$refs.inputForm.resetFields()
        if (method === 'edit' || method === 'view') { // 修改或者查看
          this.loading = true
          testCameraService.queryById(this.inputForm.id).then(({ data }) => {
            this.inputForm = this.recover(this.inputForm, data)
            this.loading = false
          })
        } else if (method === 'add') {
          this.getCameraCount()
        }
      })
    },
    getCameraCount() {
      testCameraService.list({
        'current': 1,
        'size': 1000000
      }).then(({ data }) => {
        this.cameraCount = data.total
        this.inputForm.id = `camera${this.cameraCount + 1}`
      })
    },
    // 表单提交
    doSubmit() {
      this.$refs['inputForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          testCameraService.save(this.inputForm).then(({ data }) => {
            this.visible = false
            this.$message.success(data)
            this.$emit('refreshDataList')
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }
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