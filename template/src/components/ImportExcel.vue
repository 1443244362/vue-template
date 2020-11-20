a<template>
  <el-button
    @click="importExcel"
    :size="actionBtnSize"
    plain
    type="primary"
    v-loading="importLoading"
    element-loading-spinner="el-icon-loading"
  >
    导入
  </el-button>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { actionBtnSize, apiUrl } from '@/config/env';
import jsCookie from 'js-cookie';
@Component({})
export default class CodeSelect extends Vue {
  @Prop({ required: true }) private url!: string;
  @Prop({ default: 'dataExcel' }) private fileName!: string;
  public actionBtnSize = actionBtnSize;
  public importLoading = false;
  public importExcel() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = () => {
      if (input.files) {
        this.importLoading = true;
        const fileObj = input.files[0];
        const url = apiUrl + this.url;
        const formData = new FormData();
        formData.append(this.fileName, fileObj);
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          const res = JSON.parse(xhr.responseText);
          if (res.success) {
            this.$message.success('导入成功');
            this.$emit('success', res);
          } else {
            this.$message.error(res.message);
          }
          this.importLoading = false;
        };
        xhr.onerror = e => {
          this.$message.warning('导入失败');
          localStorage.importError = e;
          this.importLoading = false;
        };
        xhr.open('post', url, true);
        xhr.setRequestHeader('Authorization', jsCookie.get('token') as string);
        xhr.send(formData);
      } else {
        this.$message.warning('请选择文件');
      }
    };
    input.click();
  }
}
</script>

<style lang="scss"></style>
