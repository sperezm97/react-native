import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Linking,
  Platform
} from 'react-native'
import { Title, IconButton, ActivityIndicator } from 'react-native-paper'
import RadialGradient from 'react-native-radial-gradient'
import { decode as atob } from 'base-64'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { useStores, useTheme } from '../../store'
import { DEFAULT_HOST } from '../../config'
import * as e2e from '../../crypto/e2e'
import * as rsa from '../../crypto/rsa'
import QR from '../common/Accessories/QR'
import PinCodeModal from '../common/Modals/PinCode'
import Typography from '../common/Typography'
import PIN, { setPinCode } from '../utils/pin'
import { isLN, parseLightningInvoice } from '../utils/ln'

export default function Code(props) {
  const { onDone, z, onRestore } = props
  const { user } = useStores()

  const [scanning, setScanning] = useState(false)
  const [code, setCode] = useState('')
  const [checking, setChecking] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [wrong, setWrong] = useState('')
  const [error, setError] = useState('')
  const theme = useTheme()

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
        setWrong(
          "This looks like an invoice, to sign up you'll need an invite code from:"
        )
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
    } catch (e) {}

    const isCorrect = theCode.length === 40 && theCode.match(/[0-9a-fA-F]+/g)
    if (!isCorrect) {
      setWrong(
        "We don't recognize this code, to sign up you'll need an invite code from:"
      )
      setTimeout(() => setWrong(''), 10000)
      setChecking(false)
      return
    }

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
    try {
      const restoreString = atob(code)

      if (restoreString.startsWith('keys::')) {
        const enc = restoreString.substr(6)
        const dec = await e2e.decrypt(enc, pin)

        if (dec) {
          await setPinCode(pin)
          const priv = await user.restore(dec)

          if (priv) {
            rsa.setPrivateKey(priv)
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
      setError('You entered a wrong pin')
    }
  }

  return (
    <View style={{ ...styles.wrap, zIndex: z }} accessibilityLabel='onboard-code'>
      <RadialGradient
        style={styles.gradient}
        colors={[theme.gradient, theme.gradient2]}
        stops={[0.1, 1]}
        center={[80, 40]}
        radius={400}
      >
        <KeyboardAwareScrollView contentContainerStyle={{ ...styles.content }}>
          <Title style={styles.welcome}>Welcome</Title>
          <Typography style={styles.msg} size={20} color={theme.white} lh={27}>
            Paste the invitation text or scan the QR code
          </Typography>
          <View style={styles.inputWrap} accessibilityLabel='onboard-code-input-wrap'>
            <TextInput
              autoCorrect={false}
              accessibilityLabel='onboard-code-input'
              placeholder='Enter Code ...'
              style={styles.input}
              value={code}
              onChangeText={text => setCode(text)}
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

        <View style={styles.spinWrap}>
          {checking && <ActivityIndicator animating={true} color='white' />}
        </View>
        {(wrong ? true : false) && (
          <View
            style={{
              ...styles.message,
              ...styles.wrong,
              backgroundColor: theme.transparent
            }}
          >
            <Typography style={styles.wrongText} color={theme.white}>
              {wrong}
            </Typography>
            <TouchableOpacity onPress={() => Linking.openURL(DEFAULT_HOST)}>
              <Typography style={styles.linkText} size={16} fw='500' color={theme.purple}>
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
              backgroundColor: theme.transparent
            }}
          >
            <Typography style={styles.errorText} color={theme.white}>
              {error}
            </Typography>
          </View>
        )}
      </RadialGradient>

      {scanning && (
        <QR
          visible={scanning}
          onCancel={() => setScanning(false)}
          onScan={data => scan(data)}
          showPaster={false}
        />
      )}
      <PinCodeModal visible={showPin}>
        <PIN
          forceEnterMode
          onFinish={async pin => {
            await sleep(240)
            pinEntered(pin)
          }}
        />
      </PinCodeModal>
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
  },
  welcome: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
    marginTop: 48,
    lineHeight: 48
  },
  msg: {
    color: 'white',
    fontSize: 20,
    marginTop: 15,
    maxWidth: 240,
    lineHeight: 29,
    textAlign: 'center'
  },
  input: {
    width: '100%',
    borderColor: 'white',
    backgroundColor: 'white',
    height: 70,
    borderRadius: 35,
    marginTop: 30,
    fontSize: 21,
    paddingLeft: 30,
    paddingRight: 65,
    marginBottom: 50
  },
  inputWrap: {
    width: 320,
    maxWidth: '90%',
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  spinWrap: {
    height: 20
  },
  message: {
    position: 'absolute',
    bottom: 32,
    width: '80%',
    left: '10%',
    borderRadius: 10
  },
  wrong: {
    height: 145
  },
  wrongText: {
    margin: 24,
    textAlign: 'center'
  },
  error: {
    height: 70
  },
  errorText: {
    margin: 24,
    textAlign: 'center'
  },
  linkText: {
    textAlign: 'center'
  }
})

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
