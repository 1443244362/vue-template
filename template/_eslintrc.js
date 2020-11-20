module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'development' ? 'off' : 'error',
    'no-debugger': process.env.NODE_ENV === 'development' ? 'off' : 'error',
    eqeqeq: 'error',
    '@typescript-eslint/no-explicit-any': 'off'
  },
  globals: {
    arithmeticAdd: true,
    arithmeticSub: true,
    arithmeticDiv: true,
    arithmeticTim: true,
    strip: true,
    toFixed: true
  }
};
