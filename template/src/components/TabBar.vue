<template>
  <div class="tab-bar">
    <div class="arrow" @click="moveLeft">
      <img src="../assets/img/left-arrow.png" alt="" class="arrow-img" />
    </div>
    <div class="tab-scroll" @contextmenu.prevent="showMenu">
      <div
        class="tab"
        @click="changeTab(item)"
        v-for="item in tabArr"
        :key="item.name"
        :class="{ 'current-tab': item.name === currentTab.name }"
      >
        {{ item.meta.title }}
        <img
          src="../assets/img/blue-fork.png"
          class="close-img"
          @click.stop="closeTab(item)"
          v-if="item.name === currentTab.name"
        />
        <img
          src="../assets/img/gray-fork.png"
          class="close-img"
          @click.stop="closeTab(item)"
          v-else
        />
      </div>
    </div>
    <div class="arrow" @click="moveRight">
      <img src="../assets/img/right-arrow.png" alt="" class="arrow-img" />
    </div>
    <div class="close-action">
      关闭操作
      <img
        src="../assets/img/close-action.png"
        alt=""
        class="close-action-img"
      />
      <div class="action-div">
        <div class="action-btn" @click="clearAll">关闭全部页面</div>
        <div class="action-btn" @click="clearOther">关闭其他页面</div>
      </div>
      <div
        class="action-div fixed"
        :style="{ left: actionLeft + 'px', top: actionTop + 'px' }"
        v-show="actionShow"
      >
        <div class="action-btn" @click="clearAll">关闭全部页面</div>
        <div class="action-btn" @click="clearOther">关闭其他页面</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TabModule from '@/store/modules/tab';
import jsCookie from 'js-cookie';
@Component({})
export default class TabBar extends Vue {
  get tabArr() {
    return TabModule.tabArr;
  }
  public actionLeft = 0;
  public actionTop = 0;
  public actionShow = false;
  public mounted() {
    const tabScroll: any = document.querySelector('.tab-scroll');
    const tabArr: any[] = tabScroll.querySelectorAll('.tab');
    if (tabArr[0]) {
      try {
        tabArr[0].style.marginLeft = jsCookie.get('tab-scroll-letf');
      } catch (e) {
        localStorage.tabBarLeftError = e;
      }
    }
  }
  public showMenu(e) {
    this.actionLeft = e.clientX;
    this.actionTop = e.clientY;
    this.actionShow = true;
    document.addEventListener('click', () => {
      this.actionShow = false;
    });
  }
  get currentTab() {
    this.$nextTick(() => {
      const tabScroll: any = document.querySelector('.tab-scroll');
      if (tabScroll) {
        const tabScrollWidth = tabScroll.offsetWidth;
        const tabArr: any[] = tabScroll.querySelectorAll('.tab');
        let tabArrWidth = 0;
        for (const item of tabArr) {
          tabArrWidth += item.offsetWidth;
          if (item.classList.contains('current-tab')) {
            break;
          }
        }
        if (tabArrWidth > tabScrollWidth) {
          tabArr[0].style.marginLeft = -(tabArrWidth - tabScrollWidth) + 'px';
        } else {
          tabArr[0].style.marginLeft = 0;
        }
        jsCookie.set('tab-scroll-letf', tabArr[0].style.marginLeft);
      }
    });
    return TabModule.currentTab;
  }
  public moveLeft() {
    const tabScroll: any = document.querySelector('.tab-scroll');
    if (tabScroll) {
      const tabScrollWidth = tabScroll.offsetWidth;
      const tabArr: any[] = tabScroll.querySelectorAll('.tab');
      const tabScrollMarginLeft = Number.parseFloat(
        tabArr[0].style.marginLeft.split('px')[0]
      );
      // 左边距大于tabScroll的宽度就减去宽度 否则直接置0
      if (-tabScrollMarginLeft > tabScrollWidth) {
        tabArr[0].style.marginLeft =
          tabScrollMarginLeft + tabScrollWidth + 'px';
      } else {
        tabArr[0].style.marginLeft = 0;
      }
      jsCookie.set('tab-scroll-letf', tabArr[0].style.marginLeft);
    }
  }
  public moveRight() {
    const tabScroll: any = document.querySelector('.tab-scroll');
    if (tabScroll) {
      const tabScrollWidth = tabScroll.offsetWidth;
      const tabArr: any[] = tabScroll.querySelectorAll('.tab');
      const tabScrollMarginLeft = Number.parseFloat(
        tabArr[0].style.marginLeft.split('px')[0]
      );
      let tabArrWidth = 0;
      for (const item of tabArr) {
        tabArrWidth += item.offsetWidth;
      }
      // 所有tab宽度大于tabScroll两倍宽度+左边距 左边距就减去tabScroll宽度 否则左边距=负的所有tab宽度-tabScroll宽度
      if (tabArrWidth > tabScrollWidth * 2 - tabScrollMarginLeft) {
        tabArr[0].style.marginLeft =
          tabScrollMarginLeft - tabScrollWidth + 'px';
      } else {
        tabArr[0].style.marginLeft = -(tabArrWidth - tabScrollWidth) + 'px';
      }
      jsCookie.set('tab-scroll-letf', tabArr[0].style.marginLeft);
    }
  }
  public changeTab(tab: TabObj) {
    this.$router.push(tab.fullPath);
  }
  public closeTab(tab: TabObj) {
    TabModule.closeTab(tab);
  }
  public clearAll() {
    TabModule.clearAll();
  }
  public clearOther() {
    TabModule.clearOther();
  }
}
</script>

<style scoped lang="scss">
.tab-bar {
  $tabbar-height: 40px;
  height: $tabbar-height;
  width: 100%;
  display: flex;
  border-top: 1px solid #e6eaec;
  border-bottom: 1px solid #e6eaec;
  user-select: none;
  $arrow-width: 40px;
  .arrow {
    width: $arrow-width;
    height: $tabbar-height;
    display: flex;
    justify-content: center;
    align-items: center;
    border: #e6eaec solid;
    border-width: 0px 1px 0px 1px;
    background: #ffffff;
    z-index: 10;
    cursor: pointer;
    .arrow-img {
      width: 16px;
      height: 10px;
    }
  }
  $action-width: 88px;
  .close-action {
    width: $action-width;
    height: $tabbar-height;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #a9b1c1;
    font-size: 14px;
    cursor: pointer;
    position: relative;
    &:hover .action-div:not(.fixed) {
      display: block;
    }
    .close-action-img {
      width: 13px;
      height: 12px;
      margin-left: 4px;
      margin-top: 2px;
    }
    .action-div {
      background-color: #ffffff;
      z-index: 10;
      box-shadow: 0px 2px 8px 0px rgba(#000000, 0.15);
      &.fixed {
        position: fixed;
      }
      &:not(.fixed) {
        position: absolute;
        right: 0;
        top: $tabbar-height;
        display: none;
      }
      .action-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: $action-width + $arrow-width + 1;
        height: 40px;
        font-size: 14px;
        color: #717171;
        &:hover {
          color: #457fff;
          background-color: rgba($color: #1677ff, $alpha: 0.1);
        }
      }
    }
  }
  .tab-scroll {
    height: 40px;
    display: flex;
    flex: 1;
    overflow: hidden;
    .tab {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      color: #a9b1c1;
      font-size: 14px;
      border-right: 1px solid #e6eaec;
      padding: 0 8px;
      flex-shrink: 0;
      transition: margin-left 0.2s ease;
      cursor: pointer;
      .close-img {
        width: 8px;
        height: 8px;
        margin-top: 2px;
        margin-left: 6px;
        display: inline-block;
      }
    }
    .current-tab {
      background-color: #edf5ff;
      color: #8d94a3;
      border-left: 1px solid #e6eaec;
      border: none;
    }
    .tab:not(.current-tab):hover {
      background-color: #fcfcfc;
      color: #8d94a3;
    }
  }
}
</style>
