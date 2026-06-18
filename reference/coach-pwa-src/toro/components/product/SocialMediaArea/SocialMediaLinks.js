import { useCallback, memo } from 'react'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useIntl } from 'react-intl'
import useAnalytics from 'toro/analytics/useAnalytics'
import memoize from '@formatjs/fast-memoize'

import Text from 'toro/components/Text'
import Link from 'toro/components/Link'
import UnorderedList from 'toro/components/UnorderedList'
import ListItem from 'toro/components/ListItem'
import Box from 'toro/components/Box'
import { subBrandSuffixAtom } from 'store/pdp.atom'
import { useAtomValue } from 'jotai/utils'
import { isSubBrandActiveAtom } from 'store/global.atom'

const SocialMediaLink = ({ IconComponent, ...props }) => {
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)
  const styleProp = !isSubBrandActive ? { transform: 'scaleX(0.72) scaleY(0.8)' } : null

  return (
    <ListItem
      _notLast={{
        pr: 'l',
      }}
    >
      <Link {...props}>
        <IconComponent style={styleProp} />
      </Link>
    </ListItem>
  )
}

function SocialMediaLinks({
  isFacebookSharingEnabled,
  isLineShareEnabled,
  isPinterestSharingEnabled,
  isTwitterSharingEnabled,
  isEmailSharingEnabled,
  productId,
  productName,
  brand,
  thumbnail,
}) {
  const styles = useMultiStyleConfig('SocialMediaAreaTheme')
  const { Facebook, Twitter, Pinterest, Email, LineShare } = useMultiStyleConfig('Icons')
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()
  const subBrandSuffix = useAtomValue(subBrandSuffixAtom)

  const fbTitle = formatMessage(
    {
      id: 'pdp.product.share.facebook.tooltip',
      defaultMessage: `Share ${productName} on Facebook`,
    },
    { productName }
  )
  const pinterestTitle = formatMessage(
    {
      id: 'pdp.product.share.pinterest.tooltip',
      defaultMessage: `Create a Pinterest Pin for ${productName}`,
    },
    { productName }
  )
  const twitteTitle = formatMessage(
    {
      id: 'pdp.product.share.twitter.tooltip',
      defaultMessage: `Share a link to ${productName} on Twitter`,
    },
    { productName }
  )
  const mailTitle = formatMessage(
    {
      id: 'pdp.product.share.mail.tooltip',
      defaultMessage: `Share a link to ${productName} on Mail`,
    },
    { productName }
  )
  const lineShareTitle = formatMessage(
    {
      id: 'pdp.product.share.lineshare.tooltip',
      defaultMessage: 'Line above {productName} to share the link',
    },
    { productName }
  )

  const pageUrl = window.location.href

  const getClickHandler = useCallback(
    memoize((platform) => () => {
      analytics.send('share', {
        eventLocation: 'product',
        eventAction: platform,
        eventLabel: productId?.toString(),
      })
    }),
    [productId]
  )

  return (
    <Box
      name="SocialMediaAreaWrapper"
      sx={styles.SocialMediaAreaWrapper}
      data-qa="cm_pdp_shrthisprod_cntnr"
    >
      <Text
        name="SocialMediaAreaLabel"
        sx={styles.SocialMediaAreaLabel}
        as="span"
        data-qa="pdp_txt_shrthisprod"
      >
        {formatMessage({
          id: `pdp.product.shareThisProduct${subBrandSuffix}`,
          defaultMessage: 'Share This Product',
        })}
      </Text>
      <UnorderedList listStyleType="none" name="FacebookWrapper" sx={styles.FacebookWrapper}>
        {isFacebookSharingEnabled && (
          <SocialMediaLink
            href={`https://www.facebook.com/share.php?u=${encodeURI(pageUrl)}`}
            title={fbTitle}
            data-share="facebook"
            aria-label={fbTitle}
            target="_blank"
            rel="noopener noreferrer"
            data-qa="pdp_link_shrthisprod_fb"
            onClick={getClickHandler('facebook')}
            IconComponent={Facebook}
          />
        )}

        {isLineShareEnabled && (
          <SocialMediaLink
            href={`https://social-plugins.line.me/lineit/share?url=${encodeURI(pageUrl)}`}
            title={lineShareTitle}
            data-share="lineshare"
            aria-label={lineShareTitle}
            target="_blank"
            rel="noopener noreferrer"
            data-qa="cm_pdp_link_shrthisprod_lineshare"
            onClick={getClickHandler('lineShare')}
            IconComponent={LineShare}
          />
        )}

        {isPinterestSharingEnabled && (
          <SocialMediaLink
            href={`https://pinterest.com/pin/create/button/?url=${encodeURI(
              pageUrl + '&description=' + productName + ' | ' + brand + '&media=' + thumbnail
            )}`}
            target="_blank"
            data-share="pinterest"
            title={pinterestTitle}
            aria-label={pinterestTitle}
            rel="noopener noreferrer"
            data-qa="pdp_link_shrthisprod_pintrst"
            onClick={getClickHandler('pinterest')}
            IconComponent={Pinterest}
          />
        )}
        {isTwitterSharingEnabled && (
          <SocialMediaLink
            href={`https://twitter.com/share?url=${encodeURI(
              pageUrl + '&text=' + productName + ' | ' + brand
            )}`}
            data-share="twitter"
            title={twitteTitle}
            aria-label={twitteTitle}
            target="_blank"
            rel="noopener noreferrer"
            data-qa="pdp_link_shrthisprod_twtr"
            onClick={getClickHandler('twitter')}
            IconComponent={Twitter}
          />
        )}
        {isEmailSharingEnabled && (
          <SocialMediaLink
            href={`mailto:?Subject=${encodeURI(`${productName} at ${brand}.com`)}&body=${encodeURI(
              `Hi there! I found this at ${brand}.com and wanted to share with you.\n${productName}\n${pageUrl}`
            )}`}
            data-share="email"
            title={mailTitle}
            data-qa="cm_pdp_link_shrthisprod_mail"
            onClick={getClickHandler('mail')}
            IconComponent={Email}
          />
        )}
      </UnorderedList>
    </Box>
  )
}

export default memo(SocialMediaLinks)
