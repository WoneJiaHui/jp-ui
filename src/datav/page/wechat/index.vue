<template>
  <el-dialog center
             :show-close="false"
             :close-on-press-escape="false"
             :close-on-click-modal="false"
             append-to-body
             :visible.sync="dialogVisible"
             title="人机识别"
             width="400px">
    <center>
      <span>
        扫码下方二维码，回复<b>【大屏验证码】</b><br />
        <span style="color:red">获得「验证码 + 交流群(一起摸🐟)」</span>
      </span>
      <br />
      <br />
      <img width="200"
           src="https://avuejs.com/images/icon/wechat.png" />
      <br />
      <br />
      <el-input v-model="value"
                placeholder="请输入大屏验证码"></el-input>
    </center>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary"
                   @click="submit">确 认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      value: '',
      dialogVisible: false
    }
  },
  computed: {
    isBuild () {
      return this.$route ? this.$route.name === 'build' : false;
    }
  },
  mounted () {

  },
  methods: {
    show () {
      if (!this.isBuild) {
        this.watermark({
          text: '数据大屏演示版',
          color: 'rgba(255,0,0,.4)'
        });
      }
      if (window.localStorage.getItem('avue_lock')) {
        return
      }
      this.dialogVisible = true
    },
    submit () {
      if (this.value == '') {
        this.$message.error('验证码不能为空')
        return
      } else if (this.value != 'avue') {
        this.$message.error('验证码不正确')
        return
      }
      this.dialogVisible = false
      window.localStorage.setItem('avue_lock', true)
    }
  }

}
</script>