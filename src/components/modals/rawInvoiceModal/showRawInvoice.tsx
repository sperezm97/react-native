import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Button } from "react-native-paper";
import Share from "react-native-share";
import Clipboard from "@react-native-community/clipboard";
import Toast from "react-native-simple-toast";

import { useTheme } from "../../../store";
import QRCode from "../../utils/qrcode";

export default function ShowRawInvoice({ amount, payreq, paid }) {
  const theme = useTheme();
  function copy() {
    Clipboard.setString(payreq);
    Toast.showWithGravity("Payment Request Copied", Toast.SHORT, Toast.TOP);
  }
  async function share() {
    try {
      await Share.open({ message: payreq });
    } catch (e) {}
  }
  const { height, width } = Dimensions.get("window");
  const h = height - 280;

  return (
    <View style={{ ...styles.innerWrap, minHeight: h }}>
      {amount && (
        <View style={styles.amtWrap}>
          <Text
            style={{ fontSize: 16, color: theme.title, marginBottom: 12 }}
          >{`Amount: ${amount} sats`}</Text>
        </View>
      )}
      <View style={styles.qrWrap}>
        <QRCode value={payreq} size={720} />
        {paid && (
          <View style={styles.paidWrap}>
            <Text style={styles.paid}>PAID</Text>
          </View>
        )}
      </View>
      <Text style={{ ...styles.payreqText, color: theme.title }}>{payreq}</Text>
      <View style={styles.buttonsWrap}>
        <Button
          mode="contained"
          dark={true}
          onPress={() => share()}
          style={styles.button}
        >
          Share
        </Button>
        <Button
          mode="contained"
          dark={true}
          onPress={() => copy()}
          style={styles.button}
        >
          Copy
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  innerWrap: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  amtWrap: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    flexDirection: "row",
  },
  qrWrap: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
    marginTop: 5,
    position: "relative",
  },
  payreqText: {
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 40,
    marginBottom: 20,
    width: "100%",
    flexWrap: "wrap",
  },
  buttonsWrap: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  button: {
    height: 46,
    borderRadius: 23,
    width: 120,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  paidWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1001,
  },
  paid: {
    color: "#55D1A9",
    borderWidth: 4,
    height: 41,
    width: 80,
    borderColor: "#55D1A9",
    backgroundColor: "white",
    fontWeight: "bold",
    fontSize: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
});
