import { useEffect, useState } from 'react'
import RNFetchBlob from 'rn-fetch-blob'
import { useStores } from 'store'
import * as aes from 'lib/crypto/aes'
import { decode as atob } from 'base-64'
import { isBase64 } from 'lib/crypto/Base64'
import { display, log } from 'lib/logging'

const sess = 'all'

let dirs = RNFetchBlob.fs.dirs

// RNFetchBlob.fs.unlink(folder) to kill all there

type UseCachedEncryptedFile = {
  data: string
  uri: string
  loading: boolean
  trigger: () => any
  dispose: () => any
  paidMessageText: string
}
export function useCachedEncryptedFile(
  props,
  ldat,
  dispatchTrigger = false
): UseCachedEncryptedFile {
  const { meme } = useStores()
  const { id, media_key, media_type, media_token } = props

  const [data] = useState('')
  const [uri, setURI] = useState('')
  const [loading, setLoading] = useState(false)
  const [paidMessageText, setPaidMessageText] = useState(null)
  const isPaidMessage = media_type === 'n2n2/text'

  function dispose() {
    RNFetchBlob.session(sess)
      .dispose()
      .then(() => {
        console.log(`${sess} disposed`)
      })
  }

  async function trigger() {
    if (loading || data || uri || paidMessageText) return // already done
    if (!ldat?.host || !ldat?.sig) return

    const url = `https://${ldat.host}/file/${media_token}`

    // log('TRYING TO TRIGGER THIS URL?', url)

    const server = meme.servers.find((s) => s.host === ldat.host)

    // log('VIA SERVER', server)

    setLoading(true)
    // if img already exists return it
    const existingPath = dirs.CacheDir + `/attachments/msg_${id}_decrypted`
    const exists = await RNFetchBlob.fs.exists(existingPath)

    if (exists) {
      if (isPaidMessage) {
        const txt = await parsePaidMsg(id)
        setPaidMessageText(txt)
        // log('Paid message:', id, txt)
      } else {
        setURI('file://' + existingPath)
        // log('uri set to:', existingPath)
      }
      setLoading(false)
      // log('exists, going byebye?')
      return
    }

    if (!server) return
    try {
      // log('trying fetchblob...')
      const res = await RNFetchBlob.config({
        path: dirs.CacheDir + `/attachments/msg_${id}`,
      }).fetch('GET', url, {
        Authorization: `Bearer ${server.token}`,
      })
      // log(res)
      console.log('The file saved to ', res.path())

      const headers = res.info().headers
      const disp = headers['Content-Disposition']

      if (disp) {
        const arr = disp.split('=')
        if (arr.length === 2) {
          const filename = arr[1]
          if (filename) meme.addToFilenameCache(id, filename)
        }
      }

      const path = res.path()
      const status = res.info().status

      if (status == 200 && path) {
        let extension = ''
        if (media_type.startsWith('audio')) {
          extension = 'm4a'
        }

        if (isPaidMessage) {
          const txt = await aes.decryptFileAndSaveReturningContent(path, media_key, extension)
          // log('yo this is ', txt)
          const textt = media_type === 'n2n2/text' ? isBase64(txt).text : txt
          // log('and this is:', textt)
          setPaidMessageText(textt)
        } else {
          const newpath = await aes.decryptFileAndSave(path, media_key, extension)
          // log('is what?')
          setURI('file://' + newpath)
        }
        setLoading(false)
      }
      // if(status == 200 && path){
      //   console.log("DECRYPT", path, media_key)
      //   const dec = await aes.readEncryptedFile(path, media_key)
      //   const dataURI = `data:${media_type};base64,${dec}`
      //   console.log('got data URI', dataURI.length)
      //   setData(dataURI)
      //   setLoading(false)
      // }

      // let status = res.info().status
      // if(status == 200) {
      //   let base64Str = res.base64() // native conversion
      //   console.log('dec w pwd',media_key)
      //   const dec = await aes.decryptToBase64(base64Str, media_key)
      //   const dataURI = `data:${media_type};base64,${dec}`
      //   console.log(`data:${media_type};base64,${dataURI.length}`)
      //   setImgData(dataURI)
      //   setLoading(false)
      // }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (!media_token || paidMessageText || !dispatchTrigger) {
      // display({
      //   name: 'trigger',
      //   preview: 'usething returning.',
      //   value: {
      //     media_token,
      //     paidMessageText,
      //     dispatchTrigger,
      //     ldat,
      //   },
      // })
      return
    }
    display({
      name: 'trigger',
      preview: 'TRIGGERING!',
      value: {
        media_token,
        paidMessageText,
        dispatchTrigger,
      },
      important: true,
    })
    trigger()
  }, [media_token, paidMessageText, ldat])

  return { data, uri, loading, trigger, dispose, paidMessageText }
}

async function parsePaidMsg(id) {
  try {
    const path = dirs.CacheDir + `/attachments/msg_${id}_decrypted`
    const data = await RNFetchBlob.fs.readFile(path, 'base64')
    const dec = atob(data)
    display({
      name: 'parsePaidMsg',
      preview: 'Parsed paid message',
      value: {
        dec,
        path,
        data,
      },
      important: true,
    })
    return dec
  } catch (e) {
    console.log(e)
  }
}
