<template>
  <el-dialog
    :title="title"
    :append-to-body="true"
     v-dialogDrag
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form size="small" :model="inputForm" v-loading="loading" :class="method==='view'?'readonly':''" :disabled="method==='view'" ref="inputForm" @keyup.enter.native="doSubmit()"
             label-width="120px" @submit.native.prevent>
          <el-form-item label="数据规则名称" prop="name">
              <el-input  v-model="inputForm.name" placeholder="数据规则名称"></el-input>
          </el-form-item>
          <el-form-item label="规则mapper方法" prop="className">
              <el-input  v-model="inputForm.className" placeholder="规则mapper方法"></el-input>
              <div class="help-block">请输入要进行数据权限过滤的的mapper方法（例如: com.jeeplus.xxx.xxMapper.findList)。</div>
          </el-form-item>
          <el-form-item label="规则字段" prop="field">
              <el-input  v-model="inputForm.field" placeholder="规则字段"></el-input>
          </el-form-item>
          <el-form-item label="规则条件" prop="express">
            <el-select v-model="inputForm.express" placeholder="规则条件"  style="width: 100%;">
                <el-option
                  v-for="item in $dictUtils.getDictList('t_express')"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label="规则值" prop="value">
            <el-autocomplete
              clearable
              style="width:100%"
              v-model="inputForm.value"
              :fetch-suggestions="querySearch"
              placeholder="请输入规则值"
            ></el-autocomplete>
          </el-form-item>
           <el-form-item label="自定义sql" prop="sqlSegment">
             <el-input v-model="inputForm.sqlSegment" type="textarea"
                  :rows="2" placeholder="备注"></el-input>
           </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="inputForm.remarks" type="textarea"
                  :rows="2" placeholder="备注"></el-input>
          </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false" icon="el-icon-circle-close">关闭</el-button>
      <el-button size="small" v-if="method != 'view'" type="primary" @click="doSubmit()" icon="el-icon-circle-check" v-noMoreClick>确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import dataRuleService from '@/api/sys/dataRuleService'
  export default {
    data () {
      return {
        visible: false,
        loading: false,
        method: '',
        title: '',
        inputForm: {
          id: '',
          menuId: '', // 所属菜单
          name: '', // 数据规则名称
          className: '',   // 实体类名
          field: '', // 规则字段
          express: '', // 规则条件
          value: '', // 规则值
          sqlSegment: '', // 自定义sql
          remarks: '' // 备注
        }
      }
    },
    methods: {
      init (method, obj) {
        this.method = method
        this.inputForm.id = obj.id
        this.inputForm.menuId = obj.menuId
        if (method === 'add') {
          this.title = `新增数据规则`
        } else if (method === 'edit') {
          this.title = '修改数据规则'
        } else if (method === 'view') {
          this.title = '查看数据规则'
        }
        this.visible = true
        this.$nextTick(() => {
          this.$refs['inputForm'].resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            dataRuleService.queryById(this.inputForm.id).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data)
            })
          }
        })
      },
      querySearch (queryString, cb) {
        // var restaurants = this.restaurants;
        var results = [{title: '当前登录用户姓名', value: '@currentUser.name'},
                       {title: '当前登录用户id', value: '@currentUser.id'},
                      {title: '当前登录用户登录名', value: '@currentUser.loginName'},
                      {title: '当前登录用户工号', value: '@currentUser.no'},
                      {title: '当前登录用户所属公司', value: '@currentUser.companyDTO.name'},
                       {title: '当前登录用户所属公司id', value: '@currentUser.companyDTO.id'},
                      {title: '当前登录用户所属部门', value: '@currentUser.officeDTO.name'},
                       {title: '当前登录用户所属部门id', value: '@currentUser.officeDTO.id'}
  
        ]
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            dataRuleService.save(this.inputForm).then(({data}) => {
              this.loading = false
              this.$message({
                message: data,
                type: 'success',
                duration: 1500
              })
              this.visible = false
              this.$emit('refreshDataList', this.inputForm.menuId)
            }).catch(() => {
              this.loading = false
            })
          }
        })
      }
    }
  }
</script>