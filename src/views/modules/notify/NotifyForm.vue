<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    append-to-body
     v-dialogDrag
    :visible.sync="visible">
    <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading" :class="method==='view' || method === 'read'?'readonly':''" :disabled="method==='view' || method === 'read'" @keyup.enter.native="doSubmit()"
             label-width="120px" @submit.native.prevent>
      <el-row  :gutter="15">
        <el-col :span="24">
            <el-form-item label="类型" prop="type"
                :rules="[
                  {required: true, message:'类型不能为空', trigger:'blur'}
                 ]">
		            <el-select v-model="inputForm.type" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('oa_notify_type')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
	         </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="标题" prop="title"
                :rules="[
                  {required: true, message:'标题不能为空', trigger:'blur'}
                 ]">
			        <el-input v-model="inputForm.title" placeholder="请填写标题"     ></el-input>
	         </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="内容" prop="content"
                :rules="[
                  {required: true, message:'内容不能为空', trigger:'blur'}
                 ]">
					<el-input type="textarea"   :rows="8" v-model="inputForm.content" placeholder="请填写内容"     ></el-input>
	         </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="附件" prop="files">
              <file-upload
								v-model="inputForm.files"
								:limit="3"
								tip="最多上传3个文件,单个文件不要超过10M,请上传xlsx/docx格式文件"
							>
								<el-button type="primary" icon="el-icon-upload"
									>上传附件</el-button
								>
							</file-upload>
	         </el-form-item>
        </el-col>
        <el-col :span="24"  v-if="method !== 'read'">
            <el-form-item label="状态" prop="status"
                :rules="[
                  {required: true, message:'状态不能为空', trigger:'blur'}
                 ]">
                    <el-radio-group v-model="inputForm.status">
                        <el-radio v-for="item in $dictUtils.getDictList('oa_notify_status')" :label="item.value" :key="item.id">{{item.label}}</el-radio>
                    </el-radio-group>
	         </el-form-item>
        </el-col>
        <el-col :span="24">
           <el-form-item label="接收人" prop="notifyRecordIds"
                :rules="[
                  {required: true, message:'接收人不能为空', trigger:'blur'}
                 ]">
          		            <user-select  :value="inputForm.notifyRecordIds" @getValue='(value) => {inputForm.notifyRecordIds=value}'></user-select>
           </el-form-item>
        </el-col>
      <el-col :span="24" v-if="method ==='view' && inputForm.status === '1'">
           <el-form-item label="接收人">
              <el-table
                 size="small"
                :data="notifyRecordDTOList"
                style="width: 100%">
                <el-table-column
                  prop="userDTO.name"
                  label="接收人"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="userDTO.officeDTO.name"
                  label="接收部门"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="readFlag"
                  label="阅读状态">
                  <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.readFlag === '1'"> {{ $dictUtils.getDictLabel("oa_notify_read", scope.row.readFlag, '-') }}</el-tag>
                    <el-tag type="danger" v-if="scope.row.readFlag === '0'"> {{ $dictUtils.getDictLabel("oa_notify_read", scope.row.readFlag, '-') }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="readDate"
                  label="阅读时间"
                  width="180">
                </el-table-column>
              </el-table>
           </el-form-item>
      </el-col>
        </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false" icon="el-icon-circle-close">关闭</el-button>
      <el-button size="small" type="primary" v-if="method != 'view' && method != 'read'" @click="doSubmit()" icon="el-icon-circle-check" v-noMoreClick>确定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
  import UserSelect from '@/components/userSelect'
  import notifyService from '@/api/notify/notifyService'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        notifyRecordDTOList: [],
        inputForm: {
          id: '',
          type: '',
          title: '',
          content: '',
          files: '',
          status: '',
          notifyRecordIds: ''
        }
      }
    },
    components: {
      UserSelect
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建通知`
        } else if (method === 'edit') {
          this.title = '修改通知'
        } else if (method === 'view') {
          this.title = '查看通知'
        } else if (method === 'read') {
          this.title = '阅读通知'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view' || method === 'read') { // 修改或者查看
            this.loading = true
            notifyService.query({
              id: this.inputForm.id,
              isSelf: method === 'read'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data)
              this.notifyRecordDTOList = data.notifyRecordDTOList
              if (method === 'read') {
                this.$emit('refreshDataList')
              }
              this.loading = false
            })
          }
        })
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            notifyService.save(this.inputForm).then(({data}) => {
              this.loading = false
              this.visible = false
              this.$message.success(data)
              this.$emit('refreshDataList')
            }).catch(() => {
              this.loading = false
            })
          }
        })
      }
    }
  }
</script>