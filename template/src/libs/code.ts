import api from '@/api';

export interface Code {
  name: string;
  code: string;
  color: string;
}
const flag = {};
const wait = {};
export const getCode = (code: string): Promise<Code[]> => {
  return new Promise(resolve => {
    const temp = localStorage[code];
    if (temp) {
      resolve(JSON.parse(temp));
    } else {
      if (flag[code]) {
        wait[code].push(() => {
          resolve(getCode(code));
        });
      } else {
        flag[code] = true;
        wait[code] = [];
        api
          .codeChildList({
            parentCode: code
          })
          .then(({ data }) => {
            const arr = data.map(item => {
              return {
                name: item.name,
                code: item.code,
                color: item.color
              };
            });
            localStorage[code] = JSON.stringify(arr);
            wait[code].forEach(cb => {
              cb();
            });
            flag[code] = false;
            resolve(arr);
          });
      }
    }
  });
};

export const getCodeValue = async (
  /**值集代码 */ code: string,
  /**值集id */ id?: string
): Promise<string> => {
  if (!id) return '';
  const arr: Code[] = await getCode(code);
  const val = arr.find(item => item.code === id);
  return val ? val.name : '';
};
export const getCodeValueAndColor = async (
  /**值集代码 */ code: string,
  /**值集id */ id?: string
): Promise<{
  name: string;
  color: string;
}> => {
  if (!id)
    return {
      name: '',
      color: '#000000'
    };
  const arr: Code[] = await getCode(code);
  const val = arr.find(item => item.code === id);
  return val
    ? {
        name: val.name,
        color: val.color || '#000000'
      }
    : {
        name: '',
        color: '#000000'
      };
};
