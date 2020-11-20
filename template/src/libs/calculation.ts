export const arithmeticAdd = function(
  num1: number,
  num2: number,
  n?: number
): number {
  // 两个浮点数求和
  let r1: number, r2: number;
  try {
    r1 = num1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = num2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  const m = Math.pow(10, Math.max(r1, r2));
  return n === undefined
    ? Math.round(num1 * m + num2 * m) / m
    : Number.parseFloat((Math.round(num1 * m + num2 * m) / m).toFixed(n));
};

export const arithmeticSub = function(
  num1: number,
  num2: number,
  n?: number
): number {
  // 两个浮点数求差
  let r1: number, r2: number;
  try {
    r1 = num1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = num2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  const m = Math.pow(10, Math.max(r1, r2));
  return n === undefined
    ? Math.round(num1 * m - num2 * m) / m
    : Number.parseFloat((Math.round(num1 * m - num2 * m) / m).toFixed(n));
};

export const arithmeticTim = function(
  num1: number,
  num2: number,
  n?: number
): number {
  //两数相乘
  let t1: number, t2: number;
  try {
    t1 = num1.toString().split('.')[1].length;
  } catch (e) {
    t1 = 0;
  }
  try {
    t2 = num2.toString().split('.')[1].length;
  } catch (e) {
    t2 = 0;
  }
  const r1 = Number(num1.toString().replace('.', ''));
  const r2 = Number(num2.toString().replace('.', ''));
  return n === undefined
    ? (r1 * r2) / Math.pow(10, t1 + t2)
    : Number.parseFloat(((r1 * r2) / Math.pow(10, t1 + t2)).toFixed(n));
};

export const arithmeticDiv = function(
  num1: number,
  num2: number,
  n?: number
): number {
  //两数相除
  let t1: number, t2: number;
  try {
    t1 = num1.toString().split('.')[1].length;
  } catch (e) {
    t1 = 0;
  }
  try {
    t2 = num2.toString().split('.')[1].length;
  } catch (e) {
    t2 = 0;
  }
  const r1 = Number(num1.toString().replace('.', ''));
  const r2 = Number(num2.toString().replace('.', ''));
  return n === undefined
    ? arithmeticTim(r1 / r2, Math.pow(10, t2 - t1))
    : arithmeticTim(r1 / r2, Math.pow(10, t2 - t1), n);
};

export const toFixed = function(num: number, length = 0): number {
  num = num * 10 ** length;
  return Math.round(num) / 10 ** length;
};
export const strip = function(num: number, precision: number): number {
  return toFixed(parseFloat(num.toPrecision(precision + 3)), precision);
};
export default {
  arithmeticAdd,
  arithmeticSub,
  arithmeticDiv,
  arithmeticTim,
  strip,
  toFixed
};
