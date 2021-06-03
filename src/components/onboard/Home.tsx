import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import RadialGradient from 'react-native-radial-gradient'
import { useNavigation } from '@react-navigation/native'

import { useTheme } from '../../store'
import Typography from '../common/Typography'
import Button from '../common/Button'

export default function Home() {
  const theme = useTheme()
  const navigation = useNavigation()

  return (
    <View style={{ ...styles.wrap }} accessibilityLabel='onboard-code'>
      <RadialGradient
        style={styles.gradient}
        colors={[theme.orange, theme.orangeSecondary]}
        stops={[0.1, 1]}
        center={[80, 40]}
        radius={400}
      >
        <View style={styles.content}>
          <Typography
            style={{
              marginBottom: 40
            }}
            size={48}
            color={theme.white}
            fw='600'
            lh={48}
          >
            N2N2
          </Typography>

          <Button
            color={theme.orangeSecondary}
            w='60%'
            size='large'
            style={{
              borderWidth: 2,
              borderColor: theme.white
            }}
            onPress={() => navigation.navigate('Invite')}
          >
            <Typography color={theme.white} fw='700'>
              Request Invite
            </Typography>
          </Button>
          <Button
            fw='500'
            color={theme.lightGrey}
            w='40%'
            style={{ marginTop: 50 }}
            onPress={() => navigation.navigate('Onboard')}
          >
            I have a code
          </Button>
        </View>
      </RadialGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%'
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%'
  }
})
