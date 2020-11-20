<template>
  <div class="manage">
    <div class="menu">
      <div class="logo">
        <img src="@/assets/img/logo.png" alt="" class="logo-img" />
      </div>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        background-color="#32404F"
        text-color="#A9B1C1"
        router
        active-text-color="#FFFFFF"
        unique-opened
      >
        <el-submenu
          v-for="(item, index) in menuList"
          :key="item.id"
          :index="`${index}`"
        >
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item
            :index="child.menuUrl"
            v-for="child in item.children"
            :key="child.id"
          >
            {{ child.name }}
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>

    <div class="content">
      <div class="head">
        <div class="welcomm">
          {{ userName }}，欢迎来到马钢诚兴业务信息系统！
        </div>
        <div class="action-div" @click="showUpdatePasswordDialog">
          <img src="@/assets/img/password.png" alt="" />
          修改密码
        </div>
        <div class="action-div" @click="logout">
          <img src="@/assets/img/logout.png" alt="" />
          退出登录
        </div>
      </div>
      <tab-bar></tab-bar>
      <keep-alive>
        <router-view class="child" ref="child" />
      </keep-alive>
    </div>
    <el-dialog :visible.sync="updatePasswordDialogVisible" title="跳转">
      <el-form
        :model="updatePasswordForm"
        :rules="updatePasswordFormRules"
        label-width="100px"
        ref="updatePasswordForm"
      >
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="updatePasswordForm.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="updatePasswordForm.password"></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="confirmPassword">
          <el-input v-model="updatePasswordForm.confirmPassword"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button
          :size="dialogBtnSize"
          type="primary"
          @click="updatePasswordDialogVisible = false"
        >
          取消
        </el-button>
        <el-button
          :size="dialogBtnSize"
          type="primary"
          v-loading="updatePasswordSubmitLoading"
          element-loading-spinner="el-icon-loading"
          @click="updatePasswordSubmit"
        >
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TabBar from '@/components/TabBar.vue';
import UserModule from '@/store/modules/user';
import MenuModule from '@/store/modules/menu';
import { logout } from '@/libs/utils';
import jsCookie from 'js-cookie';
import api from '@/api';
import { dialogBtnSize } from '@/config/env';
@Component({
  components: {
    TabBar,
  },
})
export default class Manage extends Vue {
  public dialogBtnSize = dialogBtnSize;
  public updatePasswordDialogVisible = false;
  public updatePasswordForm = {
    oldPassword: '',
    password: '',
    confirmPassword: '',
  };
  public updatePasswordFormRules = {
    oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
    password: [
      {
        validator: (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入新密码'));
          } else {
            if (this.updatePasswordForm.confirmPassword !== '') {
              (this.$refs.updatePasswordForm as any).validateField(
                'confirmPassword'
              );
            }
            callback();
          }
        },
        trigger: 'blur',
      },
    ],
    confirmPassword: [
      {
        validator: (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入重复密码'));
          } else {
            if (this.updatePasswordForm.password !== value) {
              callback(new Error('两次输入密码不一致!'));
            }
            callback();
          }
        },
        trigger: 'blur',
      },
    ],
  };
  public updatePasswordSubmitLoading = false;

  get userName() {
    return UserModule.name;
  }
  get menuList() {
    return MenuModule.showMenuList;
  }
  public async mounted() {
    const currentTabString = jsCookie.get('currentTab');
    if (currentTabString) {
      const currentTab: TabObj = JSON.parse(currentTabString);
      if (currentTab.name && this.$route.name !== currentTab.name) {
        this.$router.push(currentTab.fullPath);
      }
    }
  }
  public logout() {
    this.$confirm('确定退出登录？')
      .then(() => {
        logout();
        this.$message.success('退出登陆成功');
      })
      .catch(() => {
        //取消登录
      });
  }
  public showUpdatePasswordDialog() {
    this.updatePasswordDialogVisible = true;
    this.$nextTick(() => {
      (this.$refs.updatePasswordForm as any).resetFields();
    });
  }
  public async updatePasswordSubmit() {
    this.updatePasswordSubmitLoading = true;
    api
      .updatePassword(this.updatePasswordForm)
      .then(() => {
        this.$message.success('修改密码成功');
        logout();
      })
      .finally(() => {
        this.updatePasswordSubmitLoading = false;
      });
  }
}
</script>

<style lang="scss">
.manage {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  > .menu {
    display: flex;
    flex-direction: column;
    box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
    width: 220px;
    border: none;
    user-select: none;
    align-items: stretch;
    background-color: #32404f;
    .el-submenu__title {
      padding: 0 10px !important;
    }
    .logo {
      width: 220px;
      height: 70px;
      margin-top: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      .logo-img {
        width: 98px;
        height: 30px;
      }
    }
    .company {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 27px;
      color: #ffffff;
      font-size: 12px;
      .switch-img {
        width: 9px;
        height: 8px;
        margin-left: 4px;
        cursor: pointer;
      }
    }

    .el-menu {
      display: flex;
      flex-direction: column;
      flex: 1;
      border: none;
      overflow-y: auto;
    }
    .el-menu::-webkit-scrollbar {
      display: none;
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 0;
    .head {
      $head-height: 60px;
      width: 100%;
      height: $head-height;
      background: #f3f3f4;
      display: flex;
      .welcomm {
        display: flex;
        align-items: center;
        height: $head-height;
        font-size: 18px;
        font-weight: bold;
        padding-left: 16px;
        flex: 1;
      }
      .action-div {
        height: $head-height;
        width: 100px;
        color: #666666;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        user-select: none;
        img {
          width: 11px;
          height: 12px;
          margin-right: 8px;
          margin-top: 2px;
        }
      }
      .action-div:hover {
        background-color: #eeeeee;
      }
    }
    .child {
      flex: 1;
      padding: 20px;
      background: #f3f3f4;
      overflow: auto;
    }
    .copy-right {
      width: 100%;
      height: 40px;
      color: #77838f;
      font-size: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
