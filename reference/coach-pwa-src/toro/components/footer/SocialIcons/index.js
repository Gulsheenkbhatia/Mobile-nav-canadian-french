import React, { useMemo, useContext } from 'react'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import Link from 'toro/components/Link'
import Image from 'toro/components/Image'
import useViewportType from 'toro/hooks/useViewportType'
import useAnalytics from 'toro/analytics/useAnalytics'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import isArray from 'lodash/isArray'
import PWAContext from 'components/common/PWAContext'
import get from 'lodash/get'
import {
  InstagramIcon,
  FacebookIcon,
  TwitterIcon,
  TiktokIcon,
  PinterestIcon,
  YoutubeIcon,
  WeiboIcon,
  TumblrIcon,
  LineIcon,
  InstagramOutlineIcon,
  TiktokOutlineIcon,
} from 'toro/icons'

const icons = {
  instagram: <InstagramIcon />,
  facebook: <FacebookIcon />,
  twitter: <TwitterIcon />,
  tiktok: <TiktokIcon />,
  pinterest: <PinterestIcon />,
  youtube: <YoutubeIcon />,
  weibo: <WeiboIcon />,
  tumblr: <TumblrIcon />,
  'line-share': <LineIcon />,
  'instagram-outline': <InstagramOutlineIcon />,
  'tiktok-outline': <TiktokOutlineIcon />,
}

const brandItemsPerRow = {
  'stuart-weitzman': 7,
  'kate-spade': 7,
  default: 6,
  coach: 7,
}

function SocialIcons({ links }) {
  const { isDesktop } = useViewportType()
  const { appData } = useContext(PWAContext)
  const brand = useMemo(() => get(appData, 'brand'), [appData])
  const analytics = useAnalytics()
  const styles = useMultiStyleConfig('FooterSocialIcons')

  const handleLinkClick = (text) => () => {
    analytics.send('navClick', {
      eventLocation: 'footer',
      text,
    })
  }

  if (!isArray(links) || !links.length) {
    return null
  }

  const iconLength = links?.length
  const itemsPerRow = brandItemsPerRow[brand] || brandItemsPerRow.default //Changed the value to 6 for adding new tumblr icon TORO-27838
  const linksArr = [links?.slice(0, itemsPerRow), links?.slice(itemsPerRow, iconLength)]

  if (!linksArr?.length) {
    return null
  }

  return linksArr.map((linksRow, index) => (
    <Flex className="footer-social-links" key={index} sx={styles.flexSocialLinks(isDesktop)}>
      {linksRow &&
        !!linksRow?.length &&
        linksRow.map(
          ({ src, href, target, rel, linkTitle, linkText, dataQa, iconName, divider }) => (
            <Box key={href} sx={styles.boxSocialLinks(divider)}>
              <Link
                href={href}
                target={target}
                title={linkTitle}
                data-text={linkText}
                rel={rel}
                data-qa={dataQa}
                onClick={handleLinkClick(linkText)}
              >
                {src && <Image src={src} lazy />}
                {icons[iconName]}
              </Link>
            </Box>
          )
        )}
    </Flex>
  ))
}

export default withErrorBoundaryWrapper(SocialIcons)
