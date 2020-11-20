<template>
  <div>
    <collapse name="查询">
      <template v-slot:btn>
        <el-button type="primary" :size="actionBtnSize" @click="reset"
          >重置</el-button
        >
        <el-button type="primary" :size="actionBtnSize" @click="getList"
          >查询</el-button
        >
      </template>
      <template v-slot:data>
        <el-form label-width="100px">
          <el-form-item label="工号">
            <el-input v-model="searchForm.loginName" clearable></el-input>
          </el-form-item>
          <el-form-item label="员工姓名">
            <el-input v-model="searchForm.empName" clearable></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <code-select v-model="searchForm.status" code="EMPLOYEE_STATUS">
            </code-select>
          </el-form-item>
        </el-form>
      </template>
    </collapse>
    <collapse name="数据区" :statistics="true">
      <template v-slot:statistics
        ><img src="../../assets/img/i.png" alt="" class="statistics-img" />

        <div class="msg">已选择{{ selectedCount }}项</div>
        <el-button type="text" @click="clearSelection">
          清空
        </el-button>
      </template>
      <template v-slot:btn>
        <el-button
          size="mini"
          type="primary"
          plain
          v-power="'User-Add'"
          @click="add"
          >新增</el-button
        >
        <el-button
          size="mini"
          type="primary"
          plain
          v-power="'User-Update'"
          @click="edit"
          >编辑</el-button
        >
        <el-button
          size="mini"
          type="primary"
          plain
          v-power="'User-Delete'"
          @click="del"
          >删除</el-button
        >
      </template>
      <template v-slot:data>
        <el-table
          border
          highlightCurrentRow
          stripe
          ref="table"
          @selection-change="selectionChange"
          :height="tableHeight"
          :data="tableData"
          v-loading="tableLoading"
          element-loading-text="加载中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <el-table-column type="selection" :width="tableSelectionWidth">
          </el-table-column>
          <el-table-column prop="name" label="昵称" min-width="160">
          </el-table-column>
          <el-table-column prop="account" label="账号" min-width="150">
          </el-table-column>
          <el-table-column label="性别" min-width="100">
            <template v-slot="{ row }">
              <code-show :value="row.sex" code="USER_SEX"> </code-show>
            </template>
          </el-table-column>
          <el-table-column prop="roleName" label="角色" min-width="150">
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page="searchForm.pageNum"
          :page-size="searchForm.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </template>
    </collapse>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle">
      <collapse name="信息">
        <template v-slot:btn>
          <el-button
            :size="dialogBtnSize"
            type="primary"
            v-loading="submitLoading"
            element-loading-spinner="el-icon-loading"
            @click="submit"
          >
            确定
          </el-button>
        </template>
        <template v-slot:data>
          <el-form
            class="submit"
            :model="form"
            :rules="formRules"
            ref="form"
            label-width="100px"
          >
            <el-form-item label="昵称" prop="name">
              <el-input v-model="form.name" clearable></el-input>
            </el-form-item>
            <el-form-item label="账号" prop="account">
              <el-input v-model="form.account" clearable></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                type="password"
                v-model="form.password"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <code-select v-model="form.sex" code="USER_SEX"> </code-select>
            </el-form-item>
            <el-form-item label="角色" prop="roleId">
              <role-select
                :roleId.sync="form.roleId"
                :roleName.sync="form.roleName"
              >
              </role-select>
            </el-form-item>
          </el-form>
        </template>
      </collapse>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {
  tableHeight,
  tableSelectionWidth,
  limitOneSelectedMessage,
  actionBtnSize,
  dialogBtnSize,
  confirmDeleteMessage
} from '@/config/env';
import api from '@/api';
import { deepClone } from '@/libs/utils';

const searchForm = {
  name: '',
  roleId: '',
  pageNum: 1,
  pageSize: 10
};
const searchPostForm = {};
@Component
export default class UserManage extends Vue {
  public tableHeight = tableHeight;
  public tableSelectionWidth = tableSelectionWidth;
  public actionBtnSize = actionBtnSize;
  public dialogBtnSize = dialogBtnSize;
  public searchForm = searchForm;
  public total = 0;
  public totalPost = 0;
  // public tablePostData: PostObjTableObj[] = [];
  public tablePostLoading = false;
  public tableLoading = false;
  public postRelationLoading = false;
  public tableData: User[] = [];
  public dialogTitle = '';
  public dialogVisible = false;
  public validatePassWord = (rule, value, callback) => {
    if (!this.form.id && value === '') {
      callback(new Error('请输入密码'));
    }
    callback();
  };

  public form: User = {
    id: 0,
    sex: '',
    name: '',
    account: '',
    roleId: '',
    roleName: '',
    password: ''
  };
  public formRules = {
    account: [{ required: true, message: '请输入帐号', trigger: 'blur' }],
    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    password: [{ validator: this.validatePassWord, trigger: 'blur' }],
    sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
    roleId: [{ required: true, message: '请选择角色', trigger: 'change' }]
  };
  public selection: User[] = [];
  public selectedCount = 0;
  public selectionPost: User[] = [];
  public selectedCountPost = 0;
  public submitLoading = false;

  public dialogPostTitle = '关联岗位';
  public dialogPostVisible = false;
  public postForm = searchPostForm;
  public submitPostLoading = false;

  public totalAddPost = 0;
  // public tableAddPostData: PostObjTableObj[] = [];
  public tableAddPostLoading = false;
  public postAddForm = searchPostForm;
  public dialogAddPostVisible = false;
  public submitAddPostLoading = false;
  public selectionAddPost: User[] = [];
  public selectedCountAddPost = 0;

  public mounted() {
    this.getList();
  }
  search() {
    this.getList();
  }
  public reset() {
    this.searchForm = deepClone(searchForm);
  }
  public clearSelection() {
    (this.$refs.table as any).clearSelection();
  }
  public async getList() {
    this.tableLoading = true;
    api
      .userList(this.searchForm)
      .then(async ({ data, total }) => {
        this.tableData = data;
        this.total = total;
      })
      .finally(() => {
        this.tableLoading = false;
      });
  }
  public selectionChange(selection: User[]) {
    this.selection = deepClone(selection);
    this.selectedCount = selection.length;
  }
  public sizeChange(val: number) {
    this.searchForm.pageSize = val;
    this.getList();
  }
  public currentChange(val: number) {
    this.searchForm.pageNum = val;
    this.getList();
  }
  public add() {
    this.dialogTitle = '新增员工';
    this.dialogVisible = true;
    this.$nextTick(() => {
      (this.$refs.form as any).resetFields();
    });
  }
  public async edit() {
    this.dialogTitle = '编辑员工';
    if (this.selectedCount !== 1) {
      this.$message.warning(limitOneSelectedMessage);
    } else {
      this.dialogVisible = true;
      this.$nextTick(() => {
        (this.$refs.form as any).clearValidate();
        const val = this.selection[0];
        for (const key in this.form) {
          this.form[key] = val[key];
        }
      });
    }
  }
  public async submit() {
    await (this.$refs.form as any).validate();
    this.submitLoading = true;
    const form = deepClone(this.form);
    if (this.form.id) {
      api
        .userUpdate(form)
        .then(() => {
          this.$message.success('编辑成功');
          this.dialogVisible = false;
          this.getList();
        })
        .finally(() => {
          this.submitLoading = false;
        });
    } else {
      api
        .userAdd(form)
        .then(() => {
          this.$message.success('新增成功');
          this.dialogVisible = false;
          this.getList();
        })
        .finally(() => {
          this.submitLoading = false;
        });
    }
  }
  public del() {
    if (this.selectedCount !== 1) {
      // notSelectedMessage
      this.$message.warning(limitOneSelectedMessage);
    } else {
      const h = this.$createElement;
      this.$msgbox({
        title: '提示',
        message: h('p', undefined, [
          h('span', undefined, confirmDeleteMessage)
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            api
              .userDelete({ id: this.selection[0].id })
              .then(() => {
                this.getList();
                this.$message.success('删除成功');
                done();
              })
              .finally(() => {
                instance.confirmButtonLoading = false;
              });
          } else {
            done();
          }
        }
      });
    }
  }
}
</script>

<style scoped lang="scss"></style>
