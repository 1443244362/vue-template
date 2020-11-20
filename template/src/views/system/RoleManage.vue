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
          <el-form-item label="岗位代码">
            <el-input v-model="searchForm.number" clearable></el-input>
          </el-form-item>
          <el-form-item label="岗位名称">
            <el-input v-model="searchForm.name" clearable></el-input>
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
          v-power="'Role-Add'"
          @click="add"
          >新增</el-button
        >
        <el-button
          size="mini"
          type="primary"
          plain
          v-power="'Role-Update'"
          @click="edit"
          >编辑</el-button
        >
        <el-button
          size="mini"
          type="primary"
          plain
          v-power="'Role-RelationMenu'"
          @click="RelationMenu"
          :loading="relationMenuLoading"
          >关联菜单权限</el-button
        >
        <el-button
          size="mini"
          type="primary"
          plain
          v-power="'Role-Delete'"
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
          <el-table-column
            type="selection"
            :width="tableSelectionWidth"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="number"
            label="岗位代码"
            min-width="160"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="岗位名称"
            min-width="180"
            align="center"
          >
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
      <div>
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
              class="submit"
              label-width="100px"
              inline
              ref="form"
              :model="form"
              :rules="formRules"
            >
              <el-form-item label="岗位代码" prop="number">
                <el-input v-model="form.number" clearable></el-input>
              </el-form-item>
              <el-form-item label="岗位名称" prop="name">
                <el-input v-model="form.name" clearable></el-input>
              </el-form-item>
            </el-form>
          </template>
        </collapse>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogRelationMenuVisible"
      :title="dialogRelationMenuTitle"
    >
      <div>
        <el-tree
          ref="tree"
          :data="menuDataTree"
          :props="defaultProps"
          show-checkbox
          node-key="id"
          default-expand-all
          @check="handleCheckChange"
        ></el-tree>
      </div>
      <template v-slot:footer>
        <el-button
          :size="dialogBtnSize"
          type="primary"
          @click="dialogRelationMenuVisible = false"
        >
          取消
        </el-button>
        <el-button
          :size="dialogBtnSize"
          type="primary"
          :loading="submitrelationMenuLoading"
          element-loading-spinner="el-icon-loading"
          @click="submitRelationMenu"
        >
          提交
        </el-button>
      </template>
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
  name: '',
  number: '',
  pageNum: 1,
  pageSize: 10
};
@Component
export default class List extends Vue {
  public tableHeight = tableHeight;
  public tableSelectionWidth = tableSelectionWidth;
  public actionBtnSize = actionBtnSize;
  public dialogBtnSize = dialogBtnSize;
  public searchForm = searchForm;
  public total = 0;
  public form: Role = {
    id: 0,
    name: '',
    number: ''
  };
  public formRules = {
    number: [{ required: true, message: '请输入岗位代码', trigger: 'blur' }],
    name: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }]
  };
  public selectedCount = 0;
  public selection: Role[] = [];
  public tableLoading = false;
  public submitLoading = false;
  public dialogTitle = '';
  public dialogVisible = false;
  public dialogRelationMenuTitle = '';
  public dialogRelationMenuVisible = false;
  public submitrelationMenuLoading = false;
  public relationMenuLoading = false;
  public tableData: Role[] = [];
  public menuDataTree: Menu[] = [];
  public menuCheckedData: Menu[] = [];
  public defaultProps = {
    children: 'children',
    label: 'name'
  };
  public mounted() {
    this.getList();
  }
  public search() {
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
      .roleList(searchForm)
      .then(({ data, total }) => {
        this.tableData = data;
        this.total = total;
      })
      .finally(() => {
        this.tableLoading = false;
      });
  }
  public selectionChange(selection: Role[]) {
    this.selection = JSON.parse(JSON.stringify(selection));
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
  add() {
    this.dialogTitle = '新增岗位';
    this.dialogVisible = true;
    this.$nextTick(() => {
      (this.$refs.form as any).resetFields();
    });
  }
  public edit() {
    this.dialogTitle = '编辑岗位';
    if (this.selectedCount !== 1) {
      this.$message.warning(limitOneSelectedMessage);
    }
    if (this.selectedCount === 0) {
      this.$message.warning(notSelectedMessage);
    }
    if (this.selectedCount === 1) {
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
    const form = deepClone(this.form);
    await (this.$refs.form as any).validate();
    this.submitLoading = true;
    if (this.form.id) {
      api
        .roleUpdate(form)
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
        .roleAdd(form)
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
              .roleDelete({ id: this.selection[0].id })
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
  public async RelationMenu() {
    if (this.selectedCount !== 1) {
      this.$message.warning(limitOneSelectedMessage);
    } else {
      this.relationMenuLoading = true;
      this.dialogRelationMenuTitle =
        '分配 ' + this.selection[0].name + ' 的菜单权限';
      api
        .roleMenuTree({ roleId: this.selection[0].id })
        .then(async ({ data }) => {
          this.menuDataTree = data;
          this.dialogRelationMenuVisible = true;
          this.$nextTick(() => {
            this.findCheckedData(data, []);
          });
        })
        .finally(() => {
          this.relationMenuLoading = false;
        });
    }
  }
  public handleCheckChange(data, tree) {
    this.menuCheckedData = [];
    this.menuCheckedData.push(...tree.checkedKeys, ...tree.halfCheckedKeys);
  }
  public findCheckedData(data, arr) {
    data.forEach(item => {
      if (item.children && item.children.length !== 0) {
        this.findCheckedData(item.children, arr);
      } else if (item.checked === true) {
        arr.push(item.id);
      } else {
        return false;
      }
      (this.$refs.tree as any).setCheckedKeys(arr);
    });
  }
  public submitRelationMenu() {
    this.submitrelationMenuLoading = true;
    const menuIds: any[] = [];
    this.menuCheckedData.forEach(item => {
      menuIds.push(item);
    });
    api
      .roleRelationMenu({
        id: this.selection[0].id,
        menuIds: menuIds.toString()
      })
      .then(() => {
        this.$message.success('岗位关联菜单成功');
        this.dialogRelationMenuVisible = false;
        this.getList();
      })
      .finally(() => {
        this.submitrelationMenuLoading = false;
      });
  }

  // 岗位关联部门
}
</script>

<style scoped lang="scss"></style>
