import axios from 'axios';
import { Message } from 'element-ui';
import { apiUrl } from '@/config/env';
import jsCookie from 'js-cookie';
import system from './system';
import { camelToUnderLine, logout, underLineToCamel } from '@/libs/utils';
export const recsteelInterface = (
  url: string,
  data: AnyObj,
  method: methodType
): any => {
  return new Promise((resolve, reject) => {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        if (data[key] === null || data[key] === undefined) {
          data[key] = '';
        }
        if (typeof data[key] === 'string') {
          data[key] = data[key].trim();
        }
      }
    }
    data = camelToUnderLine(data);
    if (method === 'get') {
      url += '?';
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          url += key + '=' + data[key] + '&';
        }
      }
      url = url.substring(0, url.length - 1);
    }
    axios({
      url: apiUrl + url,
      data,
      method,
      headers: {
        Authorization: jsCookie.get('token')
      }
    })
      .then(({ data: res }) => {
        if (res.success === false) {
          if (res.message) {
            Message.error(res.message);
          } else {
            Message.error('系统错误');
          }
          const logoutCodeArr = ['401'];
          if (logoutCodeArr.includes(res.code)) {
            logout();
          }
          reject(res);
        } else {
          resolve(underLineToCamel(res));
        }
      })
      .catch(res => {
        reject(res);
      });
  });
};

export const api = {
  ...system
};
export default api;
