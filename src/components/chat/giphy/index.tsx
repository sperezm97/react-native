import React, { useCallback, useMemo, useState, useEffect } from "react"
import { Image, View, TouchableOpacity } from "react-native"
import MasonryList from '@react-native-seoul/masonry-list'
import { Modalize } from 'react-native-modalize'
import { Portal } from 'react-native-portalize'
import { useTheme } from "../../../store"
import { GiphyProps } from './type'
import styles from "./styles"
import Header from './header'
import Item from './item'

/**
 * Component that shows a modal with specific gifs
 * @param {boolean} open - param that handle if the modal is open or not
 * @param {Function} onClose - Function that close the modal
 * @param {Array<Object>} gifs - array with all the gifs
 * @param {String} searchGif - param that have the value of wich of gifs search
 * @param {Function} setSearchGif - callback function that return the text value to search
 * @param {Function} onSendGifHandler - callback function that return the selected gif
 * @param {Function} onSubmitEditing - function that search the type of gifs
 */
const Giphy = React.forwardRef<Modalize | null, GiphyProps>(({
  gifs,
  open,
  onClose,
  searchGif,
  onSendGifHandler,
  setSearchGif,
  getGifsBySearch,
}, modalizeRef) => {
  const theme = useTheme();

  const keyExtractor = useCallback(({ id }) => id, [])

  const onSearchGIF = () => {
    setSearchGif(searchGif)
    getGifsBySearch()
  }

  const CustomHeader = () => (
    <Header
      onClose={onClose}
      searchGif={searchGif}
      setSearchGif={setSearchGif}
      getGifsBySearch={getGifsBySearch}
    />
  )

  return (
    <Portal>
      <Modalize
        ref={modalizeRef}
        modalHeight={400}
        HeaderComponent={CustomHeader}
        modalStyle={{ backgroundColor: theme.main }}
      >
        <MasonryList
          contentContainerStyle={{
            paddingHorizontal: 10,
            alignSelf: 'stretch',
          }}
          numColumns={3}
          data={gifs}
          renderItem={Item(onSendGifHandler)}
        />
      </Modalize>
    </Portal>
  )
})

export default Giphy
