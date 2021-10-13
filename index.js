import 'react-native-gesture-handler'
import { AppRegistry, Platform, LogBox, NativeModules } from 'react-native'
import TrackPlayer from 'react-native-track-player'

import App from './App'
import { name as appName } from './app.json'

// if (__DEV__) {
//   NativeModules.DevSettings.setIsDebuggingRemotely(true)
// }

LogBox.ignoreLogs(['Require cycle:', "Can't perform a React"])

AppRegistry.registerComponent(appName, () => App)
TrackPlayer.registerPlaybackService(() => require('./src/components/Podcast/Service'))

// TrackPlayer.registerPlaybackService(() => require('./src/trackPlayer.js'));

if (Platform.OS === 'web') {
  const rootTag = document.getElementById('root') || document.getElementById('main')
  AppRegistry.runApplication(appName, { rootTag })
}
