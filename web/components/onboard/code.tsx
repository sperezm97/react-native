import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Linking,
  ScrollView as KeyboardAwareScrollView,
  ViewStyle,
} from 'react-native'
import { IconButton, ActivityIndicator } from 'react-native-paper'
import { decode as atob } from 'base-64'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'

import { useTheme } from 'store'
import { useStores } from 'stores'
import { DEFAULT_HOST } from 'config'
// import * as e2e from 'crypto/e2e'
import * as aes from '../../crypto/aes'
import * as rsa from '../../crypto/rsa'
import { isLN, parseLightningInvoice } from '../utils/ln'
import PIN, { setPinCode } from '../utils/pin'
import QR from '../common/Accessories/QR'
import PinCodeModal from '../common/Modals/PinCode'
import Typography from '../common/Typography'
import { SCREEN_HEIGHT } from '../../constants'
import { GradientBackground } from 'components/common'

type RouteParams = {
  Onboard: {
    codeType: 'invite' | 'backup'
  }
}

export const Code = (props) => {
  const { onBack, onDone, z } = props
  const onRestore = () => {
    console.log('Code onRestore - nothing to do here? maybe pinmodal')
    // user.finishOnboard() // clear out things
    //     ui.setSignedUp(true) // signed up w key export
    //     ui.setPinCodeModal(true) // also PIN has been set
  }
  const { user } = useStores()
  const theme = useTheme()
  const navigation = useNavigation()
  const route = useRoute<RouteProp<RouteParams, 'Onboard'>>()

  const [scanning, setScanning] = useState(false)
  const [code, setCode] = useState('')
  const [checking, setChecking] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [wrong, setWrong] = useState('')
  const [error, setError] = useState('')

  async function scan(data) {
    setCode(data)
    setScanning(false)
    setTimeout(() => {
      checkInvite(data)
    }, 333)
  }

  // from relay QR code
  async function signupWithIP(s) {
    const a = s.split('::')
    if (a.length === 1) return
    setChecking(true)
    const ip = a[1]
    const pwd = a.length > 2 ? a[2] : ''
    await user.signupWithIP(ip)
    await sleep(200)
    const token = await user.generateToken(pwd)

    if (token) {
      onDone()
    } else {
      setWrong('Cannot reach server...')
    }
    setChecking(false)
  }

  function detectCorrectString(s) {
    setWrong('')
    let correct = true
    if (s.length === 66 && s.match(/[0-9a-fA-F]+/g)) {
      setWrong("This looks like a pubkey, to sign up you'll need an invite code from:")
      correct = false
    }
    if (isLN(s)) {
      const inv = parseLightningInvoice(s)
      if (inv) {
        setWrong("This looks like an invoice, to sign up you'll need an invite code from:")
        correct = false
      }
    }
    setTimeout(() => setWrong(''), 10000)
    return correct
  }

  // sign up from invitation code (or restore)
  async function checkInvite(theCode) {
    if (!theCode || checking) return

    const correct = detectCorrectString(theCode)
    if (!correct) return

    setChecking(true)
    try {
      // atob decodes the code
      const codeString = atob(theCode)
      if (codeString.startsWith('keys::')) {
        setShowPin(true)

        return
      }
      if (codeString.startsWith('ip::')) {
        signupWithIP(codeString)
        return
      }
      user.reportError("Code Component - checkInvite function isn't keys or ip", { code: theCode })
    } catch (e) {
      user.reportError('Code component - checkInvite function - try catch of checking keys prefix', e)
    }

    const isCorrect = theCode.length === 40 && theCode.match(/[0-9a-fA-F]+/g)
    if (!isCorrect) {
      setWrong("We don't recognize this code, to sign up you'll need an invite code from:")
      setTimeout(() => setWrong(''), 10000)
      setChecking(false)
      return
    }

    console.tron.log('are we here')
    let theIP = user.currentIP
    let thePassword = ''
    if (!theIP) {
      const codeR = await user.signupWithCode(theCode)

      console.log('codeR', codeR)

      if (!codeR) {
        setChecking(false)
        return
      }
      const { ip, password } = codeR
      theIP = ip
      thePassword = password
    }
    await sleep(200)
    if (theIP) {
      const token = await user.generateToken(thePassword || '')
      if (token) {
        onDone()
      } else {
        setWrong('Cannot reach server...')
      }
    }
    setChecking(false)
  }

  async function pinEntered(pin) {
    // console.log('PIN ENTERED', pin)
    try {
      const restoreString = atob(code)

      if (restoreString.startsWith('keys::')) {
        const enc = restoreString.substr(6)
        // console.log('enc:', enc)
        const dec = await aes.decrypt(enc, pin)
        // const dec = await e2e.decrypt(enc, pin)
        // console.log('dec:', dec)

        if (dec) {
          await setPinCode(pin)
          const priv = await user.restore(dec as string)

          if (priv) {
            await rsa.setPrivateKey(priv)
            return onRestore()
          }
        } else {
          // wrong PIN
          setShowPin(false)
          setError('You entered a wrong pin')

          setChecking(false)
        }
      }
    } catch (error) {
      console.log(error)
      console.log(error.message)
      setError('You entered a wrong pin')
    }
  }

  return (
    <View style={{ ...styles.wrap, zIndex: z }} accessibilityLabel='onboard-code'>
      <GradientBackground colors={[theme.gradient, theme.gradient2]} />
      <IconButton
        icon='arrow-left'
        color={theme.grey}
        size={26}
        style={styles.backArrow}
        onPress={() => navigation.goBack()}
        accessibilityLabel='onboard-profile-back'
      />

      <KeyboardAwareScrollView contentContainerStyle={{ ...styles.content }} scrollEnabled={false}>
        <Typography
          style={{
            marginBottom: 40,
          }}
          size={48}
          color={theme.white}
          fw='600'
          lh={48}
        >
          Welcome
        </Typography>
        <Typography
          color={theme.white}
          size={20}
          textAlign='center'
          lh={29}
          style={{
            marginTop: 15,
            maxWidth: 240,
          }}
        >
          {`Paste the ${route.params?.codeType === 'invite' ? 'invitation' : 'backup'} key or scan the QR code`}
        </Typography>
        <View style={styles.inputWrap} accessibilityLabel='onboard-code-input-wrap'>
          <TextInput
            autoCorrect={false}
            accessibilityLabel='onboard-code-input'
            placeholder='Enter Code ...'
            style={{
              ...styles.input,
              backgroundColor: theme.white,
              borderColor: theme.white,
            }}
            placeholderTextColor={theme.greySecondary}
            value={code}
            onChangeText={(text) => setCode(text)}
            onBlur={() => checkInvite(code)}
            onFocus={() => {
              if (wrong) setWrong('')
            }}
          />
          <IconButton
            accessibilityLabel='onboard-code-qr-button'
            icon='qrcode-scan'
            color={theme.grey}
            size={28}
            style={{ position: 'absolute', right: 12, top: 38 }}
            onPress={() => setScanning(true)}
          />
        </View>
      </KeyboardAwareScrollView>

      <View style={styles.spinWrap}>{checking && <ActivityIndicator animating={true} color='white' />}</View>
      {(wrong ? true : false) && (
        <View
          style={{
            ...styles.message,
            ...styles.wrong,
            backgroundColor: theme.transparent,
          }}
        >
          <Typography style={styles.wrongText} color={theme.white} textAlign='center'>
            {wrong}
          </Typography>
          <TouchableOpacity onPress={() => Linking.openURL(DEFAULT_HOST)}>
            <Typography size={16} fw='500' color={theme.purple} textAlign='center'>
              {DEFAULT_HOST}
            </Typography>
          </TouchableOpacity>
        </View>
      )}
      {(error ? true : false) && (
        <View
          style={{
            ...styles.message,
            ...styles.error,
            backgroundColor: theme.transparent,
          }}
        >
          <Typography style={styles.errorText} color={theme.white} textAlign='center'>
            {error}
          </Typography>
        </View>
      )}

      {scanning && (
        <QR
          scannerH={SCREEN_HEIGHT - 60}
          visible={scanning}
          onCancel={() => setScanning(false)}
          onScan={(data) => scan(data)}
          showPaster={false}
        />
      )}
      <PinCodeModal visible={showPin}>
        <PIN
          forceEnterMode
          onFinish={async (pin) => {
            await sleep(240)
            pinEntered(pin)
          }}
        />
      </PinCodeModal>
    </View>
  )
}

const styles = {
  wrap: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100vh',
  } as ViewStyle,
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  } as ViewStyle,
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  } as ViewStyle,
  backArrow: {
    position: 'absolute',
    left: 15,
    top: 45,
    zIndex: 9000,
  } as ViewStyle,
  welcome: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
    marginTop: 48,
    lineHeight: 48,
  } as ViewStyle,
  input: {
    width: '100%',
    height: 70,
    borderRadius: 35,
    marginTop: 30,
    fontSize: 21,
    paddingLeft: 30,
    paddingRight: 65,
    marginBottom: 50,
  } as ViewStyle,
  inputWrap: {
    width: 320,
    maxWidth: '90%',
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
  } as ViewStyle,
  spinWrap: {
    height: 20,
  } as ViewStyle,
  message: {
    position: 'absolute',
    bottom: 32,
    width: '80%',
    left: '10%',
    borderRadius: 10,
  } as ViewStyle,
  wrong: {
    height: 150,
  } as ViewStyle,
  wrongText: {
    margin: 24,
  } as ViewStyle,
  error: {
    height: 70,
  } as ViewStyle,
  errorText: {
    margin: 24,
  } as ViewStyle,
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
