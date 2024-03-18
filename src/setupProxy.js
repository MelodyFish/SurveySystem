const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    createProxyMiddleware('/survey', {
      // target: 'http://10.68.20.2:9141/',
      target: 'http://10.68.30.2:7901',
      changeOrigin: true,
      // pathRewrite: {
      //   '^/api': ''
      // }
    }),
    createProxyMiddleware('/user', {
      target: 'http://10.68.30.2:7901',
      changeOrigin: true,
      // pathRewrite: {
      //   '^/survey': ''
      // }
    })
  );
};
