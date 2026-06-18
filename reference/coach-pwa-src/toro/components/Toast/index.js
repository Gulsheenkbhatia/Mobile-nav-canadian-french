import React, { useCallback, useMemo, useRef, useState } from 'react'
import useTheme from 'toro/hooks/useTheme'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import Button from 'toro/components/Button'
import CloseButton from 'toro/components/CloseButton'
import useOutsideClick from 'toro/hooks/useOutsideClick'
import { WISHLIST_URL } from 'toro/constants/Urls'
import { SuccessIcon, FormErrorOutlineIcon as ErrorIcon } from 'toro/icons'
import Link from 'toro/components/Link'

const Toast = ({
  status,
  description,
  link,
  brandSW,
  canUndo,
  onUndo,
  onClose,
  onOutsideClick,
  formatMessage,
  variant,
  dataQa,
}) => {
  const theme = useTheme()
  const stylesForLink = {
    fontFamily: 'var(--font-face1-normal)',
    textDecoration: 'underline',
  }
  const isPLPV3 = variant === 'plpv3'
  const Icon = useMemo(() => {
    if (status === 'error') {
      return ErrorIcon
    }
    return SuccessIcon
  }, [status])
  const ref = useRef()
  useOutsideClick({
    ref,
    handler: () => onOutsideClick && onOutsideClick(),
  })
  const [isInsideToastManager, setIsInsideToastManager] = useState(false)

  const hostRefSetter = useCallback((node) => {
    if (node) {
      ref.current = node
      const managerParent = node.closest('#chakra-toast-manager-top')
      if (managerParent) {
        setIsInsideToastManager(true)
      }
    }
  }, [])

  function handleCloseClick() {
    onClose && onClose()
  }

  function handleUndo() {
    onUndo && onUndo()
    onClose && onClose()
  }

  return (
    <Flex
      ref={hostRefSetter}
      alignItems={isPLPV3 ? 'center' : 'flex-start'}
      p={isPLPV3 ? 'var(--spacing-3) var(--spacing-4)' : 'var(--spacing-3)'}
      bg={theme.colors.neutral.light}
      boxShadow={isPLPV3 ? theme.boxShadow.plpV3Toast : theme.boxShadow.toast}
      borderRadius={isPLPV3 ? '4px' : 0}
    >
      <Box>
        <Icon
          width={16}
          height={16}
          viewBox="0 0 16 16"
          data-qa={
            isInsideToastManager && status === 'success'
              ? 'cm_icon_alert_pdt_addedto_sfl_wshlst_success'
              : null
          }
        />
      </Box>
      <Text
        variant="body-primary"
        fontFamily={!brandSW ? 'var(--font-face1-normal)' : 'var(--font-face2-normal)'}
        margin={isPLPV3 ? '0 0 0 var(--spacing-3)' : '0 var(--spacing-3)'}
        className="toast-body-message"
        size="md"
        data-qa={
          dataQa ??
          (isInsideToastManager && status === 'success' //QA Tag for saveForLaterMessage is same for PDP,PLP,and quickview.
            ? 'maab_add_added_toast'
            : null)
        }
      >
        {description}
        {link && (
          <Link href={WISHLIST_URL} sx={stylesForLink} prefetch={false}>
            {link}
          </Link>
        )}
      </Text>
      <Flex alignItems="center" ml="auto">
        {canUndo && !brandSW && (
          <Button onClick={handleUndo} variant="plain" size="sm" mr="xs">
            {formatMessage({ id: 'plp.toast.undo' })}
          </Button>
        )}
        {!isPLPV3 && (
          <CloseButton
            onClick={handleCloseClick}
            p={0}
            size="lg"
            data-qa={isInsideToastManager ? 'maab_add_updated_toast_icon_close' : null} //QA Tag for toastCloseBtn is same for PDP,PLP,and quickview.
          />
        )}
      </Flex>
    </Flex>
  )
}

export default Toast
