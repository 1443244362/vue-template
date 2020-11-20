<template>
  <div>
    <el-upload
      ref="upload"
      action=""
      :disabled="disabled"
      :list-type="listType"
      :show-file-list="showFileList"
      :on-remove="uploadRemove"
      :on-preview="uploadPreview"
      :on-exceed="uploadExceed"
      :on-change="uploadChange"
      :auto-upload="false"
      :limit="limit"
      :file-list="fileList"
      v-loading="uploadLoading"
      element-loading-text="上传中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <slot name="diy"></slot>
      <slot>
        <i class="el-icon-plus" v-if="listType == 'picture-card'"></i>
        <el-button type="primary" v-if="listType == 'text'" size="mini"
          >点击上传</el-button
        >
        <div slot="tip" v-if="listType">
          {{ diyText }}
          只能上传
          <span style="color: #f44179">
            {{ limit ? limit + '个 ' : '' }}
          </span>
          <span>
            {{ typeArr && typeArr.join('/') }}
          </span>
          文件
        </div>
      </slot>
    </el-upload>
    <el-dialog :visible.sync="dialogShow" append-to-body>
      <img :src="previewImgUrl" style="width: 100%;" />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  ossRegion,
  bucketName,
  accessKeyId,
  accessKeySecret,
  fileDomain,
  platform
} from '../config/env';
import OSS from 'ali-oss';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { formatFileTime } from '@/libs/date';
interface FileObj {
  name: string;
  url: string;
}
@Component({})
export default class Upload extends Vue {
  @Prop({ default: 0 }) private limit?: number;
  @Prop({ default: 'picture-card' }) private listType?: 'picture-card' | 'text';
  @Prop({ default: false }) private disabled?: boolean;
  @Prop({
    default() {
      return ['png', 'jpg', 'jpeg'];
    }
  })
  private typeArr?: string[];
  @Prop({ default: true }) private showFileList?: boolean;
  @Prop({ default: '' }) private diyText?: string;
  @Prop({ default: '', required: true, type: String }) private res!: string;
  @Prop({ default: 'default' }) private moduleName?: string;
  public dialogShow = false;
  public previewImgUrl = '';
  public fileList: FileObj[] = [];
  public uploadLoading = false;
  /**父组件调用该方法 使用res改变fileList */
  public changeFileList() {
    if (this.res) {
      this.fileList = this.res.split(',').map(name => {
        return {
          name,
          url: fileDomain + name
        };
      });
    } else {
      this.fileList = [];
    }
  }
  public async uploadChange(file, fileList) {
    const typeArr = this.typeArr;
    if (typeArr && typeArr.length) {
      const type = file.name.split('.').pop();
      if (typeArr.indexOf(type) < 0) {
        this.$message.error('只允许上传' + typeArr.join(',') + '格式的文件');
        return false;
      }
    }
    const client = new OSS({
      region: ossRegion,
      accessKeyId: accessKeyId,
      accessKeySecret: accessKeySecret,
      bucket: bucketName
    });
    try {
      this.uploadLoading = true;
      const name = `${platform}.${this.moduleName}.${formatFileTime(
        new Date()
      )}.${file.name.split('.').pop()}`;
      file.name = name;
      await client.put(name, file.raw);
      this.$emit(
        'update:res',
        fileList
          .map(item => {
            return item.name;
          })
          .toString()
      );
      return Promise.resolve();
    } catch (e) {
      localStorage.uploadError = e;
    } finally {
      this.uploadLoading = false;
    }
    return Promise.reject();
  }

  public uploadRemove(file: FileObj, fileList: FileObj[]) {
    const arr: string[] = fileList.map(item => {
      return item.name;
    });
    this.$emit('update:res', arr.join(','));
  }
  public uploadPreview(file: FileObj) {
    switch (this.listType) {
      case 'picture-card': {
        this.previewImgUrl = file.url ? file.url : fileDomain + file.name;
        this.dialogShow = true;
        break;
      }
      case 'text': {
        const a = document.createElement('a');
        a.href = fileDomain + file.name;
        a.click();
        break;
      }
    }
  }
  public uploadExceed() {
    this.$message.warning('只能选择' + this.limit + '个文件上传');
  }
  public clearFiles() {
    (this.$refs.upload as any).clearFiles();
  }
  public async uploadError(err) {
    switch (err.status) {
      case 401:
        await this.$store.dispatch('setQiNiu');
        this.$message.error('网络波动，请重新上传');
        break;
      case 614:
        this.$message.error('该文件已存在，请重命名后上传');
        break;
      default:
        this.$message.error('上传出错，请稍后重试');
    }
  }
}
</script>

<style scoped></style>
