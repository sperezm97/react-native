import React, { useState } from "react";
import { useObserver } from "mobx-react-lite";
import { View, Text, StyleSheet } from "react-native";
import { Button, Portal } from "react-native-paper";

import { useStores } from "../../store";
import ModalWrap from "./modalWrap";
import Header from "./modalHeader";

export default function OauthWrap({ visible }) {
  const { ui } = useStores();

  function close() {
    ui.setOauthParams(null);
  }

  return (
    <ModalWrap onClose={close} visible={visible}>
      {visible && <Oauth close={close} />}
    </ModalWrap>
  );
}

function Oauth({ close }) {
  const { ui, auth } = useStores();
  const [loading, setLoading] = useState(false);

  async function authorize() {
    setLoading(true);
    await auth.verify(params.id, params.challenge);
    setLoading(false);
    close();
  }

  const params = ui.oauthParams;
  return useObserver(() => (
    <Portal.Host>
      <Header title="Authorize" onClose={close} />

      {params && (
        <View style={styles.modal}>
          <Text style={styles.authorize}>Authorize With</Text>
          <Text style={styles.host}>{params.host}</Text>
          <View style={styles.buttonWrap}>
            <Button
              mode="contained"
              onPress={authorize}
              dark={true}
              style={styles.button}
              loading={loading}
            >
              Authorize
            </Button>
          </View>
        </View>
      )}
    </Portal.Host>
  ));
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    paddingTop: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  authorize: {
    fontWeight: "bold",
    paddingTop: 10,
    fontSize: 18,
  },
  host: {
    fontWeight: "bold",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#eee",
  },
  buttonWrap: {
    width: "100%",
    maxHeight: 60,
    flexDirection: "row-reverse",
    justifyContent: "center",
    marginTop: 40,
  },
  button: {
    borderRadius: 30,
    width: "80%",
    height: 60,
    display: "flex",
    justifyContent: "center",
    zIndex: 999,
    position: "relative",
  },
});
