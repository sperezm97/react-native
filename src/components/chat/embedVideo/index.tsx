import React from 'react'
import { Modalize } from 'react-native-modalize'
import { Portal } from 'react-native-portalize'
import { useKeyboard } from '@react-native-community/hooks'
import { useTheme } from '../../../store'
import { EmbedVideoProps } from './type'
import Header from './header'
import Footer from './footer'
import Form from '../../form'
import * as schemas from '../../form/schemas'

const EmbedVideo = React.forwardRef<Modalize | null, EmbedVideoProps>(({
  onSendEmbedVideo,
}, embedVideoModalRef) => {
  const { keyboardHeight, keyboardShown } = useKeyboard();
  const modalHeight = keyboardShown ? keyboardHeight + 350 : keyboardHeight + 10;
  const theme = useTheme();

  return (
    <Portal>
      <Modalize
        ref={embedVideoModalRef}
        modalHeight={Math.max(modalHeight, 450)}
        HeaderComponent={Header}
        FooterComponent={Footer}
        modalStyle={{ backgroundColor: theme.main }}
      >
        <Form
          schema={schemas.embedVideo}
          buttonText='Send Video'
          initialValues={{ video: '' }}
          onSubmit={onSendEmbedVideo}
        />
      </Modalize>
    </Portal>
  )
})

export default EmbedVideo
