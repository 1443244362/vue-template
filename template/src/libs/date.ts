const formatNumber = (num: number) => {
  const str = num.toString();
  return str[1] ? str : '0' + str;
};

/**时间字符串 */
export const formatTime = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  );
};
/**文件格式的时间字符串 */
export const formatFileTime = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join('-') +
    '-' +
    [hour, minute, second].map(formatNumber).join('-')
  );
};

/**当天0点 */
export const getTodayStart = (date: Date | string) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  return date;
};
/**当天23:59:59 */
export const getTodayEnd = (date: Date | string) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  date.setHours(23);
  date.setMinutes(59);
  date.setSeconds(59);
  return date;
};
