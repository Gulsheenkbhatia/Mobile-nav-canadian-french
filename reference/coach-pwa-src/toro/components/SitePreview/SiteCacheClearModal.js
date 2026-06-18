import { useRef, useState } from 'react'
import {
  Alert,
  Button,
  CloseButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from '@chakra-ui/react'
import { useIntl } from 'react-intl'
import getAPIURL from 'helpers/getAPIURL'

export default function SiteCacheClearModalContent({ isOpen, onClose }) {
  const cancelRef = useRef()
  const [isPendingClearCache, setPendingClearCache] = useState(false)
  const [statusMessage, setStatusMessage] = useState({
    status: '',
    message: '',
  })

  const {
    modalTitle,
    defaultMessage,
    clearCacheBtnLabel,
    cancelClearCacheBtnLabel,
    pendingClearCacheBtnLabel,
  } = useModalMessages()

  const [clearCacheBtnText, setClearCacheBtnText] = useState(clearCacheBtnLabel)

  async function handleClearSiteCacheClick() {
    setPendingClearCache(true)
    const response = await fetch(getAPIURL('/clear-cache'))

    if (response?.ok) {
      setStatusMessage({
        status: 'success',
        message: 'reloading the page in 5 seconds...',
      })

      setTimeout(() => {
        window.location.reload()
      }, 5000)
    } else {
      const { error = 'please double check the configuration.' } = await response.json()

      setClearCacheBtnText(clearCacheBtnLabel)
      setPendingClearCache(false)
      setStatusMessage({
        status: 'error',
        message: error.toLocaleLowerCase(),
      })
    }
  }

  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>{modalTitle}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody mb="20px">{defaultMessage}</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} isDisabled={isPendingClearCache} onClick={onClose}>
              {cancelClearCacheBtnLabel}
            </Button>
            <Button
              bg="red"
              ml="12px"
              isLoading={isPendingClearCache}
              loadingText={pendingClearCacheBtnLabel}
              isDisabled={isPendingClearCache}
              onClick={() => {
                handleClearSiteCacheClick()
              }}
            >
              {clearCacheBtnText}
            </Button>
          </AlertDialogFooter>

          <StatusMessage
            status={statusMessage.status}
            message={statusMessage.message}
            clearStatusMessage={() =>
              setStatusMessage({
                status: '',
                message: '',
              })
            }
          />
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function StatusMessage({ status = '', message = '', clearStatusMessage }) {
  if (!message || !status) return null

  return (
    <Alert
      sx={{
        justifyContent: 'space-between',
      }}
      status={status}
    >
      <span>
        {status}: {message}
      </span>
      <CloseButton onClick={clearStatusMessage} />
    </Alert>
  )
}

function useModalMessages() {
  const { formatMessage } = useIntl()

  const modalTitle = formatMessage({
    id: 'header.sitePreview.clearSiteCacheModal.title',
    defaultMessage: 'Clear site cache?',
  })

  const clearCacheBtnLabel = formatMessage({
    id: 'header.sitePreview.clearSiteCacheModal.clearCache',
    defaultMessage: 'Clear cache',
  })

  const defaultMessage = formatMessage({
    id: 'header.sitePreview.clearSiteCacheModal.body',
    defaultMessage:
      "Are you sure you want to clear the site's cache? Please note that this process can take 2 minutes to take place. Also, clearing the site's cache will temporarily slow down the site's experience.",
  })

  const cancelClearCacheBtnLabel = formatMessage({
    id: 'header.sitePreview.clearSiteCacheModal.cancel',
    defaultMessage: 'Cancel',
  })

  const pendingClearCacheBtnLabel = formatMessage({
    id: 'header.sitePreview.clearSiteCacheModal.clearingCache',
    defaultMessage: 'Clearing cache',
  })

  return {
    modalTitle,
    defaultMessage,
    clearCacheBtnLabel,
    cancelClearCacheBtnLabel,
    pendingClearCacheBtnLabel,
  }
}
