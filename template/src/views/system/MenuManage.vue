<template>
  <div>
    <collapse name="数据区" statistics>
      <template v-slot:statistics
        ><img src="@/assets/img/i.png" alt="" class="statistics-img" />
        <div class="msg">已选择{{ selectedCount }}项</div>
        <el-button type="text" @click="clearSelection">
          清空
        </el-button>
      </template>
      <template v-slot:btn>
        <el-button :size="actionBtnSize" type="primary" @click="getList"
          >查询</el-button
        >

        <el-button
          :size="actionBtnSize"
          type="primary"
          plain
          @click="add"
          v-power="'Menu-Add'"
          >新增</el-button
        >
        <el-button
          :size="actionBtnSize"
          type="primary"
          plain
          v-power="'Menu-Update'"
          @click="edit"
          >编辑</el-button
        >
        <el-button
          :size="actionBtnSize"
          type="primary"
          plain
          v-power="'Menu-Delete'"
          @click="del"
          >删除</el-button
        >
      </template>
      <template v-slot:data>
        <el-table
          border
          highlightCurrentRow
          stripe
          :height="tableHeight"
          :data="menuList"
          v-loading="tableLoading"
          element-loading-text="加载中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          @selection-change="selectionChange"
          row-key="id"
          ref="table"
        >
          <el-table-column
            type="selection"
            :width="tableSelectionWidth"
          ></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="menuUrl" label="路由"></el-table-column>
          <el-table-column prop="filePath" label="文件路径"></el-table-column>
          <el-table-column label="是否显示">
            <template v-slot="{ row }">
              <code-show :value="row.isVisible" code="MENU_IS_VISIBLE">
              </code-show>
            </template>
          </el-table-column>
          <el-table-column label="菜单类型">
            <template v-slot="{ row }">
              <code-show :value="row.type" code="MENU_Type"> </code-show>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </collapse>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle">
      <collapse name="信息">
        <template v-slot:btn>
          <el-button
            :size="dialogBtnSize"
            type="primary"
            :loading="submitLoading"
            element-loading-spinner="el-icon-loading"
            @click="submit"
          >
            确定
          </el-button>
        </template>
        <template v-slot:data>
          <el-form
            :model="form"
            :rules="formRules"
            ref="form"
            label-width="100px"
          >
            <el-form-item prop="name" label="名称">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item prop="menuUrl" label="路由">
              <el-input v-model="form.menuUrl"></el-input>
            </el-form-item>
            <el-form-item prop="filePath" label="文件路径">
              <el-input v-model="form.filePath"></el-input>
            </el-form-item>
            <el-form-item prop="isVisible" label="是否显示">
              <code-select
                v-model="form.isVisible"
                code="MENU_IS_VISIBLE"
              ></code-select>
            </el-form-item>
            <el-form-item prop="sort" label="排序值">
              <el-input v-model="form.sort"></el-input>
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
  notSelectedMessage,
  confirmDeleteMessage
} from '@/config/env';
import api from '@/api';
import { deepClone } from '@/libs/utils';
const searchForm = {
  test: ''
};
@Component
export default class MenuManage extends Vue {
  public tableHeight = tableHeight;
  public tableSelectionWidth = tableSelectionWidth;
  public actionBtnSize = actionBtnSize;
  public dialogBtnSize = dialogBtnSize;
  public searchForm = searchForm;
  public menuList: Menu[] = [];
  public dialogVisible = false;
  public dialogTitle = '';
  public form: Menu = {
    id: 0,
    parentId: 0,
    name: '',
    menuUrl: '',
    filePath: '',
    type: '',
    sort: 0,
    isVisible: '1'
  };
  public formRules = {
    name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
    type: [{ required: true, message: '请选择类型', trigger: 'change' }]
  };
  public selection: Menu[] = [];
  public selectedCount = 0;
  public tableLoading = false;
  public submitLoading = false;
  public deleteLoading = false;
  public mounted() {
    this.getList();
  }
  public reset() {
    this.searchForm = deepClone(searchForm);
  }
  public async getList() {
    // async function getCodeValueForArray(data: MenuObj[]) {
    //   for (const item of data) {
    //     item.isVisibleValue = await getCodeValue(
    //       'MENU_IS_VISIBLE',
    //       item.isVisible
    //     );
    //     item.typeValue = await getCodeValue('MENU_TYPE', item.type);
    //     if (item.children) {
    //       getCodeValueForArray(item.children);
    //     }
    //   }
    // }
    this.tableLoading = true;
    api
      .menuList()
      .then(async ({ data }) => {
        // await getCodeValueForArray(data);
        this.menuList = data;
      })
      .finally(() => {
        this.tableLoading = false;
      });
  }
  public add() {
    this.dialogTitle = '新增菜单';
    if (this.selectedCount !== 1) {
      this.$message.warning(limitOneSelectedMessage);
    } else {
      this.dialogVisible = true;
      this.$nextTick(() => {
        (this.$refs.form as any).resetFields();
        this.form.type = Number(this.selection[0].type) + 1 + '';
        this.form.parentId = this.selection[0].id;
        this.form.id = 0;
      });
    }
  }
  public edit() {
    this.dialogTitle = '编辑菜单';
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
    if (this.form.id) {
      api
        .menuUpdate(this.form)
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
        .menuAdd(this.form)
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
    if (this.selectedCount === 0) {
      this.$message.warning(notSelectedMessage);
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
              .menuDelete({ id: this.selection[0].id })
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
  public selectionChange(selection: Menu[]) {
    this.selection = deepClone(selection);
    this.selectedCount = selection.length;
  }
  public clearSelection() {
    (this.$refs.table as any).clearSelection();
  }
}
</script>

<style scoped></style>
