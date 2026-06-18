import React from 'react'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import { SuccessIcon as CheckIcon } from 'toro/icons'
import HtmlContent from 'toro/components/HtmlContent'
import isEmpty from 'lodash/isEmpty'

export const renderPromotion =
  (
    styles,
    isBundleProduct = false,
    isOrderLevelPromo = false,
    formatMessage,
    miniCartPromoText = []
  ) =>
  ({ coupon_code, promotion_id }, idx) => {
    const miniCartPromotionText = miniCartPromoText.find(
      (item) => item.promotionId === promotion_id
    )
    if (isBundleProduct || isEmpty(miniCartPromotionText?.promoCallout || coupon_code)) {
      return null
    }

    const renderCheckIconAndContent = (content) => (
      <>
        <CheckIcon className="promo-check-svg" data-qa="mb_icon_badge" />
        {content}
      </>
    )

    return (
      <Text
        variant="body-primary"
        color="var(--color-primary)"
        mb="5px"
        size="sm"
        sx={styles.promotionMsg}
        data-qa="mb_mrkting_badge_msg"
        className="minicart-item-promo"
        key={`minicart-item-promo-${idx}`}
      >
        {isOrderLevelPromo && !coupon_code
          ? renderCheckIconAndContent(
              formatMessage({
                id: 'header.minicart.promotionsuccessmsg',
                defaultMessage: 'Promotion successfully applied',
              })
            )
          : !isEmpty(miniCartPromotionText?.promoCallout)
          ? renderCheckIconAndContent(
              <HtmlContent
                fontSize="12px"
                content={miniCartPromotionText?.promoCallout}
                className="minicart-item-promo"
                key={`applied-promo-${idx}`}
                as="span"
              />
            )
          : miniCartPromotionText && coupon_code
          ? renderCheckIconAndContent(
              formatMessage(
                {
                  id: 'header.minicart.promoappliedmsg',
                  defaultMessage: '{coupon_code} CODE APPLIED',
                },
                { coupon_code }
              )
            )
          : null}
      </Text>
    )
  }

export const renderOrderLevelPromotions = (item, idx) => {
  return (
    <Box display="flex">
      <CheckIcon className="promo-check-svg" data-qa="mb_icon_badge" />
      <Text
        variant="body-primary"
        color="var(--color-success-primary)"
        mb="5px"
        ml="5px"
        size="sm"
        data-qa="mb_mrkting_badge_msg"
        className="minicart-item-promo"
        key={`applied-order-level-promo-${idx}`}
      >
        {item}
      </Text>
    </Box>
  )
}

export const renderNotAppliedPromo = (item, idx) => {
  return (
    <HtmlContent
      fontSize="12px"
      content={item?.promoCallout}
      className="minicart-item-promo"
      key={`not-applied-promo-${idx}`}
    />
  )
}

export const getNonAppliedPromotions = (nonAppliedPromoArr, productPromotions, promoToCheckArr) => {
  nonAppliedPromoArr.push(
    ...productPromotions.filter((item) => {
      let nonExistPromo
      promoToCheckArr.forEach((itemIn) => {
        const [offerText] = itemIn?.item_text.match(/[0-9]+%/) || []
        const textToMatch = offerText || itemIn?.item_text
        if (
          item?.promoName !== textToMatch &&
          !item?.promoCallout?.toLowerCase()?.includes(textToMatch?.toLowerCase())
        ) {
          nonExistPromo = item
        }
      })
      return nonExistPromo
    })
  )
}

export const getNonAppliedPromoArr = (
  productPromotions,
  productLevelPromos,
  promoRenderInfo,
  orderLevelPromos,
  hasPromotion = false
) => {
  let nonAppliedPromoArr = []
  if (!hasPromotion) {
    if (productLevelPromos.length > 0) {
      getNonAppliedPromotions(nonAppliedPromoArr, productPromotions, productLevelPromos)
    } else if (promoRenderInfo.length > 0) {
      getNonAppliedPromotions(nonAppliedPromoArr, productPromotions, promoRenderInfo)
    } else if (orderLevelPromos.length > 0 && hasPromotion) {
      getNonAppliedPromotions(nonAppliedPromoArr, productPromotions, orderLevelPromos)
    } else {
      nonAppliedPromoArr = productPromotions?.filter((item) => item.promoType)
    }
  }

  return nonAppliedPromoArr
}
