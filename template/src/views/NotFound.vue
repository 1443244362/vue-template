<template>
  <div class="not-found">
    <div
      style="
        width: 1920px;
        height: 1080px;
        margin: 0;
        padding: 0;
        background: #caccd3;
      "
    >
      <div
        style="
          width: 1024px;
          height: 530px;
          background: #ffffff;
          box-shadow: 17px 24px 23px 0px rgba(0, 0, 0, 0.18);
          border-radius: 21px;
          margin: 0 auto;
          position: relative;
          top: 50%;
          transform: translateY(-50%);
        "
      >
        <div
          style="width: 548px; height: 280px; margin: 0 auto; padding: 125px 0"
        >
          <div style="width: 280px; height: 280px; display: inline-block">
            <img src="../assets/img/light.png" height="280" width="280" />
          </div>
          <div
            style="
              width: 192px;
              height: 280px;
              display: inline-block;
              margin-left: 76px;
            "
          >
            <div>
              <img src="../assets/img/404.png" height="116" width="192" />
            </div>
            <div
              style="
                width: 211px;
                height: 28px;
                font-size: 28px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #212121;
                line-height: 28px;
                letter-spacing: 1px;
                margin-top: 26px;
                margin-bottom: 70px;
                text-align: center;
              "
            >
              页面未找到～
            </div>
            <el-button
              type="primary"
              round
              style="margin-left: 40px"
              @click="previousPage"
              >返回<img
                src="../assets/img/back.png"
                height="12"
                width="17"
                style="margin-left: 5px"
            /></el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TabModule from '@/store/modules/tab';
@Component({})
export default class NotFound extends Vue {
  public previousPage() {
    const { name, path, fullPath, meta } = this.$route;
    TabModule.closeTab({
      name,
      path,
      fullPath,
      meta,
      redirectPath: '/',
    } as TabObj);
  }
}
</script>

<style lang="scss" scope>
.not-found {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}
</style>
