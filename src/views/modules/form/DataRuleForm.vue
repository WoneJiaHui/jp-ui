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
          <el-form-item label="表名" prop="className">
            <el-input  v-model="inputForm.className" placeholder="表名"></el-input>
          </el-form-item>
          <el-form-item label="规则字段" prop="field">
              <el-select  v-model="inputForm.field"  style="width:100%" filterable placeholder="请选择表">
                  <el-option
                    v-for="item in dataTableColumns"
                    :key="item.name"
                    :label="item.nameAndComments"
                    :value="item.name">
                  </el-option>
            </el-select>
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
            <el-input v-model="inputForm.value" placeholder="value"></el-input>
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
  import makeFormService from '@/api/form/makeFormService'
  export default {
    data () {
      return {
        visible: false,
        loading: false,
        method: '',
        title: '',
        oldInputForm: '',
        dataTableColumns: [],
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
      init (method, row, obj) {
        this.method = method
        this.inputForm.id = obj.id
        this.inputForm.menuId = obj.menuId
        this.inputForm.className = obj.tableName
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
          this.getTableColumnList(obj.tableName, obj.dsName)
          this.$nextTick(() => {
            this.$refs.inputForm.resetFields()
            this.inputForm.id = ''
            this.oldInputForm = ''
            if (method === 'edit' || method === 'view') { // 修改或者查看
              this.oldInputForm = row
              this.inputForm = JSON.parse(JSON.stringify(row))
            }
          })
        })
      },
      getTableColumnList (name, dsName) {
        makeFormService.getTableColumnList({name: name, 'dataSource.enName': dsName || 'master'}).then(({data}) => {
          this.dataTableColumns = data.rows
        })
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.$emit('addRow', this.oldInputForm, JSON.parse(JSON.stringify(this.inputForm)))
            this.visible = false
          }
        })
      }
    }
  }
</script>