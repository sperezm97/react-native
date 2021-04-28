import React, { useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import { useTheme, hooks } from '../../../../store'
import { useOwnerMsgsType } from '../../../../store/hooks/msg'
import { SCREEN_WIDTH } from '../../../../constants'
import MediaItem from './MediaItem'
import Empty from '../../../common/Empty'
import Typography from '../../../common/Typography'
import PhotoViewer from '../../../common/Modals/Media/PhotoViewer'

const { useMsgs } = hooks

function Media({ tribe }) {
  const [mediaModal, setMediaModal] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState(null)
  const theme = useTheme()

  return useObserver(() => {
    const msgs = useMsgs(tribe.chat) || []
    const mediaMsgs = useOwnerMsgsType(msgs, 6)

    function onMediaPress(id) {
      setSelectedMedia(id)
      setMediaModal(true)
    }

    return (
      <>
        <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
          <View style={{ ...styles.mediaContainer }}>
            {mediaMsgs.length > 0 ? (
              mediaMsgs.map((m, index) => {
                return (
                  <MediaItem
                    key={m.id}
                    id={m.id}
                    index={index}
                    {...m}
                    onMediaPress={onMediaPress}
                  />
                )
                // return useMemo(() => <MediaItem key={m.id} {...m} />, [
                //   m.id,
                //   m.type,
                //   m.media_token,
                //   m.status,
                //   m.sold,
                //   m.boosts_total_sats
                // ])
              })
            ) : (
              <Empty h={200} w='60%'>
                {tribe.owner ? (
                  <View style={{ ...styles.empty }}>
                    <MaterialIcon
                      name='plus-circle-multiple-outline'
                      color={theme.icon}
                      size={60}
                    />
                    <Typography
                      size={17}
                      fw='500'
                      style={{ marginTop: 10, marginBottom: 10 }}
                    >
                      Share Photos
                    </Typography>
                    <Typography size={14} color={theme.subtitle}>
                      When you share photos to the community, they will appear on your
                      community profile.
                    </Typography>
                  </View>
                ) : (
                  <View style={{ ...styles.empty }}>
                    <Typography
                      size={17}
                      fw='500'
                      style={{ marginTop: 10, marginBottom: 10 }}
                    >
                      {`No content in ${tribe.name}`}
                    </Typography>
                    <Typography size={14} color={theme.subtitle}>
                      Owner hasn't shared any content yet.
                    </Typography>
                  </View>
                )}
              </Empty>
            )}
          </View>
          <PhotoViewer
            visible={mediaModal}
            close={() => setMediaModal(false)}
            photos={mediaMsgs}
            photoId={selectedMedia}
          />
        </View>
      </>
    )
  })
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: SCREEN_WIDTH,
    paddingVertical: 1
  },
  empty: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    marginRight: 'auto',
    marginLeft: 'auto'
  }
})

export default React.memo(Media)
