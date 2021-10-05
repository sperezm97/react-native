import React from 'react'
import moment from 'moment'
import AsyncStorage from '@react-native-community/async-storage'
import { Text, StyleSheet, TouchableOpacity, Linking, View } from 'react-native'

import { Dialog, Button } from 'react-native-paper'
import { useTheme } from 'store'
import { DEFAULT_HOST } from '../config'

const HOURS = 12 // 0.001

export function VersionDialog({ showVersionDialog, onCloseVersionDialog }) {
  const theme = useTheme()
  return (
    <Dialog visible={showVersionDialog} style={{ bottom: 10 }} onDismiss={onCloseVersionDialog}>
      <Dialog.Title>App Version</Dialog.Title>
      <Dialog.Actions
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Text style={{ color: theme.title, padding: 12 }}>
          Your app version is outdated. Please update!
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL(DEFAULT_HOST)} style={styles.linkWrap}>
          <Text style={styles.linkText}>{DEFAULT_HOST}</Text>
        </TouchableOpacity>
        <View style={styles.buttonWrap}>
          <Button
            icon='check'
            onPress={onCloseVersionDialog}
            style={{ width: 100, alignItems: 'flex-end' }}
            accessibilityLabel='app-version-ok-button'
          >
            OK
          </Button>
        </View>
      </Dialog.Actions>
    </Dialog>
  )
}

const styles = StyleSheet.create({
  linkWrap: {
    padding: 12,
  },
  linkText: {
    color: '#6289FD',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
  },
  buttonWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    padding: 12,
  },
})

export async function wasCheckedRecently(): Promise<boolean> {
  const now = moment().unix()
  const enteredAtStr = await AsyncStorage.getItem('version_checked')
  const enteredAt = enteredAtStr ? parseInt(enteredAtStr) : 0

  if (!enteredAt) {
    return false
  }
  if (now < enteredAt + 60 * 60 * HOURS) {
    // 12 hours
    return true
  }
  return false
}
