import 'react-native-gesture-handler'
import { AppRegistry, Platform, LogBox } from 'react-native'
import TrackPlayer from 'react-native-track-player'

import { App } from './app/app'
import { name as appName } from './app.json'

LogBox.ignoreLogs([
  'Require cycle:',
  '[mobx-react-lite] ',
  'o is not a function',
  'Found screens',
  "Can't perform",
  'Did not receive response to shouldStartLoad',
  'startLoadWithResult invoked with',
])

AppRegistry.registerComponent(appName, () => App)
TrackPlayer.registerPlaybackService(() => require('./src/components/Podcast/Service'))
