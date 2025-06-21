<template>
  <div class="page">
    <!-- 搜索表单 -->
    <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
      <el-form-item>
        <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
        <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 工具栏 -->
    <div class="bg-white top">
      <vxe-toolbar :refresh="{query: refreshList}" import export print custom>
        <template #buttons>
          <el-button v-if="hasPermission('test:jiankong:testCamera:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
          <el-button v-if="hasPermission('test:jiankong:testCamera:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()" :disabled="$refs.testCameraTable && $refs.testCameraTable.getCheckboxRecords().length !== 1" plain>修改</el-button>
          <el-button v-if="hasPermission('test:jiankong:testCamera:del')" type="danger" size="small" icon="el-icon-delete" @click="del()" :disabled="$refs.testCameraTable && $refs.testCameraTable.getCheckboxRecords().length === 0" plain>删除</el-button>
        </template>
        <template #tools>
          <vxe-button
            type="default"
            title="下载导入模板"
            v-if="hasPermission('test:jiankong:testCamera:import')"
            class="el-icon-document m-r-12"
            @click="downloadTpl()"
            circle
          >
          </vxe-button>
        </template>
      </vxe-toolbar>
        <div class="grid-container">
          <div v-for="(camera, index) in dataList.slice(0, 2)" :key="index">
            <video
              width="100%"
              height="100%"
              controls
              :src="camera.address"
              @error="handleVideoError">
              您的浏览器不支持视频播放。
            </video>
            <p>摄像头地址: {{ camera.address }}</p>
          </div>
        </div>
        <!-- 分页 -->
        <vxe-pager
          background
          size="small"
          :current-page="tablePage.currentPage"
          :page-size="tablePage.pageSize"
          :total="tablePage.total"
          :page-sizes="[10, 20, 100, 1000, {label: '全量数据', value: 1000000}]"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
          @page-change="currentChangeHandle"
        ></vxe-pager>
      </div>
    <!-- 弹窗，新增 / 修改 -->
    <TestCameraForm ref="testCameraForm" @refreshDataList="refreshList"></TestCameraForm>
  </div>
</template>

<script>
import TestCameraForm from './TestCameraForm.vue'
import testCameraService from '@/api/test/jiankong/testCameraService'

export default {
  components: {
    TestCameraForm
  },
  data() {
    return {
      searchForm: {},
      dataList: [],
      tablePage: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        orders: [{ column: 'create_date', asc: false }]
      },
      loading: false
    }
  },
  activated() {
    this.refreshList()
  },
  methods: {
    // 获取数据列表
    refreshList() {
      this.loading = true
      testCameraService.list({
        'current': this.tablePage.currentPage,
        'size': this.tablePage.pageSize,
        'orders': this.tablePage.orders,
        ...this.searchForm
      }).then(({ data }) => {
        this.dataList = data.records
        this.tablePage.total = data.total
        this.loading = false
      }).catch(error => {
        console.error('获取摄像头列表失败:', error)
        this.loading = false
        this.$message.error('获取摄像头列表失败，请稍后重试。')
      })
    },
    // 当前页
    currentChangeHandle({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      this.refreshList()
    },
    // 排序
    sortChangeHandle(obj) {
      this.tablePage.orders = []
      if (obj.order != null) {
        this.tablePage.orders = [{ column: obj.column.sortBy || this.$utils.toLine(obj.property), asc: obj.order === 'asc' }]
      } else {
        this.tablePage.orders = [{ column: 'create_date', asc: false }]
      }
      this.refreshList()
    },
    // 新增
    add() {
      this.$refs.testCameraForm.init('add', '')
    },
    // 修改
    edit(id) {
      id = id || this.$refs.testCameraTable.getCheckboxRecords().map(item => {
        return item.id
      })[0]
      this.$refs.testCameraForm.init('edit', id)
    },
    // 查看
    view(id) {
      this.$refs.testCameraForm.init('view', id)
    },
    // 删除
    del(id) {
      let ids = id || this.$refs.testCameraTable.getCheckboxRecords().map(item => {
        return item.id
      }).join(',')
      this.$confirm(`确定删除所选项吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        testCameraService.delete(ids).then(({ data }) => {
          this.$message.success(data)
          this.refreshList()
          this.loading = false
        })
      })
    },
    // 下载模板
    downloadTpl() {
      this.loading = true
      testCameraService.exportTemplate().then(({ data }) => {
        // 将二进制流文件写入excel表，以下为重要步骤
        this.$utils.downloadExcel(data, '摄像头管理导入模板')
        this.loading = false
      }).catch(function (err) {
        this.loading = false
        if (err.response) {
          console.log(err.response)
        }
      })
    },
    // 自定义服务端导入
    importMethod({ file }) {
      // 处理表单
      const formBody = new FormData()
      formBody.append('file', file)
      this.loading = true
      testCameraService.importExcel(formBody).then(({ data }) => {
        this.$message.success({
          dangerouslyUseHTMLString: true,
          message: data
        })
        this.refreshList()
      })
    },
    // 自定义服务端导出
    exportMethod({ options }) {
      // 传给服务端的参数
      const params = {
        current: this.tablePage.currentPage,
        size: this.tablePage.pageSize,
        orders: this.tablePage.orders,
        ...this.searchForm,
        filename: options.filename,
        sheetName: options.sheetName,
        isHeader: options.isHeader,
        original: options.original,
        mode: options.mode,
        selectIds: options.mode === 'selected' ? options.data.map((item) => item.id) : [],
        exportFields: options.columns.map((column) => column.property && column.property.split('.')[0])
      }
      this.loading = true
      return testCameraService.exportExcel(params).then(({ data }) => {
        // 将二进制流文件写入excel表，以下为重要步骤
        this.$utils.downloadExcel(data, options.filename)
        this.loading = false
      }).catch(function (err) {
        if (err.response) {
          console.log(err.response)
        }
      })
    },
    resetSearch() {
      this.$refs.searchForm.resetFields()
      this.refreshList()
    }
  }
}
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 5px;
  margin-bottom: 100px;
}
video {
  object-fit: cover;
}
</style>