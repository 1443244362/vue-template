// eslint-disable-next-line @typescript-eslint/no-var-requires
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
const isPro = process.env.NODE_ENV === 'production';
module.exports = {
  // publicPath: process.env.VUE_APP_ENV==='pro'?`/${process.env.VUE_APP_VERSION}/`:'/',
  // outputDir: `dist/${process.env.VUE_APP_VERSION}`,
  devServer: {
    disableHostCheck: true,
    port: 80,
    open: true,
    host: '0.0.0.0'
  },
  productionSourceMap: false,
  configureWebpack: config => {
    if (isPro) {
      config.plugins.push(
        new CompressionWebpackPlugin({
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8
        })
      );
    }
  }
};
