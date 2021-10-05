import React from 'react'
import { StyleSheet, View, SectionList } from 'react-native'
import { useObserver } from 'mobx-react-lite'

import { useStores, useTheme } from 'store'
import { Contact, DeletableContact } from './Items'
import Typography from '../../common/Typography'

export default function List({ tribe, members, listHeader }) {
  const { chats } = useStores()
  const theme = useTheme()

  async function onKickContact(cid) {
    await chats.kick(tribe.id, cid)
  }

  const renderItem: any = ({ item, index }: any) => {
    if (tribe.owner) {
      return <DeletableContact key={index} contact={item} onDelete={onKickContact} />
    }
    return <Contact key={index} contact={item} unselectable={true} />
  }

  return useObserver(() => {
    return (
      <SectionList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        // scrollEnabled={false}
        style={styles.wrap}
        sections={grouper(members)}
        // data={members}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <View style={{ ...styles.section, backgroundColor: theme.main }}>
            <Typography color={theme.title} fw='500'>
              {title}
            </Typography>
          </View>
        )}
        ListHeaderComponent={listHeader}
        keyExtractor={(item) => String(item.id)}
      />
    )
  })
}

function grouper(data) {
  // takes "alias"
  const ret = []
  const groups = data.reduce((r, e) => {
    let title = e.alias[0]
    if (!r[title]) r[title] = { title, data: [e] }
    else r[title].data.push(e)
    return r
  }, {})
  Object.values(groups).forEach((g) => {
    ret.push(g)
  })
  return ret
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    position: 'relative',
  },
  section: {
    paddingLeft: 24,
    height: 35,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
})
