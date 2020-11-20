<template>
  <div class="login">
    <div class="content">
      <div class="bg">
        <img src="@/assets/img/logo.png" class="logo" />
        <div class="text">
          专注品牌定制
        </div>
        <div class="text">
          推动废钢升级
        </div>
      </div>
      <div class="form">
        <div class="title">
          欢迎登录钢回家后台系统！
        </div>
        <el-form :model="form" :rules="formRules" label-width="0" ref="form">
          <div class="label">输入您的账号</div>
          <el-form-item prop="account">
            <el-input
              v-model="form.account"
              placeholder="输入您的账号"
              @keyup.enter.native="login"
            >
            </el-input>
          </el-form-item>
          <div class="label">输入您的密码</div>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="输入您的密码"
              @keyup.enter.native="login"
            >
            </el-input>
          </el-form-item>
          <div class="submit" @click="login">登录</div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import jsCookie from 'js-cookie';
import { Component, Vue } from 'vue-property-decorator';
import api from '@/api';
import UserModule from '@/store/modules/user';
@Component({})
export default class Login extends Vue {
  public form = {
    account: '',
    password: ''
  };
  public formRules = {
    account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
  };
  public validatePic = '';
  public async login() {
    await (this.$refs.form as any).validate();
    const { data: res } = await api.login(this.form);
    jsCookie.set('token', res.token);
    UserModule.setUser(res.user);
    this.$router.replace('/HomePage');
  }
}
</script>

<style lang="scss" scope>
.login {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: url('../assets/img/login-bg.png');
  background-size: (100% 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  .content {
    width: 1280px;
    height: 624px;
    display: flex;
    .bg {
      width: 815px;
      height: 624px;
      background-image: url('../assets/img/login-bg-child.png');
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      .logo {
        width: 130px;
        height: 40px;
        position: absolute;
        left: 34px;
        top: 30px;
      }
      .text {
        color: #ffffff;
        font-size: 38px;
      }
      .text + .text {
        margin-top: 20px;
      }
    }
    .form {
      background-color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 365px;
      .title {
        color: #32404f;
        font-size: 20px;
        margin-top: 72px;
        margin-bottom: 78px;
        font-weight: bold;
      }
      .label {
        color: #515a6e;
        font-size: 14px;
        margin-bottom: 4px;
      }
      .el-input {
        width: 295px;
        height: 40px;
        input {
          color: #515a6e;
          background-color: #eff0f4;
        }
      }
      .submit {
        width: 295px;
        height: 40px;
      }
      .submit,
      .get-validate-btn {
        background-color: #5d749b;
        font-size: 14px;
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
    }
  }
}
</style>
