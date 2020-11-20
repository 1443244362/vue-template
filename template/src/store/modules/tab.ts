import {
  Module,
  VuexModule,
  Mutation,
  getModule
} from 'vuex-module-decorators';
import store from '@/store';
import Router from '../../router/index';
import jsCookie from 'js-cookie';

let tabArr: TabObj[] = [];
const tabArrString = jsCookie.get('tabArr');
if (tabArrString) {
  tabArr = JSON.parse(tabArrString);
}
@Module({ namespaced: true, name: 'tab', dynamic: true, store })
class TabModule extends VuexModule {
  tabArr = tabArr;
  currentTab: TabObj = {
    name: '',
    path: '',
    fullPath: '',
    meta: {
      title: ''
    }
  };
  @Mutation
  addTab(payload: TabObj) {
    const index = this.tabArr.findIndex(val => val.name === payload.name);
    if (index < 0) {
      this.tabArr.push(payload);
    } else {
      this.tabArr.splice(index, 1, payload);
    }
    this.currentTab = payload;
    jsCookie.set('tabArr', JSON.stringify(this.tabArr));
    jsCookie.set('currentTab', JSON.stringify(this.currentTab));
  }
  @Mutation
  closeTab(payload: TabObj) {
    const index = this.tabArr.findIndex(val => val.name === payload.name);
    if (payload.redirectPath) {
      Router.push(payload.redirectPath as string);
    } else {
      if (payload.name === this.currentTab.name) {
        const currentIndex =
          index === this.tabArr.length - 1 ? index - 1 : index + 1;
        if (currentIndex > -1) {
          this.currentTab = this.tabArr[currentIndex];
          Router.push(this.currentTab.fullPath);
        } else {
          Router.push('/HomePage');
        }
      }
    }
    this.tabArr.splice(index, 1);
    jsCookie.set('tabArr', JSON.stringify(this.tabArr));
    jsCookie.set('currentTab', JSON.stringify(this.currentTab));
  }

  @Mutation
  clear() {
    this.currentTab = {
      name: '',
      path: '',
      fullPath: '',
      meta: {
        title: ''
      }
    };
    this.tabArr = [];
    jsCookie.remove('tabArr');
    jsCookie.remove('currentTab');
    jsCookie.remove('tab-scroll-letf');
  }
  @Mutation
  clearAll() {
    this.currentTab = {
      name: '',
      path: '',
      fullPath: '',
      meta: {
        title: ''
      }
    };
    this.tabArr = [];
    jsCookie.remove('tabArr');
    jsCookie.remove('currentTab');
    jsCookie.remove('tab-scroll-letf');
    Router.push('/HomePage');
  }
  @Mutation
  clearOther() {
    if (this.currentTab.fullPath) {
      this.tabArr = [this.currentTab];
      jsCookie.set('tabArr', JSON.stringify(this.tabArr));
      jsCookie.remove('tabArr');
    }
  }
}

export default getModule(TabModule);
