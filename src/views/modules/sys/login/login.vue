<template>

  <div class="login-container">
 

    <div class="login-weaper animated bounceInDown" style="z-index:100">
      <div class="login-left">
                <div class="login-time">
          {{time}}
        </div>
        <p class="title">{{productName}}</p>

        <el-image src="/static/img/login.png">
    </el-image>

        
      </div>
      <div class="login-border">
        <div class="login-main">
              
          <h4 class="login-title">
           登录
          </h4>
          <h3 class="login-sub-title">
            请使用账号密码登录
          </h3> 
            <el-form size="small" ref="inputForm" :model="inputForm" :rules="rules" class="login-form"  @keyup.enter.native="login()" @submit.native.prevent>
       
              <el-form-item  prop="username">
                <el-input type="text" placeholder="请输入账号" v-model="inputForm.username">
                   <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input type="password" placeholder="请输入密码" v-model="inputForm.password">
                   <i slot="prefix" class="el-input__icon el-icon-female"></i>
                </el-input>
              </el-form-item>
              <el-form-item>
                 <el-row :gutter="10">
                   <el-col :span="8"><el-image @click="getCaptcha" :src="captchaImg" style="height:34px"></el-image></el-col>
                   <el-col :span="16">
                      <el-form-item prop="code">
                      <el-input placeholder="请输入验证码" v-model="inputForm.code"></el-input>
                      </el-form-item>
                  </el-col>
                 </el-row>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="loading" class="login-submit" @click="login">登录</el-button>
              </el-form-item>
              <el-form-item>
              <div class="btn-block">
               
                <el-image class="mobile" src="/static/img/mobile.png"></el-image>
                  <span class="demonstration">H5</span>
              </div>
                  <div class="btn-block">
               
                <el-image class="mobile" src="/static/img/mobile.png"></el-image>
                  <span class="demonstration">Android</span>
              </div>
                  <div class="btn-block">
               
                <el-image class="mobile" src="/static/img/mobile.png"></el-image>
                 <span class="demonstration">IOS</span>
              </div>
              </el-form-item>
            </el-form>
        </div>
         <el-image class="right" src="/static/img/right.png"></el-image>

 
      </div>
    </div>
  </div>
</template>

<script>
  import configService from '@/api/sys/configService'
  import loginService from '@/api/auth/loginService'
  import userService from '@/api/sys/userService'
  export default {
    data () {
      return {
        time: '',
        logo: '',
        productName: '',
        loading: false,
        captchaImg: '',
        inputForm: {
          username: 'admin',
          password: 'admin',
          uuid: '',
          code: ''
        },
        rules: {
          username: [
            {required: true, message: '帐号不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '验证码不能为空', trigger: 'blur'}
          ]
        },
        captchaPath: ''
      }
    },
    created () {
      this.getTime()
      setInterval(() => {
        this.getTime()
      }, 1000)
    },
    mounted () {
      configService.getConfig().then(({data}) => {
        this.productName = data.productName
      })
      this.getCaptcha()
    },
    methods: {
      // 提交表单
      login () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            loginService.login(this.inputForm).then(({data}) => {
              this.$cookie.set('token', data.token)
              userService.getMenus().then(({data}) => {
                localStorage.setItem('routerList', JSON.stringify(data.routerList || '[]'))
                localStorage.setItem('allMenuList', JSON.stringify(data.menuList || '[]'))
                localStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'))
                localStorage.setItem('dictList', JSON.stringify(data.dictList || '[]'))
                this.$router.push({name: 'home'})
              })
              this.$notify({
                title: '登录成功',
                message: `欢迎回来！<br/>你上次的登录IP是 ${data.oldLoginIp}，登录时间是 ${data.oldLoginDate}。`,
                dangerouslyUseHTMLString: true,
                duration: 10000,
                type: 'success'
              })
            }).catch(e => {
              this.loading = false
              this.getCaptcha()
            })
          }
        })
      },
      getTime () {
        this.time = this.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      },
      // 获取验证码
      getCaptcha () {
        loginService.getCode().then(({data}) => {
          this.captchaImg = 'data:image/gif;base64,' + data.codeImg
          this.inputForm.uuid = data.uuid
        })
      }
    }
  }
</script>

<style lang="scss">
@import '~@/assets/scss/login.scss';
</style>