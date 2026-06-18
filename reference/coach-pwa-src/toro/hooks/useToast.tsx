import React from 'react'
import Toast from 'toro/components/Toast'
import {
  StyleProps,
  useToast as useToastChakraUI,
  UseToastOptions,
  ToastPosition as ChakraToastPosition,
} from '@chakra-ui/react'
import { useIntl } from 'react-intl'
import isSW from 'toro/helpers/isSW'

type UseToastHookOptions = {
  variant?: string
  position?: ChakraToastPosition
  containerStyle?: Record<string, any> | StyleProps
}

type ToastOptions = UseToastOptions & {
  link?: string
  canUndo?: boolean
  onUndo?: () => void
  dataQa?: string | null
}

const useToast = ({
  variant = '',
  position = 'top',
  containerStyle = {},
}: UseToastHookOptions = {}) => {
  const toast = useToastChakraUI({ containerStyle })
  const { formatMessage } = useIntl()
  const brandSW = isSW()

  return ({
    status = 'success',
    description,
    link = '',
    duration = 3000,
    canUndo = false,
    onUndo = () => {},
    dataQa = null,
  }: ToastOptions) => {
    const handleUndo = (): void => {
      onUndo && onUndo()
    }

    return toast({
      position,
      status,
      description,
      duration,
      render: ({ onClose }) => (
        <Toast
          status={status}
          description={description}
          brandSW={brandSW}
          link={link}
          canUndo={canUndo}
          onClose={onClose}
          onUndo={handleUndo}
          onOutsideClick={toast.closeAll}
          formatMessage={formatMessage}
          variant={variant}
          dataQa={dataQa}
        />
      ),
    })
  }
}

export default useToast
