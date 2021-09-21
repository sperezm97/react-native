import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from 'store'
import Typography from '../common/Typography'
import Button from '../common/Button'
import { GradientBackground } from 'components/common'

export const Home = () => {
  const theme = useTheme()
  const navigation = useNavigation()

  return (
    <View style={{ ...styles.wrap, height: '100vh' }} accessibilityLabel='onboard-code'>
      <GradientBackground colors={[theme.orange, theme.orangeSecondary]} />
      <View style={styles.content}>
        <View
          style={{
            backgroundColor: theme.transparent,
            paddingHorizontal: 30,
            borderRadius: 30,
            marginBottom: 45,
          }}
        >
          <Image
            source={require('../../assets/zion-dark-theme.png')}
            style={{ width: 140, height: 100 }}
            resizeMode={'contain'}
          />
        </View>
        <View style={{ width: 500, justifyContent: 'center', alignItems: 'center' }}>
          <Button
            color={theme.orangeSecondary}
            w='70%'
            size='large'
            style={{
              borderWidth: 2,
              borderColor: theme.white,
            }}
            onPress={() => navigation.navigate('Invite' as never)}
          >
            <Typography color={theme.white} fw='700'>
              Subscribe to the waitlist
            </Typography>
          </Button>
          <Button
            fw='500'
            color={theme.lightGrey}
            w='70%'
            style={{ marginTop: 15 }}
            onPress={() => navigation.navigate('Code' as never, { codeType: 'invite' } as never)}
          >
            I have an invite code
          </Button>
          <Button
            fw='500'
            color={theme.lightGrey}
            w='70%'
            style={{ marginTop: 15 }}
            onPress={() => navigation.navigate('Code' as never, { codeType: 'backup' } as never)}
          >
            I have a backup code
          </Button>
        </View>
      </View>
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
    bottom: 0,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  imageWrapper: {
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 45,
  },
})
