import Box from 'toro/components/Box'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import ProductVariationLabel from 'toro/components/product/ProductVariationControls/ProductVariationLabel'
import AlignedControlsContainer from 'toro/components/product/ProductVariationControls/AlignedControlsContainer'
import TabControl from 'toro/components/product/ProductVariationControls/NewMegaPDP/TabControl'
import { memo, useMemo } from 'react'
import PropTypes from 'prop-types'
import { BUTTON_LENGTH_THRESHOLD } from 'toro/constants/appConstants'
import { useMultiStyleConfig, useTheme } from '@chakra-ui/react'
import get from 'lodash/get'

function TabControls({
  isSticky,
  tabList,
  tabLabel,
  selectedColor,
  productId,
  selectedTab,
  isPDPLoaded,
  variant = 'sizeVariation',
}) {
  const theme = useTheme()
  const styles = useMultiStyleConfig('ProductVariationCSS', { variant })

  const maxSizeButtonsInRow = useMemo(() => {
    const accLength = tabList.reduce((acc, tab) => acc + get(tab, 'name.length', 0), 0)
    return accLength > BUTTON_LENGTH_THRESHOLD ? 2 : 3
  }, [tabList])

  return (
    <Box sx={styles.tabControlsWrapper}>
      <Box>
        <ProductVariationLabel
          label={tabLabel}
          value={selectedTab?.name}
          megaPDPLabel
          isMegaPDPEligible
          styleVariant={variant}
        />
      </Box>
      <AlignedControlsContainer
        itemsMargin={theme.space?.s}
        maxItemsInRow={maxSizeButtonsInRow}
        label={tabLabel}
        isSticky={isSticky}
        variant={variant}
        type="mega-pdp-tabs"
        style={!isPDPLoaded ? styles?.btnDisabled : {}}
      >
        {tabList.map((item, idx) => {
          const selectedTabName = selectedTab?.name?.toLowerCase()
          const itemName = item?.name?.toLowerCase()
          return (
            <TabControl
              item={item}
              idx={idx}
              key={idx}
              selectedColor={selectedColor}
              productId={productId}
              selected={selectedTabName === itemName}
              variant={variant}
            />
          )
        })}
      </AlignedControlsContainer>
    </Box>
  )
}

TabControls.propTypes = {
  selectedTab: PropTypes.shape({
    name: PropTypes.string,
    tabId: PropTypes.string,
  }),
  setSelectedTab: PropTypes.func,
  isSticky: PropTypes.bool,
  tabList: PropTypes.array,
  tabLabel: PropTypes.string,
  selectedColor: PropTypes.object,
  productId: PropTypes.string,
  isPDPLoaded: PropTypes.bool,
}

export default memo(withErrorBoundaryWrapper(TabControls))
