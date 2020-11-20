const fs = require('fs');
const { setTimeout } = require('timers');
module.exports = (api, options, rootOptions) => {
  api.extendPackage({
    scripts: {
      'build-test': 'cross-env INTERFACE_ENV=test vue-cli-service build',
      'build-formal': 'cross-env INTERFACE_ENV=formal vue-cli-service build',
    },
    dependencies: {
      '@types/animejs': '^3.1.1',
      animejs: '^3.2.0',
      '@types/js-cookie': '^2.2.6',
      'ali-oss': '^6.10.0',
      axios: '^0.19.2',
      'compression-webpack-plugin': '^4.0.0',
      'core-js': '^3.6.5',
      'element-ui': '^2.13.2',
      'js-cookie': '^2.2.1',
      vue: '^2.6.11',
      'vue-class-component': '^7.2.5',
      'vue-property-decorator': '^9.0.0',
      'vue-router': '^3.2.0',
      vuex: '^3.4.0',
    },
    devDependencies: {
      '@typescript-eslint/eslint-plugin': '^2.33.0',
      '@typescript-eslint/parser': '^2.33.0',
      '@vue/cli-plugin-babel': '^4.4.0',
      '@vue/cli-plugin-eslint': '^4.4.0',
      '@vue/cli-plugin-typescript': '^4.4.0',
      '@vue/cli-service': '^4.4.0',
      '@vue/eslint-config-prettier': '^6.0.0',
      '@vue/eslint-config-typescript': '^5.0.2',
      'cross-env': '^7.0.2',
      eslint: '^6.7.2',
      'eslint-plugin-prettier': '^3.1.3',
      'eslint-plugin-vue': '^6.2.2',
      prettier: '^1.19.1',
      sass: '^1.26.5',
      'sass-loader': '^8.0.2',
      typescript: '~3.9.3',
      'vue-template-compiler': '^2.6.11',
      'vuex-module-decorators': '^0.17.0',
    },
  });

  api.render('./template');
  api.render((files) => {
    Reflect.deleteProperty(files, 'src/views/layout.vue');
    Reflect.deleteProperty(files, 'src/views/Home.vue');
    Reflect.deleteProperty(files, 'src/views/About.vue');
    Reflect.deleteProperty(files, 'src/assets/logo.png');
  });
};
