import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'

import { useStores, useTheme, hooks } from '../../../store'
import { useTribeHistory } from '../../../store/hooks/tribes'
import Typography from '../../common/Typography'
import Button from '../../common/Button'
import BoxHeader from '../../common/Layout/BoxHeader'
import Empty from '../../common/Empty'
import DialogWrap from '../../common/Dialogs/DialogWrap'
import TribeTags from './TribeTags'

const { useTribes } = hooks

function About({ tribe }) {
  const theme = useTheme()

  return useObserver(() => {
    const { createdDate, lastActiveDate } = useTribeHistory(
      tribe.created,
      tribe.last_active
    )

    return (
      <>
        <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
          <Typography size={16} fw='500' style={{ marginBottom: 8 }}>
            Description
          </Typography>

          <Typography size={14} color={theme.darkGrey} style={{ marginBottom: 26 }}>
            {tribe.description}
          </Typography>

          <View style={{ ...styles.description }}>
            <MaterialIcon name='access-time' size={26} color={theme.grey} />
            <View style={{ ...styles.dContent }}>
              <Typography size={18} style={{ marginBottom: 6 }}>
                History
              </Typography>
              <Typography size={13} color={theme.darkGrey}>
                Tribe created on {createdDate}. Last Active {lastActiveDate}
              </Typography>
            </View>
          </View>

          <View style={{ ...styles.description, marginBottom: 40 }}>
            <FontAwesome5Icon name='coins' size={26} color={theme.yellow} />
            <View style={{ ...styles.dContent }}>
              <Typography size={18} style={{ marginBottom: 6 }}>
                Prices
              </Typography>
              <Typography size={13} color={theme.darkGrey} style={{ marginBottom: 6 }}>
                Price per message {tribe?.price_per_message}.
              </Typography>
              <Typography size={13} color={theme.darkGrey}>
                Price to join {tribe?.name} {tribe?.price_to_join}.
              </Typography>
            </View>
          </View>
          <Tags theTribe={tribe} />
        </View>
      </>
    )
  })
}

function Tags(props) {
  const { chats } = useStores()
  const { theTribe } = props
  const [topicsEditDialog, setTopicsEditDialog] = useState(false)

  async function finish(tags) {
    theTribe.tags = tags
    await chats.editTribe({
      ...theTribe,
      id: theTribe.chat.id
    })

    chats.getTribes()
    setTopicsEditDialog(false)
  }

  return useObserver(() => {
    const tribes = useTribes()
    const tribe = tribes.find(t => t.uuid === theTribe.uuid) || theTribe

    return (
      <>
        {tribe.owner ? (
          <>
            <BoxHeader title='Topics in this Community'>
              <Button mode='text' onPress={() => setTopicsEditDialog(true)} size='small'>
                Edit
              </Button>
            </BoxHeader>
            <>
              {tribe.tags.length > 0 ? (
                <TribeTags
                  tags={tribe.tags}
                  displayOnly={true}
                  containerStyle={{ paddingTop: 18 }}
                />
              ) : (
                <Empty text='No topics found.' />
              )}
            </>
            <DialogWrap
              title='Edit Tags'
              visible={topicsEditDialog}
              onDismiss={() => setTopicsEditDialog(false)}
            >
              <TribeTags tags={tribe.tags} finish={finish} />
            </DialogWrap>
          </>
        ) : (
          <>
            {tribe.tags.length > 0 && (
              <>
                <BoxHeader title='Topics in this Community' />
                <TribeTags
                  tags={tribe.tags}
                  displayOnly={true}
                  containerStyle={{ paddingTop: 18 }}
                />
              </>
            )}
          </>
        )}
      </>
    )
  })
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingTop: 30,
    paddingBottom: 30,
    paddingRight: 18,
    paddingLeft: 18
  },
  description: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25
  },
  dContent: {
    display: 'flex',
    flexDirection: 'column',
    width: '80%',
    paddingLeft: 14
  },
  badgeContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%'
  }
})

export default React.memo(About)
