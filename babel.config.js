module.exports = function (api) {
  api.cache(true)
  const config = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [require('@babel/plugin-proposal-decorators'), { legacy: true }],
      'react-native-reanimated/plugin',
      // [
      //   'module-resolver',
      //   {
      //     root: ['./src'],
      //     alias: {
      //       animations: './src/animations',
      //       api: './src/api',
      //       assets: './src/assets',
      //       components: './src/components',
      //       config: './src/config',
      //       crypto: './src/crypto',
      //       hooks: './src/hooks',
      //       services: './src/services',
      //       store: './src/store',
      //       theme: './src/theme',
      //       types: './src/types',
      //     },
      //   },
      // ],
    ],
  }

  if (getEnv() !== 'development') {
    config.plugins.push(['transform-remove-console'])
  }

  return config
}

function getEnv(defaultValue = 'development') {
  return process.env.BABEL_ENV || process.env.NODE_ENV || defaultValue
}
