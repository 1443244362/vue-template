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
          <el-form-item label="值集名称">
            <el-input clearable v-model="searchForm.name"></el-input>
          </el-form-item>
          <el-form-item label="值集代码">
            <el-input clearable v-model="searchForm.code"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </collapse>
    <collapse name="数据区" statistics>
      <template v-slot:statistics
        ><img src="@/assets/img/i.png" alt="" class="statistics-img" />
        <div class="msg">已选择{{ selectedCount }}项</div>
        <el-button type="text" @click="clearSelection">
          清空
        </el-button>
      </template>
      <template v-slot:btn>
        <el-button
          type="primary"
          plain
          :size="actionBtnSize"
          v-power="'CodeManage-Add'"
          @click="add"
          >新增</el-button
        >
        <el-button
          :size="actionBtnSize"
          type="primary"
          plain
          v-power="'CodeManage-Update'"
          @click="edit"
          >编辑</el-button
        >
        <el-button
          :size="actionBtnSize"
          type="primary"
          plain
          v-power="'CodeManage-Delete'"
          @click="del"
          >删除</el-button
        >
        <el-button
          :size="actionBtnSize"
          type="primary"
          plain
          v-power="'CodeManage-AddChild'"
          @click="addChild"
          >新增子集</el-button
        >
      </template>
      <template v-slot:data>
        <el-table
          highlightCurrentRow
          stripe
          border
          :height="tableHeight"
          :data="codeList"
          v-loading="tableLoading"
          element-loading-text="加载中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          @expand-change="expandSelect"
          @selection-change="selectionChange"
          ref="table"
        >
          <el-table-column
            type="selection"
            :width="tableSelectionWidth"
          ></el-table-column>
          <el-table-column type="expand">
            <template v-slot="{ $index }">
              <el-table
                border
                :data="childList[$index]"
                v-loading="tableChildLoading"
                element-loading-text="加载中..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                @selection-change="selectionChange"
                ref="tableChild"
                class="child-table"
              >
                <!--                <el-table-column type="selection"></el-table-column>-->
                <el-table-column prop="sort" label="排序号"></el-table-column>
                <el-table-column prop="code" label="值代码"></el-table-column>
                <el-table-column prop="name" label="值名称"></el-table-column>
                <el-table-column label="操作">
                  <template v-slot="{ row }">
                    <el-button
                      :size="actionBtnSize"
                      plain
                      v-power="'CodeManage-UpdateChild'"
                      @click="editChild(row)"
                      >编辑</el-button
                    >
                    <el-button
                      :size="actionBtnSize"
                      plain
                      v-power="'CodeManage-DeleteChild'"
                      @click="delChild(row)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="code" label="值集代码"></el-table-column>
          <el-table-column prop="name" label="值集名称"></el-table-column>
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
            :model="form"
            :rules="formRules"
            ref="form"
            label-width="100px"
          >
            <el-form-item label="值集代码" prop="code">
              <el-input clearable v-model="form.code"></el-input>
            </el-form-item>
            <el-form-item label="值集名称" prop="name">
              <el-input clearable v-model="form.name"></el-input>
            </el-form-item>
          </el-form>
        </template>
      </collapse>
    </el-dialog>
    <el-dialog :visible.sync="dialogChildVisible" :title="dialogChildTitle">
      <collapse name="信息">
        <template v-slot:btn>
          <el-button
            :size="dialogBtnSize"
            type="primary"
            :loading="submitChildLoading"
            element-loading-spinner="el-icon-loading"
            @click="submitChildForm"
          >
            确定
          </el-button>
        </template>
        <template v-slot:data>
          <el-form
            :model="childForm"
            :rules="childFormRules"
            ref="childForm"
            class="submit"
            label-width="100px"
          >
            <el-form-item label="值集代码" prop="parentCode">
              <el-input clearable v-model="childForm.parentCode"></el-input>
            </el-form-item>
            <el-form-item label="值代码" prop="code">
              <el-input clearable v-model="childForm.code"></el-input>
            </el-form-item>
            <el-form-item label="值名称" prop="name">
              <el-input clearable v-model="childForm.name"></el-input>
            </el-form-item>
            <el-form-item label="排序号" prop="sort">
              <el-input clearable v-model="childForm.sort"></el-input>
            </el-form-item>
            <el-form-item label="颜色" prop="color">
              <el-color-picker v-model="childForm.color"></el-color-picker>
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
  code: '',
  pageNum: 1,
  pageSize: 10
};
@Component
export default class CodeManage extends Vue {
  public tableHeight = tableHeight;
  public tableSelectionWidth = tableSelectionWidth;
  public actionBtnSize = actionBtnSize;
  public dialogBtnSize = dialogBtnSize;
  public searchForm = searchForm;
  public codeList: Code[] = [];
  public childList: Code[][] = [];
  public tableChildLoading = false;
  public dialogVisible = false;
  public dialogChildVisible = false;
  public dialogTitle = '';
  public dialogChildTitle = '';
  public form: Code = {
    id: 0,
    code: '',
    name: ''
  };
  public formRules = {
    code: [{ required: true, message: '请输入值集代码', trigger: 'blur' }],
    name: [{ required: true, message: '请输入值集名称', trigger: 'blur' }]
  };
  public childForm: CodeChild = {
    id: 0,
    parentId: 0,
    parentCode: '',
    code: '',
    name: '',
    sort: '',
    color: '#000000'
  };
  public childFormRules = {
    parentCode: [
      { required: true, message: '请输入值集代码', trigger: 'blur' }
    ],
    code: [{ required: true, message: '请输入值代码', trigger: 'blur' }],
    name: [{ required: true, message: '请输入值名称', trigger: 'blur' }],
    sort: [{ required: true, message: '请输入排序号', trigger: 'blur' }]
  };
  public selection: CodeChild[] = [];
  public selectedCount = 0;
  public total = 0;
  public tableLoading = false;
  public submitLoading = false;
  public submitChildLoading = false;
  public deleteLoading = false;
  // mounted activated
  public mounted() {
    this.getList();
  }
  public reset() {
    this.searchForm = deepClone(searchForm);
  }
  public async getList() {
    this.tableLoading = true;
    api
      .codeList(searchForm)
      .then(({ data, total }) => {
        this.codeList = data;
        this.childList = new Array(data.length);
        this.total = total;
      })
      .finally(() => {
        this.tableLoading = false;
      });
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
    this.dialogTitle = '新增值集';
    this.dialogVisible = true;
    this.$nextTick(() => {
      (this.$refs.form as any).resetFields();
      // this.form.parentId = this.selection[0].id;
      // this.form.id = 0;
    });
  }
  public edit() {
    this.dialogTitle = '编辑值集';
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
    const form = deepClone(this.form);
    this.submitLoading = true;
    if (form.id && form.id !== 0) {
      api
        .codeUpdate(form)
        .then(() => {
          this.$message.success('编辑成功');
          this.dialogVisible = false;
          this.getList();
        })
        .finally(() => {
          this.submitLoading = false;
        });
    } else {
      Reflect.deleteProperty(form, 'id');
      api
        .codeAdd(form)
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
              .codeDelete({ id: this.selection[0].id })
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
  public selectionChange(selection: CodeChild[]) {
    this.selection = deepClone(selection);
    this.selectedCount = selection.length;
  }
  public async expandSelect(selection: CodeChild) {
    const childIndex = this.codeList.findIndex(
      item => item.id === selection.id
    );
    if (!this.childList[childIndex]) {
      await this.getChildList(childIndex, selection.code);
    }
  }
  public async getChildList(childIndex: number, parentCode: string) {
    this.tableLoading = true;
    api
      .codeChildList({
        parentCode
      })
      .then(({ data }) => {
        this.childList.splice(childIndex, 1, data);
      })
      .finally(() => {
        this.tableLoading = false;
      });
  }

  public clearSelection() {
    (this.$refs.table as any).clearSelection();
  }

  public addChild() {
    if (this.selectedCount !== 1) {
      this.$message.warning(limitOneSelectedMessage);
    } else {
      this.dialogChildTitle = '新增值集子项';
      this.dialogChildVisible = true;
      this.$nextTick(() => {
        (this.$refs.childForm as any).resetFields();
        this.childForm.id = 0;
        this.childForm.parentId = this.selection[0].id;
        this.childForm.parentCode = this.selection[0].code;
      });
    }
  }
  public editChild(selection: Code) {
    this.dialogChildTitle = '编辑值集子项';
    this.dialogChildVisible = true;
    this.$nextTick(() => {
      (this.$refs.childForm as any).clearValidate();
      const val = selection;
      for (const key in this.childForm) {
        this.childForm[key] = val[key];
      }
    });
  }
  public delChild(selection: CodeChild) {
    const h = this.$createElement;
    this.$msgbox({
      title: '提示',
      message: h('p', undefined, [h('span', undefined, confirmDeleteMessage)]),
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true;
          instance.confirmButtonText = '执行中...';
          api
            .codeDelete({ id: selection.id })
            .then(() => {
              const childIndex = this.codeList.findIndex(
                item => item.id === selection.parentId
              );
              this.getChildList(childIndex, selection.parentCode);
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
  public async submitChildForm() {
    await (this.$refs.childForm as any).validate();
    const childForm = deepClone(this.childForm);
    this.submitChildLoading = true;
    if (childForm.id && childForm.id !== 0) {
      api
        .codeChildUpdate(childForm)
        .then(() => {
          this.$message.success('编辑成功');
          this.dialogChildVisible = false;
          const childIndex = this.codeList.findIndex(
            item => item.id === childForm.parentId
          );
          this.getChildList(childIndex, childForm.parentCode);
        })
        .finally(() => {
          this.submitChildLoading = false;
        });
    } else {
      Reflect.deleteProperty(childForm, 'id');
      api
        .codeChildAdd(childForm)
        .then(() => {
          this.$message.success('新增成功');
          this.dialogChildVisible = false;
          const childIndex = this.codeList.findIndex(
            item => item.id === childForm.parentId
          );
          this.getChildList(childIndex, childForm.parentCode);
        })
        .finally(() => {
          this.submitChildLoading = false;
        });
    }
  }
}
</script>

<style scoped lang="scss">
.child-table {
  width: 95%;
  margin: 4px auto !important;
}
</style>
