<template>
  <div class="page bg-white">
    <vxe-toolbar :refresh="{query: refreshList}" export print custom>
      <template #buttons>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="add()">新增</el-button>
        <el-button type="info" size="small" icon="el-icon-camera" @click="openLocalCamera">打开本地摄像头</el-button>
      </template>
    </vxe-toolbar>
    <div style="height: calc(100% - 80px);">
      <vxe-table
        border="inner"
        auto-resize
        resizable
        height="auto"
        :loading="loading"
        size="small"
        ref="cameraTable"
        show-header-overflow
        show-overflow
        highlight-hover-row
        :menu-config="{}"
        :print-config="{}"
        :import-config="{}"
        :export-config="{}"
        :data="dataList"
        :checkbox-config="{}">
        <vxe-column type="seq" width="40"></vxe-column>
        <vxe-column title="摄像头名称" field="name" sortable></vxe-column>
        <vxe-column title="位置" field="location" sortable></vxe-column>
        <vxe-column title="状态" field="status" sortable>
          <template slot-scope="scope">
            {{ scope.row.status === 1 ? '在线' : '离线' }}
          </template>
        </vxe-column>
        <vxe-column title="操作" width="200px" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="viewVideo(scope.row.id)" >查看视频</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button
              size="mini"
              type="text"
              @click="del(scope.row.id)" >删除</el-button>
          </template>
        </vxe-column>
      </vxe-table>
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
      <el-dialog title="摄像头视频监控" width="80%" :visible.sync="videoDialogVisible">
        <video
          width="100%"
          height="600px"
          controls
          :src="videoStreamUrl">
          您的浏览器不支持视频播放。
        </video>
      </el-dialog>

      <el-dialog title="本地摄像头监控" width="80%" :visible.sync="localCameraDialogVisible">
        <video
          width="100%"
          height="600px"
          controls
          ref="localVideo">
          您的浏览器不支持本地摄像头。
        </video>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import testCameraService from '@/api/test/jiankong/testCameraService'

export default {
  data () {
    return {
      dataList: [],
      loading: false,
      tablePage: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        orders: [{ column: 'create_date', asc: false }]
      },
      videoDialogVisible: false,
      videoStreamUrl: ''
    }
  },
  activated () {
    this.refreshList()
  },
  methods: {
    // 获取数据列表
    refreshList () {
      this.loading = true
      testCameraService.list({
        'current': this.tablePage.currentPage,
        'size': this.tablePage.pageSize,
        'orders': this.tablePage.orders
      }).then(({ data }) => {
        this.dataList = data.records
        this.tablePage.total = data.total
        this.loading = false
      })
    },
    // 新增摄像头
    add () {
      // 此处可添加新增摄像头的逻辑
    },
    // 查看视频
    viewVideo (cameraId) {
      this.videoDialogVisible = true
      testCameraService.getVideoStream(cameraId).then(({ data }) => {
        this.videoStreamUrl = data.url
      })
    },
    // 删除摄像头
    del (cameraId) {
      this.$confirm(`确定删除所选项吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        // 此处可添加删除摄像头的接口调用
        this.refreshList()
        this.loading = false
      })
    },
    // 当前页
    currentChangeHandle ({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      this.refreshList()
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
            this.$message.error('无法访问摄像头，请检查权限或设备。')
          })
      } else {
        console.error('浏览器不支持 getUserMedia')
        this.$message.error('您的浏览器不支持访问摄像头。')
      }
    }
  }
}
</script>