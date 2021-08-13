import React from 'react'
import { View } from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { Button, TextInput } from 'react-native-paper'

import Typography from '../../common/Typography'
import { useTheme } from '../../../store'

type FormValues = { video: string }

type FormTypes = {
  onSubmit: (values: FormValues) => void
}

const schema = Yup.object<FormValues>().shape({
  video: Yup
    .string()
    .required('Required')
    .matches(
      /^(https:\/\/rumble\.com\/.+)|(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/,
      'Rumble/Youtube link is incorrect'
    )
})

const Form: React.FC<FormTypes> = ({ onSubmit }) => {
  const theme = useTheme()

  return (
    <Formik
      initialValues={{ video: '' }}
      onSubmit={onSubmit}
      validationSchema={schema}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        isValid,
        dirty,
        setFieldValue
      }) => (
        <View style={{ padding: 15 }}>
          <View>
            <Typography size={14} color={theme.title}>
              Embed Video Link
            </Typography>
            <TextInput
              mode="flat"
              accessibilityLabel="form-input-video"
              error={!!errors.video}
              style={{
                height: 50,
                maxHeight: 50,
                backgroundColor: theme.bg,
              }}
              onChangeText={handleChange('video')}
              onBlur={handleBlur('video')}
              value={values.video}
              disabled
              placeholderTextColor={theme.placeholder}
              underlineColor={theme.border}
              textAlignVertical='auto'
              inputAccessoryViewID="video"
            />
            <Typography size={14} color={theme.danger} style={{ marginTop: 5 }}>
              {touched.video ? errors.video : ''}
            </Typography>
          </View>
          <View style={{ flexDirection:"row", marginTop: 25 }}>
            <Button
              mode="contained"
              accessibilityLabel="form-submit-button"
              onPress={async () => {
                const text = await Clipboard.getString()
                setFieldValue('video', text)
              }}
              style={{ borderRadius: 25, width: '48%' }}
              labelStyle={{
                fontSize: 14,
                fontWeight: '500',
                textTransform: 'uppercase',
              }}
              contentStyle={{ height: 45 }}
            >
              Paste Link
            </Button>
            <Button
              mode="contained"
              accessibilityLabel="form-submit-button"
              disabled={!isValid || !dirty || isSubmitting}
              onPress={handleSubmit}
              style={{ borderRadius: 25, marginLeft: '4%', width: '48%' }}
              labelStyle={{
                fontSize: 14,
                fontWeight: '500',
                textTransform: 'uppercase',
              }}
              contentStyle={{ height: 45 }}
            >
              Submit
            </Button>
          </View>
        </View>
      )}
    </Formik>
  )
}

export default Form;
