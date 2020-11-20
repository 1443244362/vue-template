<template>
  <div class="collapse">
    <div class="title">
      <img
        src="../assets/img/toggle-show.png"
        alt=""
        class="toggle-show"
        @click="toggleShow"
      />
      <div class="title-name">
        {{ name }}
      </div>
      <div
        class="toggle-statistics"
        v-if="statistics"
        @click="toggleStatistics"
      >
        <img
          src="../assets/img/toggle.png"
          alt=""
          class="toggle-statistics-img"
        />
      </div>
      <div class="statistics" v-if="statistics && showStatistics">
        <slot name="statistics"> </slot>
      </div>
      <div class="tabs">
        <slot name="tabs"> </slot>
      </div>
      <div class="btn">
        <slot name="btn"></slot>
      </div>
    </div>
    <div class="data">
      <slot name="data"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import anime from 'animejs';
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class Collapse extends Vue {
  @Prop({ default: '', required: true }) private name!: string;
  @Prop({ type: Boolean, default: false }) public statistics?: boolean;
  public showMore = true;
  public showStatistics = true;
  private dataHeight = '';
  public toggleShow(event: PointerEvent) {
    this.showMore = !this.showMore;
    const dataNode = (event.target as any).parentNode.parentNode.querySelector(
      '.data'
    );
    if (this.showMore) {
      anime({
        targets: event.target,
        rotate: '0',
        duration: 200,
        easing: 'linear'
      });
      anime({
        targets: dataNode,
        height: this.dataHeight,
        duration: 200,
        easing: 'linear'
      });
    } else {
      anime({
        targets: event.target,
        rotate: '-90deg',
        duration: 200,
        easing: 'linear'
      });
      anime({
        targets: dataNode,
        height: '0',
        duration: 200,
        easing: 'linear'
      });
      this.dataHeight = dataNode.offsetHeight;
    }
  }
  public toggleStatistics() {
    this.showStatistics = !this.showStatistics;
  }
}
</script>

<style lang="scss">
.collapse {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #e9ecee;
  .title {
    $title-height: 38px;
    height: $title-height;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid #e9ecee;
    padding: 0 10px;
    .toggle-show {
      width: 15px;
      height: 8px;
      margin: 2px 10px 0 5px;
      cursor: pointer;
    }
    .title-name {
      color: #999999;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .toggle-statistics {
      background: #1083ff;
      width: 28px;
      height: 26px;
      border-radius: 2px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 8px;
      border-radius: 4px;
      cursor: pointer;
      .toggle-statistics-img {
        width: 16px;
        height: 13px;
      }
    }
    .statistics {
      background: #edf5ff;
      border: 1px solid #97c3ff;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 24px;
      padding: 0 8px;
      .statistics-img {
        width: 14px;
        height: 14px;
      }
      .el-button {
        margin-left: 8px;
      }
      .msg {
        color: #666666;
        font-size: 14px;
        margin-left: 8px;
      }
    }
    .tabs {
      display: flex;
      height: $title-height;
      .tab-div {
        color: #999999;
        font-size: 14px;
        height: $title-height;
        width: 56px;
        margin: 0 13px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        user-select: none;
      }
      .tab-div.selected {
        height: $title-height - 2px;
        border-bottom: 2px solid #1083ff;
        color: #333333;
        cursor: pointer;
        user-select: none;
      }
    }
    .btn {
      flex: 1;
      text-align: right;
      .el-loading-spinner {
        transform: translateY(-50%);
        margin-top: 0;
      }
    }
  }
  .data {
    height: auto;
    overflow: hidden;
    margin: 0 15px;
    $input-width: 212px;
    .el-form.submit {
      .el-form-item {
        margin-bottom: 22px;
      }
    }
    .el-form {
      display: flex;
      flex-wrap: wrap;
      margin: 5px 0;
      .el-form-item {
        width: auto;
        margin: 0 5px;
        .el-form-item__label {
          color: #666666;
          font-size: 14px;
        }

        .el-form-item__content {
          // width: $input-width;
          .el-select,
          .el-date-editor,
          .el-input {
            width: $input-width;
          }
          textarea {
            width: $input-width * 3;
          }
          .el-input__inner {
            height: 32px;
          }
          .el-textarea {
            margin: 0;
          }
        }
      }
    }
    .el-table,
    .el-textarea {
      margin: 15px 0 5px 0;
    }
    .el-pagination {
      margin-bottom: 10px;
      text-align: right;
    }
  }
}
.collapse + .collapse {
  margin-top: 12px;
}
</style>
