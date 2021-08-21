import React, {
  useRef,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useObserver } from "mobx-react-lite";
import {
  StyleSheet,
  VirtualizedList,
  View,
  Text,
  Keyboard,
  Animated,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-simple-toast";

import { useStores, useTheme, hooks } from "../../store";
import { Chat } from "../../store/chats";
import { useMsgSender } from "../../store/hooks/msg";
import Message from "./msg";
import { constants, SCREEN_HEIGHT, SCREEN_WIDTH } from "../../constants";
import EE, { SHOW_REFRESHER } from "../utils/ee";
import Typography from "../common/Typography";

const { useMsgs } = hooks;

const group = constants.chat_types.group;
const tribe = constants.chat_types.tribe;

export default function MsgListWrap({
  chat,
  pricePerMessage,
}: {
  chat: Chat;
  pricePerMessage: number;
}) {
  const { msg, ui, user, chats, details } = useStores();
  const [limit, setLimit] = useState(40);
  const navigation = useNavigation();

  function onLoadMoreMsgs() {
    setLimit((c) => c + 40);
  }

  async function onBoostMsg(m) {
    const { uuid } = m;
    if (!uuid) return;
    const amount = (user.tipAmount || 100) + pricePerMessage;

    if (amount > details.balance) {
      Toast.showWithGravity("Not Enough Balance", Toast.SHORT, Toast.TOP);
      return;
    }

    msg.sendMessage({
      boost: true,
      contact_id: null,
      text: "",
      amount,
      chat_id: chat.id || null,
      reply_uuid: uuid,
      message_price: pricePerMessage,
    });
  }
  async function onDelete(id) {
    await msg.deleteMessage(id);
  }
  async function onApproveOrDenyMember(contactId, status, msgId) {
    await msg.approveOrRejectMember(contactId, status, msgId);
  }
  async function onDeleteChat() {
    navigation.navigate("Home", { params: { rnd: Math.random() } });
    await chats.exitGroup(chat.id);
  }
  return useObserver(() => {
    const msgs = useMsgs(chat, limit) || [];

    return (
      <MsgList
        msgsLength={(msgs && msgs.length) || 0}
        msgs={msgs}
        chat={chat}
        onDelete={onDelete}
        myPubkey={user.publicKey}
        myAlias={user.alias}
        myid={user.myid}
        onApproveOrDenyMember={onApproveOrDenyMember}
        onDeleteChat={onDeleteChat}
        onLoadMoreMsgs={onLoadMoreMsgs}
        onBoostMsg={onBoostMsg}
      />
    );
  });
}

function MsgList({
  msgsLength,
  msgs,
  chat,
  onDelete,
  myPubkey,
  myAlias,
  onApproveOrDenyMember,
  onDeleteChat,
  onLoadMoreMsgs,
  onBoostMsg,
  myid,
}) {
  const scrollViewRef = useRef(null);
  const theme = useTheme();
  const { contacts } = useStores();

  async function onEndReached() {
    // EE.emit(SHOW_REFRESHER)
    onLoadMoreMsgs();
  }

  // Keyboard logic
  useEffect(() => {
    const ref = setTimeout(() => {
      if (scrollViewRef && scrollViewRef.current && msgs && msgs.length) {
        scrollViewRef.current.scrollToOffset({ offset: 0 });
      }
    }, 500);
    Keyboard.addListener("keyboardDidShow", (e) => {
      if (scrollViewRef && scrollViewRef.current && msgs && msgs.length) {
        scrollViewRef.current.scrollToOffset({ offset: 0 });
      }
    });
    return () => {
      clearTimeout(ref);
      Keyboard.removeListener("keyboardDidShow", () => {});
      scrollViewRef.current = null;
    };
  }, [msgsLength]);

  if (chat.status === constants.chat_statuses.pending) {
    return (
      <View style={{ display: "flex", alignItems: "center" }}>
        <Text style={{ marginTop: 27, color: theme.subtitle }}>
          Waiting for admin approval
        </Text>
      </View>
    );
  }

  const windowWidth = Math.round(Dimensions.get("window").width);

  const isGroup = chat.type === group;
  const isTribe = chat.type === tribe;
  const initialNumToRender = 20;

  // console.log("msgs last one:", msgs[1]);

  return (
    <>
      <Refresher />
      <VirtualizedList
        accessibilityLabel="message-list"
        inverted
        style={{ zIndex: 100 }}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
        windowSize={10}
        ref={scrollViewRef}
        data={msgs}
        initialNumToRender={initialNumToRender}
        initialScrollIndex={0}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        viewabilityConfig={{
          waitForInteraction: false,
          viewAreaCoveragePercentThreshold: 20,
        }}
        renderItem={({ item, index }) => {
          const { senderAlias, senderPic } = useMsgSender(
            item,
            contacts.contacts,
            isTribe
          );
          return (
            <ListItem
              key={item.id}
              windowWidth={windowWidth}
              m={item}
              chat={chat}
              senderAlias={senderAlias}
              senderPic={senderPic}
              myid={myid}
              isGroup={isGroup}
              isTribe={isTribe}
              onDelete={onDelete}
              myPubkey={myPubkey}
              myAlias={myAlias}
              onApproveOrDenyMember={onApproveOrDenyMember}
              onDeleteChat={onDeleteChat}
              onBoostMsg={onBoostMsg}
            />
          );
        }}
        keyExtractor={(item: any) => item.id + ""}
        getItemCount={() => msgs.length}
        getItem={(data, index) => data[index]}
        ListHeaderComponent={<View style={{ height: 13 }} />}
      />
    </>
  );
}

function Refresher() {
  const theme = useTheme();
  const [show, setShow] = useState(false);
  useEffect(() => {
    function doShow() {
      setShow(true);
      setTimeout(() => {
        setShow(false);
      }, 100);
    }
    EE.on(SHOW_REFRESHER, doShow);
    return () => EE.removeListener(SHOW_REFRESHER, doShow);
  }, []);
  if (!show) return <></>;
  return (
    <View style={{ ...styles.refreshingWrap, height: show ? 60 : 0 }}>
      <ActivityIndicator animating={true} color={theme.icon} size={25} />
    </View>
  );
}

function ListItem({
  m,
  chat,
  isGroup,
  isTribe,
  onDelete,
  myPubkey,
  myAlias,
  senderAlias,
  senderPic,
  windowWidth,
  onApproveOrDenyMember,
  onDeleteChat,
  onBoostMsg,
  myid,
}) {
  if (m.dateLine) {
    return <DateLine dateString={m.dateLine} />;
  }

  const msg = m;

  if (!m.chat) msg.chat = chat;

  return useMemo(
    () => (
      <Message
        {...msg}
        chat={chat}
        isGroup={isGroup}
        isTribe={isTribe}
        senderAlias={senderAlias}
        senderPic={senderPic}
        onDelete={onDelete}
        myPubkey={myPubkey}
        myAlias={myAlias}
        myid={myid}
        windowWidth={windowWidth}
        onApproveOrDenyMember={onApproveOrDenyMember}
        onDeleteChat={onDeleteChat}
        onBoostMsg={onBoostMsg}
      />
    ),
    [m.id, m.type, m.media_token, m.status, m.sold, m.boosts_total_sats]
  );
}

// date label component
function DateLine({ dateString }) {
  const theme = useTheme();
  return (
    <View style={{ ...styles.dateLine }}>
      <View style={{ ...styles.dateString, backgroundColor: theme.main }}>
        <Typography size={12} color={theme.subtitle}>
          {dateString}
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dateLine: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
    height: 22,
    width: "100%",
    marginTop: 30,
  },
  dateString: {
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 15,
  },
  refreshingWrap: {
    position: "absolute",
    zIndex: 102,
    top: 55,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});

function wait(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}
