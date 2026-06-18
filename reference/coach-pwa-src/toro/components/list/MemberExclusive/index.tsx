import { useState, useEffect, useContext, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Box from 'toro/components/Box'
import useViewportType from 'toro/hooks/useViewportType'
import SessionContext from 'toro/components/SessionContext'
import get from 'lodash/get'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import usePageType from 'toro/hooks/usePageType'
import { useAtomValue } from 'jotai/utils'
import { isPlpV3Atom } from 'store/plp.atom'
const LockIcon = dynamic(() => import('design-tokens/icon/object/lock.svg'))
const UnlockIcon = dynamic(() => import('components/assets/Unlock.svg'))
const LockIconV2 = dynamic(() => import('components/assets/lock-v2.svg'))
const UnlockIconV2 = dynamic(() => import('components/assets/unlock-v2.svg'))

type MemberExclusiveProps = {
  title?: string
  isTangibleeVisible: boolean
  isQuickView: boolean
  isOnBadge: boolean
}

function MemberExclusive({
  title,
  isTangibleeVisible,
  isQuickView = false,
  isOnBadge = false,
}: MemberExclusiveProps) {
  const { isPDP, isPLP, isSRP } = usePageType()
  const isPlpV3 = useAtomValue(isPlpV3Atom) && (isPLP || isSRP)
  const { session } = useContext(SessionContext)
  const [isLabelOpen, setIsLabelOpen] = useState(false)
  const isUserLoggedIn = !!get(session, 'user.userEmail')
  const { isMobile } = useViewportType()

  const iconProps = useMemo(
    () => ({
      onMouseEnter: () => setIsLabelOpen(true),
      onMouseLeave: () => setIsLabelOpen(false),
      onClick: () => setIsLabelOpen((prev) => !prev),
    }),
    []
  )

  const boxProps = {
    as: 'div',
    width: isPlpV3 ? '15px' : '24px',
    height: isPlpV3 ? '15px' : '24px',
    right: isMobile ? (isPDP ? '-4px' : isPlpV3 ? 'auto' : 'var(--spacing-3)') : 'var(--spacing-3)',
    display: isPlpV3 ? 'flex' : null,
    left: isPlpV3 ? '8px' : null,
    zIndex: '10',
    padding: isPlpV3 && isMobile ? '4px' : null,
    backgroundColor: isPlpV3 && !isOnBadge ? 'rgba(225, 225, 225, 0.50)' : null,
    top: (() => {
      if (isTangibleeVisible) {
        if (isMobile) {
          return '92px'
        } else {
          return '98px'
        }
      } else {
        if (isQuickView) {
          return '58px'
        } else {
          if (isPLP || isSRP) {
            return isPlpV3 ? '9px' : '47px'
          } else {
            return isMobile ? '52px' : '58px'
          }
        }
      }
    })(),
    position: 'absolute',
    cursor: 'pointer',
    'data-qa': isLabelOpen ? 'wrapper_mbr_exclsv_lock_tooltip' : 'wrapper_mbr_exclsv_lock',
    sx: {
      '& svg': {
        transform: 'scale(1.2)',
      },
    },
  }

  useEffect(() => {
    window.addEventListener('scroll', handleOnScrollClear, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleOnScrollClear)
    }
  }, [])

  const handleOnScrollClear = () => {
    setIsLabelOpen(false)
  }

  const Icon = useMemo(() => {
    if (isPlpV3) {
      return isUserLoggedIn ? UnlockIconV2 : LockIconV2
    }
    return isUserLoggedIn ? UnlockIcon : LockIcon
  }, [isPlpV3, isUserLoggedIn])

  return (
    <Box {...boxProps} title={title}>
      <Icon
        width={isPlpV3 ? '8px' : '24px'}
        height={isPlpV3 ? '8px' : '24px'}
        data-qa="icon_mbr_exclsv_lock"
        {...iconProps}
      />
    </Box>
  )
}
export default withErrorBoundaryWrapper(MemberExclusive)
