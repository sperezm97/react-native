import React, { FC } from 'react'
import {
  Image,
  ImageStyle,
  SafeAreaView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { observer } from 'mobx-react-lite'
import LinearGradient from 'react-native-linear-gradient'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { config, useSpring, animated } from '@react-spring/native'
// import { useStores } from 'stores'
import { GradientBackground, Screen } from 'views/shared'

export const HomeScreen: FC<{}> = observer(() => {
  // const { relayStore } = useStores()
  const placeholder = () => alert('Testing new home screen')
  const props = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 250,
    config: config.molasses,
  })
  const props2 = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 500,
    config: config.molasses,
  })
  const props3 = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 1500 })
  const props4 = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 1750 })
  const AnimatedView = animated(View) as any

  return (
    <View style={FULL}>
      <GradientBackground colors={['#F7F6F9', '#F7F6F9']} />
      <Screen
        style={CONTAINER}
        preset='fixed'
        backgroundColor='transparent'
        statusBar='dark-content'
        unsafe={true}
      >
        <AnimatedView style={props}>
          <Image source={zionLogo} style={LOGO} />
        </AnimatedView>
        <AnimatedView style={props2}>
          <Text style={headline}>Create Openly.</Text>
        </AnimatedView>
        <TouchableOpacity style={styles.button} onPress={placeholder}>
          <AnimatedView style={{ ...container2, ...props3 }}>
            <LinearGradient
              colors={['#988DDD', '#6A5CC6']}
              style={{
                ...styles.gradient,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ ...styles.text, textAlign: 'center', marginLeft: 10 }}>
                  Get Started
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: '#F7F6F9',
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  marginRight: 5,

                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name='arrow-forward' size={34} color='#8378D0' />
              </View>
            </LinearGradient>
          </AnimatedView>
        </TouchableOpacity>
        <TouchableOpacity style={{ ...styles.button, marginTop: 32 }} onPress={placeholder}>
          <AnimatedView style={{ ...container2, ...props4, shadowOpacity: 0.3 }}>
            <LinearGradient
              colors={['#fff', '#fefefe']}
              style={{ ...styles.gradient, flexDirection: 'row' }}
            >
              <Ionicons name='play-circle' size={28} color='#8378D0' style={{ marginRight: 8 }} />
              <Text style={{ ...styles.text, color: '#8378D0' }}>Play Video</Text>
            </LinearGradient>
          </AnimatedView>
        </TouchableOpacity>
      </Screen>
    </View>
  )
})

const headline: TextStyle = {
  fontSize: 36,
  fontFamily: 'ProximaNova-Regular',
  paddingBottom: 55,
}

const container2: ViewStyle = {
  shadowColor: '#6A5CC6',
  shadowRadius: 11,
  shadowOffset: {
    width: 1,
    height: 1,
  },
  shadowOpacity: 0.8,
  flex: 1,
}

const LOGO: ImageStyle = {
  alignSelf: 'center',
  marginVertical: 50,
  maxWidth: '100%',
  width: 440,
  height: 380,
  resizeMode: 'contain',
}

const zionLogo = require('./chat.png')

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: 'transparent',
  paddingHorizontal: 20,
  // justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  button: {
    width: '70%',
    height: 80,
  },
  text: {
    color: 'white',
    fontSize: 22,
    marginVertical: 10,
    fontWeight: 'bold',
    fontFamily: 'ProximaNova-Regular',
  },
})
