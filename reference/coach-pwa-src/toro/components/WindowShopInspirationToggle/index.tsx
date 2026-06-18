import Box from 'toro/components/Box'
import { Switch } from '@chakra-ui/react'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import Tooltip from 'toro/components/Tooltip'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { type FC } from 'react'
import { isSubBrandActiveAtom, subBrandAtom } from 'store/global.atom'
import { useAtomValue } from 'jotai/utils'
import usePreference from 'toro/hooks/usePreference_new'
import { EightRaysStarIcon } from 'toro/icons'

type WindowShopInspirationToggleProps = {
  windowShopUrl: string
  enableTooltip?: boolean
}

const WindowShopInspirationToggle: FC<WindowShopInspirationToggleProps> = ({
  windowShopUrl,
  enableTooltip,
}) => {
  const styles = useMultiStyleConfig('WindowShopInspirationToggle')
  const { formatMessage } = useIntl()
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)
  const subBrand = useAtomValue(subBrandAtom)
  const label = formatMessage({
    id: 'header.shopInspirationToggleLabel',
    defaultMessage: 'Window Shop',
  })

  const {
    [subBrand]: { [`${subBrand}HomeURL`]: subBrandHomeURL = `/shop/${subBrand}` },
  } = usePreference({
    [subBrand]: [`${subBrand}HomeURL`, `${subBrand}RootCategory`],
  })
  const router = useRouter()
  const switcherIsChecked = router.asPath.includes(windowShopUrl)
  const handleToggle = (event) => {
    event.target?.checked
      ? router.push(windowShopUrl)
      : router.push(isSubBrandActive ? subBrandHomeURL : '/')
  }

  return (
    <Box sx={styles.switchWrapper}>
      <Box pt="2px">
        <EightRaysStarIcon width="20" height="20" />
      </Box>
      <Box sx={styles.label}>{label}</Box>
      <Box>
        <Tooltip
          label={formatMessage({
            id: 'header.WindowShop.toolTip',
            defaultMessage: 'View our latest eye candy',
          })}
          variant="inspiration"
          sx={styles.tooltip}
          hasArrow
          isOpen={enableTooltip && !switcherIsChecked}
        >
          <Switch
            colorScheme="teal"
            defaultChecked={switcherIsChecked}
            onChange={handleToggle}
            pb="2px"
            sx={styles.trackSwitch}
          />
        </Tooltip>
      </Box>
    </Box>
  )
}

export default WindowShopInspirationToggle
