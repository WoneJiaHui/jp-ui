<template>
  <div>
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
              <el-input v-model="inputForm.id" placeholder="自动生成编号" disabled></el-input>
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
              <el-input v-model="inputForm.name" placeholder="请填写摄像头名称"></el-input>
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
              <el-input v-model="inputForm.address" placeholder="请填写摄像头地址"></el-input>
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
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false">关闭</el-button>
        <el-button
          size="small"
          type="primary"
          @click="doSubmit()"
          v-noMoreClick
        >
          确定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import testCameraService from '@/api/test/jiankong/testCameraService';

export default {
  data() {
    return {
      title: '新增摄像头',
      visible: false,
      loading: false,
      inputForm: {
        id: '',
        name: '',
        address: '',
        remarks: ''
      },
      cameraCount: 0
    };
  },
  methods: {
    init() {
      this.visible = true;
      this.loading = false;
      this.$nextTick(() => {
        this.$refs.inputForm.resetFields();
        this.getCameraCount();
      });
    },
    getCameraCount() {
      testCameraService.list({
        'current': 1,
        'size': 1000000
      }).then(({ data }) => {
        this.cameraCount = data.total;
        this.inputForm.id = `camera${this.cameraCount + 1}`;
      });
    },
    // 表单提交
    doSubmit() {
      this.$refs['inputForm'].validate((valid) => {
        if (valid) {
          this.loading = true;
          testCameraService.save(this.inputForm).then(({ data }) => {
            this.visible = false;
            this.$message.success(data);
            this.$emit('refreshDataList');
            this.loading = false;
          }).catch(() => {
            this.loading = false;
          });
        }
      });
    }
  }
};
</script>