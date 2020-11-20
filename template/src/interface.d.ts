declare interface Code {
  /**值集id */ id: number;
  /**值集代码 */ code: string;
  /**值集名称 */ name: string;
}
declare interface CodeChild extends Code {
  /**父值集id */ parentId: number;
  /**父值集代码 */ parentCode: string;
  /**排序 */ sort: string;
  /**颜色 */ color: string;
}
declare interface Menu {
  /**id */ id: number;
  /**父id */ parentId: number;
  /**名称 */ name: string;
  /**菜单标识 */ menuUrl: string;
  /**文件路径 */ filePath: string;
  /**排序 */ sort: number;
  /**菜单类型 1应用2菜单3页面3按钮*/ type: string;
  /**是否显示 1显示2不显示 */ isVisible: string;
  /**子菜单 */ children?: Menu[];
}
declare interface User {
  /**id */ id: number;
  /**名称 */ name: string;
  /**账号 */ account: string;
  /**性别 */ sex: string;
  /**角色 */ roleId: number | '';
  /**角色 */ roleName: string;
  /**密码 */ password?: string;
}
declare interface Role {
  /**id */ id: number;
  /**名称 */ name: string;
  /**编号 */ number: string;
  /**权限 */ menuIds?: string;
}
