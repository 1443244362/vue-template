declare interface TabObj {
  name: string;
  path: string;
  /**fullPath 防止query参数丢失 */
  fullPath: string;
  meta: {
    title: string;
  };
  redirectPath?: string;
}

declare interface AnyObj {
  [key: string]: any;
}

declare type methodType = 'get' | 'post' | 'patch' | 'delete' | 'put';
interface Window {
  closeActiviti: Function;
}
