import { memo } from 'react'
import dynamic from 'next/dynamic'
import { useAtomValue } from 'jotai/utils'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { FormErrorOutlineIcon as AlertIcon } from 'toro/icons'
import useBadges from 'toro/components/badges/hooks/useBadges'
import { BadgeArea } from 'toro/components/badges/constants/badgeAreas'
import { badgeTypes } from 'toro/components/badges/constants/badgeTypes'
import { productDataForGaBadgesAtom } from 'store/pdp.atom'

const HtmlContent = dynamic(() => import('toro/components/HtmlContent'))

function FinalSaleProductMessage() {
  const styles = useMultiStyleConfig('FinalSaleProductMessage', { variant: 'alert' })
  const productDataForBadges = useAtomValue(productDataForGaBadgesAtom)
  const finalSaleBadges = useBadges({
    page: 'pdp',
    area: BadgeArea.UPPER_MISC,
    allowedBadges: [badgeTypes.isFinalSaleMessage],
    ...productDataForBadges,
  })

  return (
    <>
      {finalSaleBadges?.map?.(({ badgeID, content }) => (
        <Box
          key={badgeID}
          data-qa="pdp_txt_final_sale_message"
          mt="s"
          className="biz-upper-misc-container pdpv7-final-sale-message"
          sx={styles.infoMessageContainer}
        >
          <Flex sx={styles.infoMsgWrapper}>
            <Box sx={styles.alertIconContainer}>
              <AlertIcon width="16" height="16" />
            </Box>
            <Text variant="body-primary" size="sm" as="div" sx={styles.infoMessage}>
              <HtmlContent content={content} />
            </Text>
          </Flex>
        </Box>
      ))}
    </>
  )
}

export default memo(FinalSaleProductMessage)
