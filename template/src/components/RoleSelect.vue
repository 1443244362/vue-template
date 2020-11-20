<template>
  <el-select
    class="role-select"
    v-model="selectedValue"
    filterable
    clearable
    @change="valueChange"
  >
    <el-option
      v-for="item in roleList"
      :key="item.id"
      :value="item.id"
      :label="item.name"
    ></el-option>
  </el-select>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import api from '@/api';
@Component({})
export default class CodeSelect extends Vue {
  @Prop({ required: true }) private roleId!: number | '';
  @Prop({ required: false }) private searchLimit!: {};

  public roleList: Role[] = [];
  public selectedValue: number | '' = '';
  public async mounted() {
    this.getList();
  }
  public async getList(name = '') {
    this.roleList = (
      await api.roleList(
        Object.assign(
          {
            name,
            pageNum: 1,
            pageSize: 999
          },
          this.searchLimit
        )
      )
    ).data;
  }
  @Watch('roleId', { immediate: true })
  public resChange(val: number | '') {
    this.selectedValue = val;
  }
  public valueChange(id: number) {
    const role = this.roleList.find(item => item.id === id) || {
      id: '',
      name: ''
    };
    this.$emit('update:roleId', role.id);
    this.$emit('update:roleName', role.name);
    this.$emit('change', role);
  }
}
</script>

<style lang="scss"></style>
