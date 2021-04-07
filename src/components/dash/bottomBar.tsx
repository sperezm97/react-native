import React, { useState } from 'react'
import { useObserver } from 'mobx-react-lite'
import { View, Text, StyleSheet } from 'react-native'
import { BottomNavigation, IconButton, Portal } from 'react-native-paper'

import { useStores, useTheme } from '../../store'
import QR from '../utils/qr'
import * as utils from '../utils/utils'
import { qrActions } from '../../qrActions'
import { isLN, parseLightningInvoice, removeLightningPrefix } from '../utils/ln'
import Pushable from '../common/Pushable'

export default function BottomTabs() {
  const { ui, chats } = useStores()
  const [scanning, setScanning] = useState(false)
  const theme = useTheme()

  return useObserver(() => (
    <View
      accessibilityLabel='bottombar'
      style={{
        ...styles.bar,
        backgroundColor: theme.main
        // borderColor: theme.bg
      }}
    >
      <Pushable
        onPress={() => ui.setPayMode('invoice', null)} // chat here
      >
        <IconButton icon='arrow-bottom-left' size={32} color={theme.icon} />
      </Pushable>

      <Pushable onPress={() => ui.setPaymentHistory(true)}>
        <IconButton icon='format-list-bulleted' size={29} color={theme.icon} />
      </Pushable>

      <Pushable
        onPress={() => setScanning(true)} // after scan, set {amount,payment_request}
      >
        <IconButton icon='qrcode-scan' size={25} color={theme.icon} />
      </Pushable>

      <Pushable
        onPress={() => ui.setPayMode('payment', null)} // chat here
      >
        <IconButton icon='arrow-top-right' size={32} color={theme.icon} />
      </Pushable>
    </View>
  ))
}

// const [index, setIndex] = React.useState(0)
// const [routes] = React.useState([
//   { key: 'send', title: 'send', icon: 'arrow-bottom-left' },
//   { key: 'transactions', title: 'Albums', icon: 'format-list-bulleted' },
//   { key: 'qr', title: 'Recents', icon: 'qrcode-scan' },
//   { key: 'recents', title: 'Recents', icon: 'arrow-top-right' }
// ])

// const renderScene = ({ route, jumpTo }) => {
//   switch (route.key) {
//     case 'send':
//       return ui.setPayMode('invoice', null)
//     case 'transactions':
//       return ui.setPaymentHistory(true)
//     case 'recents':
//       return setScanning(true)
//     case 'recents':
//       return ui.setPayMode('payment', null)
//   }
// }
// <BottomNavigation navigationState={{ index, routes }} onIndexChange={setIndex} renderScene={renderScene} />

//   <IconButton
//     icon='arrow-bottom-left'
//     size={32}
//     color={theme.white}
//     onPress={() => ui.setPayMode('invoice', null)} // chat here
//   />
//   <IconButton icon='format-list-bulleted' size={29} color={theme.white} onPress={() => ui.setPaymentHistory(true)} />
//   <IconButton
//     icon='qrcode-scan'
//     size={25}
//     color={theme.white}
//     onPress={() => setScanning(true)} // after scan, set {amount,payment_request}
//   />
//   <IconButton
//     icon='arrow-top-right'
//     size={32}
//     color={theme.white}
//     onPress={() => ui.setPayMode('payment', null)} // chat here
//   />

//   {/* <Portal>
//     <View style={styles.qrWrap}>
//       {scanning && (
//         <QR
//           showPaster
//           onCancel={() => setScanning(false)}
//           onScan={async (data) => {
//             console.log(data);
//             if (isLN(data)) {
//               const theData = removeLightningPrefix(data);
//               const inv = parseLightningInvoice(data);
//               if (
//                 !(
//                   inv &&
//                   inv.human_readable_part &&
//                   inv.human_readable_part.amount
//                 )
//               )
//                 return;
//               const millisats = parseInt(inv.human_readable_part.amount);
//               const sats = millisats && Math.round(millisats / 1000);
//               ui.setConfirmInvoiceMsg({
//                 payment_request: theData,
//                 amount: sats,
//               });
//               setTimeout(() => {
//                 setScanning(false);
//               }, 1500);
//             } else if (data.startsWith("sphinx.chat://")) {
//               const j = utils.jsonFromUrl(data);
//               await qrActions(j, ui, chats);
//               setTimeout(() => {
//                 setScanning(false);
//               }, 150);
//             } else if (data.startsWith("action=donation")) {
//               // this should be already
//               const nd = "sphinx.chat://?" + data;
//               const j = utils.jsonFromUrl(nd);
//               await qrActions(j, ui, chats);
//               setTimeout(() => {
//                 setScanning(false);
//               }, 150);
//             }
//           }}
//         />
//       )}
//     </View>
//   </Portal> */}

const styles = StyleSheet.create({
  bar: {
    flex: 1,
    width: '100%',
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 60,
    maxHeight: 60,
    minHeight: 60,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: 'whitesmoke',
    marginRight: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  qrWrap: {
    flex: 1,
    marginTop: 2
  }
})
