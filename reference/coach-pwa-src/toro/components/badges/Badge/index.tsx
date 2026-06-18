import React, { useContext, useEffect, useState } from 'react'
import HtmlContent from 'toro/components/HtmlContent'
import Text from 'toro/components/Text'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import PWAContext from 'components/common/PWAContext'
import useViewportType from 'toro/hooks/useViewportType'
import { isSWOutletAtom } from 'store/global.atom'
import { useAtomValue } from 'jotai/utils'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import ProductInfoMessage from 'toro/components/product/ProductInfoMessage'
import Experiment from 'toro/components/Experiment'
import { SystemStyleObject } from '@chakra-ui/react'
import { PageTypeLc } from 'toro/components/badges/types'

export enum BadgeVariant {
  MiniCart = 'miniCart',
  LowerPlacementPLP = 'lowerPlacementPLP',
  UpperPlacementPLP = 'upperPlacementPLP',
  OnImagePLP = 'onImagePLP',
  OnImagePDP = 'onImagePDP',
  MarketingContentPdp = 'marketingContentPdp',
  MarketingContentPdpV5 = 'marketingContentPdpV5',
  PromotionAndSale = 'promotionAndSale',
  InventoryStatus = 'inventoryStatus',
  LowInventoryAboveATB = 'lowInventoryAboveATB',
  BentoCarouselBadge = 'bentoCarouselBadge',
  MarketingContentPdpV6 = 'marketingContentPdpV6',
  Pdpv6InventoryStatus = 'pdpv6InventoryStatus',
}

export interface BadgeProps {
  badgeContentSlot?: string
  variant?: BadgeVariant
  page?: PageTypeLc
  templateVariant?: string
}

interface BadgeStyles {
  textVariant?: string
  textSize?: string
  bg?: string
  [key: string]: SystemStyleObject | string | number | undefined
}

const setBadgeBackground = (badgeContentSlot?: string, styles: BadgeStyles = {}): BadgeStyles => {
  const background = badgeContentSlot?.match?.(/\s*background:\s*(#[a-fA-F\d]{6})/)
  if (background) {
    styles.bg = background[1]
  }
  return styles
}

export default function Badge({
  badgeContentSlot,
  variant,
  page,
  templateVariant,
}: BadgeProps): JSX.Element | null {
  const state = useContext(PWAContext)
  const { isMobile } = useViewportType()
  const isPDPTemplateV3Mobile = useExperiment(EXPERIMENTS.PDP_V3) && isMobile
  const isPDPTemplateV6 = useExperiment(EXPERIMENTS.PDP_V6)
  const isSWOutlet = useAtomValue(isSWOutletAtom)
  const isPLP = page === 'plp'
  const isOnImagePdp = variant === 'onImagePDP'
  const marketingContentBadge = isPDPTemplateV3Mobile && variant === 'marketingContentPdp'
  let { textVariant, textSize, ...styles }: BadgeStyles = useStyleConfig('Badge', {
    variant: templateVariant || variant,
    marketingContentBadge,
    isSWOutlet,
    isMobile,
  })
  const { customBadge } = useMultiStyleConfig('Badge', {
    variant: templateVariant || variant,
  })

  const [content, setContent] = useState<string>(() => {
    if (!process.browser) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { transformLinksOnServer } = require('toro/cms/server/utils') // bundle only on server-side
      return transformLinksOnServer(badgeContentSlot, state)
    }
    // on client-side, use the non-transformed markup for the first render
    return badgeContentSlot || ''
  })

  if (variant === 'marketingContentPdp' || variant === 'lowInventoryAboveATB') {
    styles = setBadgeBackground(badgeContentSlot, styles)
  }

  useEffect(() => {
    const runOnClient = async (): Promise<void> => {
      const { transformLinksOnClient } = await import('toro/cms/client/utils')
      const parsed = transformLinksOnClient(badgeContentSlot, state)
      setContent(parsed)
    }

    runOnClient()
  }, [badgeContentSlot, state])

  const getQATag = (): string | undefined => {
    switch (variant) {
      case 'miniCart':
        return 'mb_mrkting_badge'
      case 'lowerPlacementPLP':
        return 'cm_tile_txt_pt_lower_promobadges'
      case 'onImagePLP':
        return 'cm_tile_badge'
      default:
        return undefined
    }
  }

  if (!content && !badgeContentSlot) {
    return null
  }

  const getContentQATag = (): string => {
    switch (variant) {
      case 'onImagePLP':
        return 'plp_custom'
      case 'onImagePDP':
      case 'marketingContentPdp':
      case 'marketingContentPdpV5':
        return 'pdp_txt_badge'
      case 'promotionAndSale':
        return isPLP ? 'cm_tile_badge' : 'pdp_txt_badge'
      default:
        return ''
    }
  }

  if (textVariant) {
    return (
      <Text
        variant={textVariant}
        size={textSize}
        as="div"
        m="auto 0"
        // Set additional class name to identify exact place and badge type.
        // For example: pdp-marketingContentPdp, plp-onImagePLP, .etc
        // OnImagePlp area - Monetate requires "custom-badge plp-onImagePLP" to detect and hide it's badge
        className={`custom-badge ${page}-${variant}`}
        sx={customBadge({
          marketingContentBadge,
          isSWOutlet,
          isMobile,
          isOnImagePdp,
          page,
        })}
        data-qa={getQATag()}
      >
        <HtmlContent
          className={'custom-badge-content'}
          content={content}
          sx={styles}
          data-qa={getContentQATag()}
        />
      </Text>
    )
  }

  return (
    <>
      <Experiment forIDs={EXPERIMENTS.PDP_V3} forMobile>
        {variant === 'inventoryStatus' && !isPDPTemplateV6 ? (
          <ProductInfoMessage className="product-info-message-alert" variant="alert" size="sm">
            <HtmlContent
              className="biz-inventory-status"
              content={content}
              data-qa={getContentQATag()}
            />
          </ProductInfoMessage>
        ) : (
          <HtmlContent
            className="biz-inventory-status"
            content={content}
            sx={styles}
            data-qa={getContentQATag()}
          />
        )}
      </Experiment>
      <Experiment notForIDs={EXPERIMENTS.PDP_V3} alwaysOnForDesktop>
        <HtmlContent
          className="biz-inventory-status"
          content={content}
          sx={styles}
          data-qa={getContentQATag()}
        />
      </Experiment>
    </>
  )
}
