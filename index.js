import 'react-native-gesture-handler'
import { AppRegistry, Platform, LogBox } from 'react-native'
import TrackPlayer from 'react-native-track-player'

import App from './App'
import { name as appName } from './app.json'

LogBox.ignoreLogs(['Require cycle:', '[mobx-react-lite] ', 'o is not a function', 'Found screens', "Can't perform"])

AppRegistry.registerComponent(appName, () => App)
TrackPlayer.registerPlaybackService(() => require('./src/components/Podcast/Service'))

// TrackPlayer.registerPlaybackService(() => require('./src/trackPlayer.js'));

if (Platform.OS === 'web') {
  const rootTag = document.getElementById('root') || document.getElementById('main')
  AppRegistry.runApplication(appName, { rootTag })
}
