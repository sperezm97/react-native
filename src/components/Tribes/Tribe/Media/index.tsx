import React, { useState, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import { useTheme, hooks } from '../../../../store'
import { useOwnerMediaType } from '../../../../store/hooks/tribes'
import { SCREEN_WIDTH } from '../../../../constants'
import MediaItem from './MediaItem'
import Icon from '../../../common/Icon'
import Empty from '../../../common/Empty'
import Typography from '../../../common/Typography'
import PhotoViewer from '../../../common/Modals/Media/PhotoViewer'

const { useMsgs } = hooks

function Media({ tribe }) {
  const [mediaModal, setMediaModal] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState(null)
  const theme = useTheme()

  function onMediaPress(id) {
    setSelectedMedia(id)
    setMediaModal(true)
  }

  return useObserver(() => {
    const msgs = useMsgs(tribe.chat) || []
    const media = useOwnerMediaType(msgs, 6, tribe.owner)

    return (
      <>
        <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
          <View style={{ ...styles.mediaContainer }}>
            {media.length > 0 ? (
              media.map((m, index) => {
                return (
                  <MediaItem
                    key={m.id}
                    id={m.id}
                    index={index}
                    {...m}
                    chat={tribe.chat}
                    onMediaPress={onMediaPress}
                  />
                )
              })
            ) : (
              <Empty h={200}>
                {tribe.owner ? (
                  <View style={{ ...styles.empty }}>
                    <MaterialIcon
                      name='plus-circle-multiple-outline'
                      color={theme.iconPrimary}
                      size={50}
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
                    {!tribe.joined ? (
                      <Icon name='Join' size={70} />
                    ) : (
                      <Icon name='Empty' size={70} />
                    )}
                    <Typography
                      size={14}
                      fw='500'
                      color={theme.subtitle}
                      style={{ marginTop: 10, marginBottom: 10 }}
                    >
                      {!tribe.joined
                        ? `Join ${
                            tribe.name
                          } to see what ${tribe.owner_alias?.trim()} has shared.`
                        : `${tribe.owner_alias?.trim()} has not shared content yet!`}
                    </Typography>
                  </View>
                )}
              </Empty>
            )}
          </View>
          <PhotoViewer
            visible={mediaModal}
            close={() => setMediaModal(false)}
            photos={media && media.filter(m => m.id === selectedMedia)}
            // initialIndex={media && media.findIndex(m => m.id === selectedMedia)}
            initialIndex={0}
            chat={tribe.chat}
          />
        </View>
      </>
    )
  })
}

function Viewer(props) {
  return useMemo(() => <PhotoViewer {...props} />, [props.visible])
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
    paddingHorizontal: 14,
    marginRight: 'auto',
    marginLeft: 'auto'
  }
})

export default React.memo(Media)
