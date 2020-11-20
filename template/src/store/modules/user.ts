import {
  Module,
  VuexModule,
  Mutation,
  getModule,
  Action
} from 'vuex-module-decorators';
import store from '@/store';
import api from '@/api';

@Module({ namespaced: true, name: 'user', dynamic: true, store })
class UserModule extends VuexModule {
  public id = 0;
  public name = '';
  @Mutation
  setUser(payload: User) {
    for (const key in payload) {
      this[key] = payload[key];
    }
  }
  @Action
  async getUser() {
    const user = (await api.getLoginInfo()).data;
    this.setUser(user);
  }
}

export default getModule(UserModule);
