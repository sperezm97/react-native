module.exports = function (api) {
  api.cache(true)
  const config = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [require('@babel/plugin-proposal-decorators'), { legacy: true }],
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            animations: './src/animations',
            api: './src/api',
            app: './app',
            assets: './src/assets',
            components: './src/components',
            constants: './app/constants',
            config: './src/config',
            crypto: './src/crypto',
            hooks: './src/hooks',
            lib: './app/lib',
            navigation: './app/navigation',
            services: './src/services',
            store: './app/store',
            theme: './src/theme',
            types: './app/types',
            views: './app/views',
          },
        },
      ],
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
