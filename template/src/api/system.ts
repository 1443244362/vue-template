import { recsteelInterface } from './index';

export default {
  /**值集列表 */
  codeList: (params: {
    /**父code */ parentCode?: string;
    /**父id */ parentId?: string;
    /**值集代码 */ code?: string;
    /**值集名称 */ name?: string;
    pageNum: number;
    pageSize: number;
  }): Promise<{ data: Code[]; total: number }> => {
    return recsteelInterface('/system/code', params, 'get');
  },

  /**值集新增 */
  codeAdd: (params: Code): Promise<{}> => {
    return recsteelInterface('/system/code', params, 'post');
  },

  /**值集编辑 */
  codeUpdate: (params: Code): Promise<{}> => {
    return recsteelInterface('/system/code/' + params.id, params, 'put');
  },

  /**值集删除 */
  codeDelete: (params: { id: number }): Promise<{}> => {
    return recsteelInterface('/system/code/' + params.id, params, 'delete');
  },

  /**子值集列表 */
  codeChildList: (params: {
    /**父code */ parentCode: string;
  }): Promise<{ data: CodeChild[] }> => {
    return recsteelInterface('/system/code/child', params, 'get');
  },
  /**子值集新增 */
  codeChildAdd: (params: CodeChild): Promise<{}> => {
    return recsteelInterface('/system/code/child', params, 'post');
  },
  /**子值集编辑 */
  codeChildUpdate: (params: CodeChild): Promise<{}> => {
    return recsteelInterface('/system/code/child/' + params.id, params, 'put');
  },

  /**菜单列表 */
  menuList: (
    params: {
      roleId?: number;
    } = {}
  ): Promise<{ data: Menu[] }> => {
    return recsteelInterface('/system/menu', params, 'get');
  },

  /**菜单新增 */
  menuAdd: (params: Menu): Promise<{}> => {
    return recsteelInterface('/system/menu', params, 'post');
  },

  /**菜单编辑 */
  menuUpdate: (params: Menu): Promise<{}> => {
    return recsteelInterface('/system/menu/' + params.id, params, 'put');
  },
  /**菜单删除 */
  menuDelete: (params: { id: number }): Promise<{}> => {
    return recsteelInterface('/system/menu/' + params.id, params, 'delete');
  },
  /**用户列表 */
  userList: (params: {
    name?: string;
    roleId?: string;
    pageNum: number;
    pageSize: number;
  }): Promise<{ data: User[]; total: number }> => {
    return recsteelInterface('/system/user', params, 'get');
  },

  /**用户新增 */
  userAdd: (params: User): Promise<{}> => {
    return recsteelInterface('/system/user', params, 'post');
  },

  /**用户编辑 */
  userUpdate: (params: User): Promise<{}> => {
    return recsteelInterface('/system/user/' + params.id, params, 'put');
  },
  /**用户删除 */
  userDelete: (params: { id: number }): Promise<{}> => {
    return recsteelInterface('/system/user/' + params.id, params, 'delete');
  },

  /**登录 */
  login: (params: {
    /**账号 */ account: string;
    /**密码 */ password: string;
  }): Promise<{
    data: {
      /**验证登陆的token */ token: string;
      /**用户信息 */ user: User;
    };
  }> => {
    return recsteelInterface('/system/user/login', params, 'post');
  },
  /**获取登陆用户信息 */
  getLoginInfo: (): Promise<{
    /**用户信息 */ data: User;
  }> => {
    return recsteelInterface('/system/user/loginInfo', {}, 'get');
  },
  /**获取登陆用户菜单 */
  getUserMenu: (params: {
    /**标识 */ menuUrl: string;
  }): Promise<{
    /**用户菜单 */ data: Menu;
  }> => {
    return recsteelInterface('/system/user/menuList', params, 'get');
  },
  /**用户修改密码 */
  updatePassword: (params: {
    oldPassword: string;
    password: string;
    confirmPassword: string;
  }): Promise<{}> => {
    return recsteelInterface('/system/user/updatePassword', params, 'put');
  },
  /**角色列表 */
  roleList: (params: {
    name?: string;
    pageNum: number;
    pageSize: number;
  }): Promise<{ data: Role[]; total: number }> => {
    return recsteelInterface('/system/role', params, 'get');
  },

  /**角色新增 */
  roleAdd: (params: Role): Promise<{}> => {
    return recsteelInterface('/system/role', params, 'post');
  },

  /**角色编辑 */
  roleUpdate: (params: Role): Promise<{}> => {
    return recsteelInterface('/system/role/' + params.id, params, 'put');
  },
  /**角色删除 */
  roleDelete: (params: { id: number }): Promise<{}> => {
    return recsteelInterface('/system/role/' + params.id, params, 'delete');
  },
  /**关联菜单 */
  roleRelationMenu: (params: { id: number; menuIds: string }): Promise<{}> => {
    return recsteelInterface('/system/role/' + params.id, params, 'put');
  },
  /**角色权限数 */
  roleMenuTree: (params: { roleId: number }): Promise<{ data: Menu[] }> => {
    return recsteelInterface('/system/role/menuTree', params, 'get');
  }
};
