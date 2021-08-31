import React, { useEffect, useState, useRef, useCallback } from "react";
import { Linking, AppState } from "react-native";
import { useObserver } from "mobx-react-lite";
import { Provider as PaperProvider } from "react-native-paper";
import { useDarkMode } from "react-native-dynamic";
import { is24HourFormat } from "react-native-device-time-format";
import { Host } from "react-native-portalize";
import { NavigationContainer } from "@react-navigation/native";

import { useStores, useTheme } from "./src/store";
import useConnectionInfo from "./src/hooks/useConnectionInfo";
import APNManager from "./src/store/contexts/apn";
import { instantiateRelay } from "./src/api";
import { navigationRef } from "./src/components/Navigation";
import * as utils from "./src/components/utils/utils";
import PIN, { wasEnteredRecently } from "./src/components/utils/pin";
import EE, { RESET_IP_FINISHED } from "./src/components/utils/ee";
import { qrActions } from "./src/qrActions";
import { paperTheme } from "./src/theme";
import Main from "./src/main";
import Disconnect from "./src/components/disconnect";
import Auth from "./src/components/Navigation/Auth";
import Splash from "./src/components/common/Splash";
import PinCodeModal from "./src/components/common/Modals/PinCode";
import StatusBar from "./src/components/common/StatusBar";

declare var global: { HermesInternal: null | {} };

// splash screen
export default function Wrap() {
  const { ui, chats } = useStores();
  const [wrapReady, setWrapReady] = useState(false);
  const theme = useTheme();
  // const appState = useRef(AppState.currentState)

  // useEffect(() => {
  //   AppState.addEventListener('change', handleAppStateChange)
  //   return () => {
  //     AppState.removeEventListener('change', handleAppStateChange)
  //   }
  // }, [])

  // function handleAppStateChange(nextAppState) {
  //   if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
  //     // handleDeepLink()
  //   }
  //   if (appState.current.match(/active/) && nextAppState === 'background') {
  //   }

  //   appState.current = nextAppState
  // }

  useEffect(() => {
    handleDeepLink();
    // If the app is already open, the app is foregrounded and a Linking 'url' event is fired
    Linking.addEventListener("url", handleDeepLink);

    return () => {
      Linking.removeEventListener("url", handleDeepLink);
    };
  }, []);

  async function gotLink(e) {
    if (e && typeof e === "string") {
      const j = utils.jsonFromUrl(e);
      if (j["action"]) await qrActions(j, ui, chats);
    }
  }

  async function handleDeepLink(e?: Partial<{ url: string }>) {
    // If the app launch was triggered by an app link, it will give the link url, otherwise it will give null
    const url = await Linking.getInitialURL();

    setWrapReady(true);
    if (e?.url) return gotLink(e.url);
    if (url) return gotLink(url);
  }

  return useObserver(() => {
    if (ui.ready && wrapReady) return <App />; // hydrated and checked for deeplinks!

    return <Splash />; // full screen loading
  });
}

function App() {
  const { user, ui } = useStores();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [showDisconnectUI, setShowDisconnectedUI] = useState(true);

  function connectedHandler() {
    ui.setConnected(true);
  }
  function disconnectedHandler() {
    ui.setConnected(false);
  }
  async function check24Hour() {
    const is24Hour = await is24HourFormat();
    ui.setIs24HourFormat(is24Hour);
  }

  const isDarkMode = useDarkMode();
  useEffect(() => {
    if (theme.mode === "System") {
      theme.setDark(isDarkMode);
    } else {
      theme.setDark(theme.mode === "Dark");
    }

    check24Hour();

    // TrackPlayer.setupPlayer();
    (async () => {
      const isSignedUp =
        user.currentIP && user.authToken && !user.onboardStep ? true : false;

      ui.setSignedUp(isSignedUp);

      if (isSignedUp) {
        instantiateRelay(
          user.currentIP,
          user.authToken,
          connectedHandler,
          disconnectedHandler,
          resetIP
        );
      }
      const pinWasEnteredRecently = await wasEnteredRecently();

      if (pinWasEnteredRecently) ui.setPinCodeModal(true);

      setLoading(false);

      user.testinit();
    })();
  }, []);

  async function resetIP() {
    ui.setLoadingHistory(true);
    const newIP = await user.resetIP();
    instantiateRelay(
      newIP,
      user.authToken,
      connectedHandler,
      disconnectedHandler
    );
    EE.emit(RESET_IP_FINISHED);
  }

  return useObserver(() => {
    const isConnected = useConnectionInfo();

    if (!isConnected && showDisconnectUI)
      return <Disconnect onClose={() => setShowDisconnectedUI(false)} />;
    if (loading) return <Splash />;
    if (ui.signedUp && !ui.pinCodeModal) {
      return (
        <PinCodeModal visible={true}>
          <PIN
            onFinish={async () => {
              await utils.sleep(240);
              ui.setPinCodeModal(true);
            }}
          />
        </PinCodeModal>
      );
    }

    const pTheme = paperTheme(theme);

    return (
      <>
        <PaperProvider theme={pTheme}>
          <StatusBar />
          <NavigationContainer ref={navigationRef}>
            <Host>
              {ui.signedUp && (
                <APNManager>
                  <Main />
                </APNManager>
              )}
              {!ui.signedUp && <Auth />}
            </Host>
          </NavigationContainer>
        </PaperProvider>
      </>
    );
  });
}
