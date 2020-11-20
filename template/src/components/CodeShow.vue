<template>
  <span class="code-show" :style="{ color: color }">{{ name }}</span>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { getCodeValueAndColor } from '@/libs/code';
@Component({})
export default class CodeSelect extends Vue {
  @Prop({ required: true }) private value!: string;
  @Prop({ required: true }) private code!: string;
  public name = 'CodeSelect';
  public color = '';
  public async mounted() {
    this.init();
  }
  public async init() {
    const res = await getCodeValueAndColor(this.code, this.value);
    this.name = res.name;
    this.color = res.color;
  }
  get temp() {
    return this.code + this.value;
  }
  @Watch('temp')
  private change() {
    this.init();
  }
}
</script>

<style lang="scss" scope>
.code-show {
  font-weight: bold;
}
</style>
