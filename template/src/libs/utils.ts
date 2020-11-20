import jsCookie from 'js-cookie';
import TabModule from '@/store/modules/tab';
import MenuModule from '@/store/modules/menu';
import router from '@/router';

export const deepClone = <T>(obj: T, hash = new WeakMap()): T => {
  if (obj instanceof RegExp) return (new RegExp(obj) as unknown) as T;
  if (obj instanceof Date) return (new Date(obj) as unknown) as T;
  if (obj === null || typeof obj !== 'object') {
    //如果不是复杂数据类型，直接返回
    return obj;
  }

  if (hash.has(obj as any)) {
    return hash.get(obj as any);
  }

  /**
   * 如果obj是数组， 那么 obj.constructor 是 [Function: Array]
   * 如果obj是对象， 那么 obj.constructor 是 [Function: Object]
   */

  const t = new (obj as any).constructor();
  hash.set(obj as any, t);
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      t[key] = deepClone(obj[key], hash);
    }
  }
  return t;
};

export const logout = () => {
  jsCookie.remove('token');
  localStorage.clear();
  TabModule.clear();
  MenuModule.clear();
  router.replace('Login');
};

export function camelToUnderLine(obj) {
  let newObj;
  if (Array.isArray(obj)) {
    newObj = [];
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i] === 'object' && obj[i]) {
        newObj[i] = camelToUnderLine(obj[i]);
      } else {
        newObj[i] = obj[i];
      }
    }
  } else {
    newObj = {};
    for (const key in obj) {
      const newKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      if (typeof obj[key] === 'object' && obj[key]) {
        newObj[newKey] = camelToUnderLine(obj[key]);
      } else {
        newObj[newKey] = obj[key];
      }
    }
  }
  return newObj;
}

export function underLineToCamel(obj) {
  let newObj;
  if (Array.isArray(obj)) {
    newObj = [];
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i] === 'object' && obj[i]) {
        newObj[i] = underLineToCamel(obj[i]);
      } else {
        newObj[i] = obj[i];
      }
    }
  } else {
    newObj = {};
    for (const key in obj) {
      const newKey = key.replace(/_(\w)/g, function(all, letter) {
        return letter.toUpperCase();
      });
      if (typeof obj[key] === 'object' && obj[key]) {
        newObj[newKey] = underLineToCamel(obj[key]);
      } else {
        newObj[newKey] = obj[key];
      }
    }
  }
  return newObj;
}
