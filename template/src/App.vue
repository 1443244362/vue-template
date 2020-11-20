<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class App extends Vue {}
</script>

<style lang="scss">
html {
  height: 100%;
  width: 100%;
  body {
    margin: 0;
    height: 100%;
    width: 100%;
    #app {
      width: 100%;
      height: 100%;
      color: #333333;
      font-family: PingFangSC-Regular, PingFang SC;

      img {
        user-select: none;
      }

      .el-table {
        th {
          background: #fafafa;
        }
        td {
          background-color: #ffffff;
          a {
            text-decoration: none;
            color: #1677ff;
          }
        }
        .el-table__row--striped {
          td {
            background: #fafafa;
          }
        }
        tr.current-row > td {
          background-color: #edf5ff;
        }
        td,
        th {
          border-color: #eeeeee !important;
          padding: 8px 0;
        }
      }

      .el-dialog {
        width: 60%;
        border-radius: 10px;
        .el-dialog__header {
          color: #3a3a3a;
        }
        .el-dialog__body {
          $input-width: 200px;
          // .el-form {
          //   display: flex;
          //   flex-wrap: wrap;
          //   .el-form-item {
          //     .el-form-item__label {
          //       color: #666666;
          //       font-size: 14px;
          //     }
          //     .el-form-item__content {
          //       width: $input-width;
          //       .el-select,
          //       .el-date-editor {
          //         width: $input-width;
          //       }
          //       .el-input__inner {
          //         height: 32px;
          //       }
          //     }
          //   }
          // }
        }
        .el-dialog__footer {
          text-align: center;
          .el-loading-spinner {
            transform: translateY(-50%);
            margin-top: 0;
          }
        }
      }
      .el-dialog.is-fullscreen {
        width: 100%;
        display: flex;
        flex-direction: column;
        border-radius: 0;
        .el-dialog__body {
          padding: 0;
          flex: 1;
        }
      }
    }
  }
}
</style>
