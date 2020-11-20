import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { Loading } from 'element-ui';
import jsCookie from 'js-cookie';
import TabModule from '@/store/modules/tab';
import UserModule from '@/store/modules/user';
import MenuModule from '@/store/modules/menu';

import Login from '@/views/Login.vue';
import Manage from '@/views/Manage.vue';
import HomePage from '@/views/HomePage.vue';
import NotFound from '@/views/NotFound.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect() {
      if (jsCookie.get('token')) {
        return '/HomePage';
      } else {
        return '/Login';
      }
    }
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录'
    }
  },
  {
    path: '/NotFound',
    name: 'NotFound',
    meta: {
      title: '404'
    },
    component: NotFound,
    children: []
  },
  {
    path: '/Manage',
    meta: {
      title: '首页'
    },
    component: Manage,
    children: [
      {
        path: '/HomePage',
        name: 'HomePage',
        component: HomePage,
        meta: {
          title: '首页'
        }
      }
    ]
  }
];
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return (originalPush.call(this, location) as any).catch(err => err);
};
const router = new VueRouter({
  routes
});
router.afterEach(to => {
  if (
    to.name &&
    to.name !== 'Login' &&
    to.name !== 'HomePage' &&
    to.name !== 'NotFound'
  ) {
    TabModule.addTab({
      name: to.name,
      path: to.path,
      meta: to.meta,
      fullPath: to.fullPath
    });
  }
  window.scrollTo(0, 0);
  document.title = to.meta.title;
});

router.beforeEach(async (to, from, next) => {
  if (to.name === 'Login' || to.name === 'NotFound') {
    next();
    return;
  }
  if (!jsCookie.get('token')) {
    next({
      path: 'Login',
      replace: true
    });
    return;
  }
  if (!UserModule.name) {
    const loading = Loading.service({
      lock: true,
      text: '获取用户信息',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    await UserModule.getUser();
    loading.close();
  }
  if (!MenuModule.initMenu) {
    const loading = Loading.service({
      lock: true,
      text: '获取用户权限',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    await MenuModule.getMenu();
    const routes: RouteConfig[] = [
      {
        path: '/Manage',
        meta: {
          title: '首页'
        },
        component: Manage,
        children: [
          {
            path: '/HomePage',
            name: 'HomePage',
            component: HomePage,
            meta: {
              title: '首页'
            }
          }
        ]
      }
    ];
    MenuModule.menuList.forEach(item => {
      if (item.children) {
        item.children.forEach(child => {
          if (routes[0].children) {
            routes[0].children.push({
              name: child.menuUrl.split('/').pop(),
              path: child.menuUrl,
              meta: {
                title: child.name
              },
              component: () =>
                import(`@/views${item.filePath}${child.filePath}`)
            });
          }
        });
      }
    });
    router.addRoutes(routes);
    loading.close();
    next({
      path: to.fullPath,
      replace: true
    });
    return;
  }
  if (!to.name) {
    next({
      path: '/NotFound'
    });
    return;
  }
  next();
});
export default router;
