import {
  Module,
  VuexModule,
  Mutation,
  getModule,
  Action
} from 'vuex-module-decorators';
import store from '@/store';
import api from '@/api';
import { deepClone } from '@/libs/utils';

@Module({ namespaced: true, name: 'menu', dynamic: true, store })
class MenuModule extends VuexModule {
  public menuList: Menu[] = [];
  public initMenu = false;
  get btnList() {
    const btnList: string[] = [];
    this.menuList.forEach(menu => {
      if (menu.children) {
        menu.children.forEach(page => {
          if (page.children) {
            page.children.forEach(btn => {
              btnList.push(btn.menuUrl);
            });
          }
        });
      }
    });
    return btnList;
  }
  get showMenuList() {
    const menuList = deepClone(this.menuList);
    return menuList
      .filter(item => {
        return item.isVisible === '1';
      })
      .map(item => {
        item.children =
          item.children &&
          item.children.filter(child => {
            return child.isVisible === '1';
          });
        return item;
      });
  }
  @Mutation
  setMenu(payload: Menu[]) {
    this.initMenu = true;
    this.menuList = payload;
  }
  @Mutation
  clear() {
    this.initMenu = false;
    this.menuList = [];
  }
  @Action
  async getMenu() {
    const res = await api.getUserMenu({ menuUrl: 'web' });
    this.setMenu(res.data.children || []);
  }
}

export default getModule(MenuModule);
