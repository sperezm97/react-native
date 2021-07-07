import React from 'react'
import { View } from "react-native"
import { TextInput } from "react-native-paper"
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { GiphyProps } from './type'
import styles from "./styles"
import { useTheme } from "../../../store"

type HeaderProps = Pick<GiphyProps, "onClose" | "searchGif" | "setSearchGif" | "getGifsBySearch">

const Header: React.FC<HeaderProps> = ({
  onClose,
  searchGif,
  setSearchGif,
  getGifsBySearch,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.header}>
      <View style={styles.inputContainer}>
        <TextInput
          style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.input }}
          placeholder="Search on GIPHY"
          value={searchGif}
          onChangeText={setSearchGif}
          onSubmitEditing={getGifsBySearch}
          left={<TextInput.Icon name={() => <FontAwesomeIcon name='search' size={20} color={theme.iconPrimary} />} />}
        />
      </View>
    </View>
  )
}

export default Header
