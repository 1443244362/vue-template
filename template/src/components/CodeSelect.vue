<template>
  <el-select
    class="code-select"
    v-model="selectedValue"
    clearable
    @change="valueChange"
  >
    <el-option
      v-for="item in codeList"
      :key="item.code"
      :value="item.code"
      :label="item.name"
    ></el-option>
  </el-select>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Code, getCode } from '@/libs/code';
@Component({})
export default class CodeSelect extends Vue {
  @Prop({ required: true }) private value!: string;
  @Prop({ required: true }) private code!: string;
  public name = 'CodeSelect';
  public codeList: Code[] = [];
  public selectedValue = '';
  public async mounted() {
    this.codeList = await getCode(this.code);
  }
  @Watch('value', { immediate: true })
  public resChange(val: string) {
    this.selectedValue = val;
  }
  public valueChange(id) {
    this.$emit('input', id);
    this.$emit('change', id);
  }
}
</script>

<style lang="scss"></style>
