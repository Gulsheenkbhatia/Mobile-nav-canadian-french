import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import Text from 'toro/components/Text'
import React, { useMemo } from 'react'
import { useIntl } from 'react-intl'
import Box from 'toro/components/Box'
import { FilterType } from 'toro/hooks/useRatingsAndReviews'
import { Close as CloseIcon } from 'toro/icons/header-icons'
import { Topic } from 'toro/components/product/RatingsAndReviews/ReviewsList/types'
import ScrollableContent from 'toro/components/ScrollableContent'
import Flex from 'toro/components/Flex'

type RatingFilterObject = {
  filterBy: string
}

type ClickableTagsProps = {
  properties: any
  topics?: Topic[]
  ratingsFilter: RatingFilterObject
  handleChangeFilter: (item: {
    key: string
    value: string
    displayLabel?: string
    filterType?: FilterType
  }) => void
  allowedFilters: string[]
  variant?: string
}

type TagItem = {
  key: string
  value: string
  count?: number
}

const ClickableTags = ({
  properties,
  topics,
  handleChangeFilter,
  ratingsFilter,
  allowedFilters,
  variant,
}: ClickableTagsProps) => {
  const {
    pdpReviewsClickableTag,
    pdpReviewsClickableTagText,
    pdpReviewsClickableTagCount,
    clickableTagsContainer,
    wordCloudTagsText,
  }: any = useMultiStyleConfig('RatingsAndReviews', { variant })

  const { formatMessage } = useIntl()

  const mappedProperties: TagItem[] = useMemo(() => {
    if (topics?.length) {
      return topics.map(({ value, count }) => ({ key: 'topic', value, count }))
    }
    return properties.reduce((acc, property) => {
      return [
        ...acc,
        ...(allowedFilters.includes(property?.key)
          ? property?.values?.map(({ label, count }) => {
              return { key: property?.key, value: label, count }
            }) || []
          : []),
      ]
    }, [])
  }, [properties, topics, allowedFilters])

  const renderTag = (item: TagItem) => {
    const isSelected = ratingsFilter?.filterBy?.split(',').some((pair) => {
      const [key, value] = pair.split(':')
      const values = value ? value.split('||') : []
      return key === item?.key && values.includes(item?.value)
    })
    const hasCount = typeof item.count === 'number' && item.count > 0
    const onClick = () =>
      handleChangeFilter({ ...item, displayLabel: item.value, filterType: FilterType.WORD_CLOUD })
    return (
      <Box data-qa="add_word_cloud_pdp" key={`${item?.key}:${item?.value}`} onClick={onClick} m={1}>
        <Flex sx={pdpReviewsClickableTag?.(isSelected)} alignItems="center">
          <Text sx={pdpReviewsClickableTagText?.(isSelected)}>
            {item.value}
            {hasCount && (
              <Box as="span" sx={pdpReviewsClickableTagCount}>
                ({item.count})
              </Box>
            )}
          </Text>
          {isSelected && (
            <Box data-qa="word_cloud_close_icon" ml={1}>
              <CloseIcon height="12px" width="12px" />
            </Box>
          )}
        </Flex>
      </Box>
    )
  }

  return (
    Boolean(mappedProperties.length) && (
      <Box data-qa="customers_describe_product_section">
        <Box sx={wordCloudTagsText}>
          {formatMessage({
            id: 'pdp.product.wordCloudTagsText',
            defaultMessage: 'Customers describe this product as:',
          })}
        </Box>
        <Box sx={clickableTagsContainer}>
          <ScrollableContent
            fadeColor="var(--color-neutral-light-1)"
            countOfItems={mappedProperties.length}
            dataQA="scrollable_clickable_tags"
          >
            <Flex>{mappedProperties.map(renderTag)}</Flex>
          </ScrollableContent>
        </Box>
      </Box>
    )
  )
}

export default ClickableTags
