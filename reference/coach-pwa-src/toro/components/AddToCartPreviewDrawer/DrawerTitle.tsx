import { type FC, useMemo } from 'react'
import Text from 'toro/components/Text'
import { MAX_REACHED_MSG } from 'toro/components/AddToBagDrawer'
import { useIntl } from 'react-intl'
import type { SystemStyleObject } from '@chakra-ui/react'

interface MessageProps {
  isPartialAdded: boolean
  drawerError: boolean
  drawerQuantity: number
  styles: Record<string, SystemStyleObject>
}

const DrawerTitle: FC<MessageProps> = ({ isPartialAdded, drawerError, drawerQuantity, styles }) => {
  const { formatMessage } = useIntl()

  const translation = {
    partialErrorText: formatMessage(
      {
        id: 'header.minicart.drawerQuantity',
        defaultMessage: '{drawerQuantity} item(s) added to bag.',
      },
      { drawerQuantity }
    ),
    maxReachedText: formatMessage({
      id: 'header.minicart.maxReachedText',
      defaultMessage: MAX_REACHED_MSG,
    }),
    itemNotAvailable: formatMessage({
      id: 'header.minicart.itemNotAvailable',
      defaultMessage: 'This item is no longer available and cannot be added to your bag.',
    }),
    itemAddedToBag: formatMessage(
      {
        id: 'header.minicart.itemaddedtobag',
        defaultMessage: '{drawerQuantity} item(s) successfully added to bag.',
      },
      { drawerQuantity }
    ),
  }

  const message = useMemo(() => {
    if (isPartialAdded) return `${translation.partialErrorText} ${translation.maxReachedText}`
    if (drawerError) return translation.itemNotAvailable
    return translation.itemAddedToBag
  }, [isPartialAdded, drawerError, drawerQuantity])

  return <Text sx={styles.drawerTitle}>{message}</Text>
}

export default DrawerTitle
