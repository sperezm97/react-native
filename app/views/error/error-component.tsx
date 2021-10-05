import React, { ErrorInfo } from 'react'
import { TextStyle, View, ViewStyle, ScrollView, ImageStyle } from 'react-native'
// import { color } from '../../theme'
import Button from 'components/common/Button'
import Icon from 'components/common/Icon'
import Text from 'components/common/Typography'

const CONTAINER: ViewStyle = {
  alignItems: 'center',
  flex: 1,
  padding: 16,
  paddingVertical: 50,
  backgroundColor: 'white',
}

const ERROR_DETAILS_CONTAINER: ViewStyle = {
  width: '100%',
  maxHeight: '60%',
  backgroundColor: 'red',
  marginVertical: 15,
  paddingHorizontal: 10,
  paddingBottom: 15,
  borderRadius: 6,
}

const BTN_RESET: ViewStyle = {
  paddingHorizontal: 40,

  backgroundColor: 'blue',
}

const TITLE_ERROR: TextStyle = {
  color: 'red',
  fontWeight: 'bold',
  paddingVertical: 15,
}

const FRIENDLY_SUBTITLE: TextStyle = {
  color: 'black',
  fontWeight: 'normal',
  paddingVertical: 15,
}

const CONTENT_ERROR: TextStyle = {
  color: 'red',
  fontWeight: 'bold',
  paddingVertical: 15,
}

// Uncomment this and the Text component in the ErrorComponent if
// you want to see a backtrace in your error reporting screen.
const CONTENT_BACKTRACE: TextStyle = {
  color: 'red',
}

const ICON: ImageStyle = {
  marginTop: 30,
  width: 64,
  height: 64,
}

export interface ErrorComponentProps {
  error: Error
  errorInfo: ErrorInfo
  onReset(): void
}

/**
 * Describe your component here
 */
export const ErrorComponent = (props: ErrorComponentProps) => {
  console.log(props)
  return (
    <View style={CONTAINER}>
      <Text style={TITLE_ERROR} text='App error :(' />
      <Text
        style={FRIENDLY_SUBTITLE}
        text='Please alert the developers so we can fix it right away!'
      />
      <Text
        style={FRIENDLY_SUBTITLE}
        text='You may be able to get around this by closing and reopening your app.'
      />
      <View style={ERROR_DETAILS_CONTAINER}>
        <ScrollView>
          <Text selectable style={CONTENT_ERROR} text={`${props.error}`} />
          <Text selectable style={CONTENT_BACKTRACE} text={`${props.errorInfo.componentStack}`} />
        </ScrollView>
      </View>
      <Button style={BTN_RESET} onPress={props.onReset} tx='errorScreen.reset' />
    </View>
  )
}
