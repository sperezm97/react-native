import React, { useCallback, useState, useEffect } from "react"
import { Image, TouchableOpacity } from "react-native"
import styles from "./styles"

type ImageSize = {
  height: number;
  width: number;
}

const getOriginalImageSize = async (imageUri: string): Promise<ImageSize> =>
  new Promise<ImageSize>((resolve, reject) =>
    Image.getSize(
      imageUri,
      (width: number, height: number) => resolve({ width, height }),
      reject,
    ),
);

const Item = (onSendGifHandler) => ({ item, index }) => {
  const [imgAspectRatio, setImgAspectRatio] = useState(0)

  const thumb = item.images.original.url.replace(
    /giphy.gif/g,
    "100w.gif"
  )

  const getImageRatio = useCallback(async (): Promise<void> => {
    const imageSize = await getOriginalImageSize(thumb);
    if (imageSize) setImgAspectRatio(imageSize.height / imageSize.width)
  }, [thumb])

  useEffect(() => { getImageRatio(); }, [getImageRatio])

  return (
    <TouchableOpacity key={item.id} style={{ padding: 4 }} onPress={() => onSendGifHandler(item)}>
      <Image
        progressiveRenderingEnabled
        resizeMode="cover"
        source={{ uri: thumb }}
        style={{ ...styles.gif, aspectRatio: imgAspectRatio }}
      />
    </TouchableOpacity>
  )
}

export default Item
