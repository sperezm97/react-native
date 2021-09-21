const {
  override,
  babelInclude,
  addDecoratorsLegacy,
  disableEsLint,
  removeModuleScopePlugin,
  addWebpackExternals,
  addWebpackAlias,
  addBabelPlugin,
  addWebpackPlugin,
} = require('customize-cra')
// const cspHtmlWebpackPlugin = require('csp-html-webpack-plugin')
const path = require('path')

const cspConfigPolicy = {
  'default-src': "'none'",
  'base-uri': "'self'",
  'object-src': "'none'",
  'script-src': ["'self'"],
  'style-src': ["'self'"],
}

module.exports = override(
  // addWebpackPlugin(new cspHtmlWebpackPlugin(cspConfigPolicy)),
  removeModuleScopePlugin(),
  addDecoratorsLegacy(),
  disableEsLint(),
  babelInclude([
    path.resolve('src'),
    path.resolve('web'),
    path.resolve('node_modules/@ovaeasy/react-native-vector-icons'),
    path.resolve('node_modules/expo-linear-gradient'),
    path.resolve('node_modules/react-native-animatable'),
    path.resolve('node_modules/react-native-paper'),
    path.resolve('node_modules/rn-fetch-blob'),
    // path.resolve('node_modules/react-native-camera'),
  ]),
  addBabelPlugin('@babel/plugin-proposal-class-properties'),
  addBabelPlugin('inline-react-svg'),
  addWebpackExternals({
    realm: 'RealmStub',
  }),
  addWebpackAlias({
    ['react-native$']: 'react-native-web',
    // https://github.com/expo/expo/issues/9999#issuecomment-787382615
    ['react-native-web/src']: 'react-native-web/dist',
    ['react-native-vector-icons']: '@ovaeasy/react-native-vector-icons',
    ['animations']: path.resolve(__dirname, './src/animations'),
    ['api']: path.resolve(__dirname, './src/api'),
    ['assets']: path.resolve(__dirname, './src/assets'),
    ['components']: path.resolve(__dirname, './web/components'),
    ['config']: path.resolve(__dirname, './src/config'),
    ['crypto']: path.resolve(__dirname, './src/crypto'),
    ['hooks']: path.resolve(__dirname, './src/hooks'),
    ['i18n']: path.resolve(__dirname, './web/i18n'),
    ['lib']: path.resolve(__dirname, './src/lib'),
    ['navigation']: path.resolve(__dirname, './web/navigation'),
    ['services']: path.resolve(__dirname, './web/services'),
    ['store']: path.resolve(__dirname, './src/store'),
    ['stores']: path.resolve(__dirname, './web/stores'),
    ['theme']: path.resolve(__dirname, './web/theme2'),
    ['types']: path.resolve(__dirname, './src/types'),
  })
)

// const path = require('path');
// const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

// module.exports = {
//     webpack: override(
//         addDecoratorsLegacy(),
//         disableEsLint(),
//         removeModuleScopePlugin(),
//     ),
//     paths: function (paths, env) {
//         paths.appIndexJs = path.resolve(__dirname, 'web/index.tsx');
//         paths.appSrc = path.resolve(__dirname, 'web');
//         return paths;
//     },
// }
