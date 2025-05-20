<template>
  <div class="page bg-white">
    <vxe-toolbar :refresh="{ query: refreshList }" export print custom>
      <template #buttons>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="add()">新增</el-button>
      </template>
    </vxe-toolbar>
    <!-- 添加一个具有固定高度和滚动属性的容器 -->
    <div class="scroll-container">
      <div class="grid-container">
        <TestCameraForm
          v-for="(camera, index) in dataList.slice(0, 9)"
          :key="index"
          :cameraId="camera.id"
        />
      </div>
    </div>
    <vxe-pager
      background
      size="small"
      :current-page="tablePage.currentPage"
      :page-size="tablePage.pageSize"
      :total="tablePage.total"
      :page-sizes="[10, 20, 100, 1000, { label: '全量数据', value: 1000000 }]"
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
      @page-change="currentChangeHandle"
    />
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
        current: this.tablePage.currentPage,
        size: this.tablePage.pageSize,
        orders: this.tablePage.orders
      })
        .then(({ data }) => {
          this.dataList = data.records
          this.tablePage.total = data.total
          this.loading = false
        })
        .catch(error => {
          console.error('获取摄像头列表失败:', error)
          this.loading = false
          this.$message.error('获取摄像头列表失败，请稍后重试。')
        })
    },
    // 新增摄像头
    add() {
      // 此处可添加新增摄像头的逻辑
    },
    // 当前页
    currentChangeHandle({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      this.refreshList()
<<<<<<< HEAD
=======
    },

     // 打开本地摄像头
    openLocalCamera () {
      this.localCameraDialogVisible = true
      this.startLocalCamera()
    },
    // 启动本地摄像头
    startLocalCamera () {
      this.localVideoRef = this.$refs.localVideo
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then((stream) => {
            if ('srcObject' in this.localVideoRef) {
              this.localVideoRef.srcObject = stream
            } else {
              this.localVideoRef.src = window.URL.createObjectURL(stream)
            }
            this.localVideoRef.play()
          })
          .catch((error) => {
            console.error('无法访问摄像头:', error)
            if (error.name === 'NotAllowedError') {
              this.$message.error('您拒绝了摄像头访问权限，请重新允许。')
            } else if (error.name === 'NotFoundError') {
              this.$message.error('未检测到摄像头设备，请检查连接。')
            } else {
              this.$message.error('无法访问摄像头，请检查权限或设备。')
            }
          })
      } else {
        console.error('浏览器不支持 getUserMedia')
        this.$message.error('您的浏览器不支持访问摄像头。')
      }
>>>>>>> 6d2c2943b5d51404ec623e7283c67757b9b01ac0
    }
  }
}
</script>
<<<<<<< HEAD

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1px;
  margin-bottom: 5px;
}

/* 添加滚动容器的样式 */
.scroll-container {
  height: 450px; /* 设置固定高度 */
  overflow-y: auto; /* 添加垂直滚动条 */
  margin-bottom: 5px;
}
</style>
=======
>>>>>>> 6d2c2943b5d51404ec623e7283c67757b9b01ac0
