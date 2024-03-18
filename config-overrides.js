const {
  override,
  addWebpackAlias,
  addLessLoader,
  fixBabelImports,
  adjustStyleLoaders
} = require("customize-cra");
const path = require("path");

module.exports = override(
  // 配置路径别名
  addWebpackAlias({
    assets: path.resolve(__dirname, "./src/assets"),
    components: path.resolve(__dirname, "./src/components"),
    pages: path.resolve(__dirname, "./src/pages"),
    utils: path.resolve(__dirname, "./src/utils"),
    src: path.resolve(__dirname, "./src")
  }),
  // lessloader配置
  addLessLoader({
    lessOptions: {
      // 可以使用index.module.less
      javascriptEnabled: true,
    },
  }),
  // ***解决PostCSS Loader has been initialized using an options object that does not match the API schema. 报错
  adjustStyleLoaders(({ use: [, , postcss] }) => {
    const postcssOptions = postcss.options;
    postcss.options = { postcssOptions };
  }),
  // antd 样式导入，配置后无需在代码中自己再引入 import 'antd/dist/antd.min.css';
  // fixBabelImports("import", {
  //   libraryName: "antd",
  //   libraryDirectory: "es",
  //   style: "css",
  // })
);