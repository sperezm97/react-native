import React, { useRef, useState } from 'react'
import { useObserver } from 'mobx-react-lite'
import { StyleSheet } from 'react-native'
import Video from 'react-native-video'

import { SCREEN_HEIGHT } from '../../constants'
import { View } from 'react-native'
import Button from '../common/Button'
import Typography from '../common/Typography'
import { useTheme } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default function SuggestToUserToBackupTheirKeys({ onDone, z, isTheMainRender }) {
	const [isVideoFinished, setIsVideoFinished] = useState(false)
	const theme = useTheme()
	const network = require('../../assets/videos/back-up-keys.mov')

	const videoRef = useRef(null)

	return useObserver(() => {
		if(!isTheMainRender) return null
		return (
		<View style={{ zIndex: z }}>
			<Video
				source={network}
				resizeMode='cover'
				ref={videoPlayer => videoRef.current = videoPlayer}
				onEnd={() => setIsVideoFinished(true)}
				style={{
					height: SCREEN_HEIGHT
				}}
			/>
			<View style={styles.buttonWrap}>
				<Button
					accessibilityLabel='onboard-name-button'
					onPress={onDone}
					disabled={!isVideoFinished}
					style={{ ...styles.button }}
					w={150}
					size='large'
					color={theme.colors.primary}
				>
					<Typography color={'white'}>Next</Typography>
				</Button>
				<Button
					accessibilityLabel='onboard-name-button'
					style={{marginRight: 10}}
					onPress={() => videoRef.current && videoRef.current.seek(0)}
					disabled={false}
					w={32}
					color={theme.colors.primary}
				>
					<Icon name='repeat' color={'white'} size={32} />
				</Button>
			</View>
		</View>
	)})
}


const styles = StyleSheet.create({
	buttonWrap: {
		position: 'absolute',
		bottom: 42,
		width: '100%',
		display: 'flex',
		flexDirection: 'row-reverse'
	},
	button: {
		marginRight: '12.5%'
	}
})