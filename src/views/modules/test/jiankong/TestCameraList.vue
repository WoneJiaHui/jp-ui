<template>
  <div class="page bg-white">
    <vxe-toolbar :refresh="{query: refreshList}" export print custom>
      <template #buttons>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="add()">新增</el-button>
      </template>
    </vxe-toolbar>
    <div class="grid-container">
      <TestCameraForm
        v-for="(camera, index) in dataList.slice(0, 2)"
        :key="index"
        :cameraId="camera.id"
        :cameraAddress="camera.address">
      </TestCameraForm>
    </div>
    <vxe-pager
      background
      size="small"
      :current-page="tablePage.currentPage"
      :page-size="tablePage.pageSize"
      :total="tablePage.total"
      :page-sizes="[10, 20, 100, 1000, {label: '全量数据', value: 1000000}]"
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
      @page-change="currentChangeHandle">
    </vxe-pager>
  </div>
</template>

<script>
import testCameraService from '@/api/test/jiankong/testCameraService'
import TestCameraForm from './TestCameraForm.vue'


export default {
  components: {
    TestCameraForm
  },
  data() {
    return {
      dataList: [],
      loading: false,
      tablePage: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        orders: [{ column: 'create_date', asc: false }]
      }
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
        'orders': this.tablePage.orders
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
    // 新增摄像头
    add() {
      this.$refs.testCameraAdd.init();
    },
    // 当前页
    currentChangeHandle({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
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
</style>