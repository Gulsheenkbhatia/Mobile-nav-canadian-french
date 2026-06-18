import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { usePrevious } from '@chakra-ui/react'
import { useAtomValue } from 'jotai/utils'
import { productsAtom, searchResultPageAtom } from 'store/search-results.atom'
import Box from 'toro/components/Box'

const ProductLoadAnnouncement = () => {
  const { formatMessage } = useIntl()
  const page = useAtomValue(searchResultPageAtom)
  const productsCount = useAtomValue(productsAtom)?.length || 0
  const prevCount = usePrevious(productsCount)
  const [liveMessage, setLiveMessage] = useState('')

  useEffect(() => {
    const currentCount = productsCount
    const previousCount = prevCount ?? 0
    const addedCount = currentCount - previousCount

    if (currentCount < previousCount || page === 1) {
      setLiveMessage('')
      return
    }

    if (addedCount > 0 && page > 1) {
      const message = formatMessage(
        {
          id: 'plp.productsLoadedAnnouncement',
          defaultMessage: 'Loaded {count} more products, showing {total} items.',
        },
        { count: addedCount, total: currentCount }
      )
      setLiveMessage(message)
    }
  }, [productsCount, prevCount, page, formatMessage])

  return (
    <Box className="sr-only" aria-live="polite">
      {liveMessage}
    </Box>
  )
}

export default ProductLoadAnnouncement
