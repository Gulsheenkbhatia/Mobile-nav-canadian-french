import { FC, useMemo, memo } from 'react'
import Flex from 'toro/components/Flex'
import MiniCart from 'toro/components/header/MiniCart'
import OriginalHidden from 'toro/components/Hidden'
import { HeaderRightContentProps } from 'toro/components/header/HeaderMainContent/types'

import SearchWidget from 'toro/components/SearchWidget'
import SearchWidgetCompact from 'toro/components/SearchWidget/SearchWidgetCompact'

import MobileMenuButton from 'toro/components/header/MobileMenuButton'
import WishlistButton from 'toro/components/header/WishlistButton'
import AccountButton from 'toro/components/header/AccountButton'

const Hidden = (props) => <OriginalHidden isFragment {...props} />

const HeaderRightContent: FC<HeaderRightContentProps> = ({
  isSWOutlet,
  siteId,
  styles,
  initializeSearchState,
  onWishlistClick,
  onClick,
  liveEventConfig,
  setIsMiniCartRef,
  setIsHoveredOnMiniCart,
  enableNewGlobalHeader,
  exposeMobileSearchBar,
}) => {
  const miniCart = useMemo(
    () => (
      <MiniCart
        setIsMiniCartRef={setIsMiniCartRef}
        setIsHoveredOnMiniCart={setIsHoveredOnMiniCart}
      />
    ),
    []
  )

  return (
    <Flex sx={styles.upperRightIcons} className="upper-right-icons">
      {!isSWOutlet && (
        <>
          <Hidden onMobile>
            <SearchWidget variant="desktop" onSearchInputFocus={initializeSearchState} />
            <WishlistButton onClick={onWishlistClick} />
            <AccountButton onClick={onClick} />
          </Hidden>

          <Hidden onNonMobile>
            {!enableNewGlobalHeader ? (
              exposeMobileSearchBar ? (
                <AccountButton iconWidth="24px" onClick={onClick} />
              ) : (
                <SearchWidgetCompact
                  liveEventConfig={liveEventConfig}
                  onOpen={initializeSearchState}
                />
              )
            ) : (
              <>
                {miniCart}
                <div>
                  <MobileMenuButton onMenuButtonClick={initializeSearchState} />
                </div>
              </>
            )}
          </Hidden>
        </>
      )}

      {!enableNewGlobalHeader && <div>{miniCart}</div>}
    </Flex>
  )
}

export default memo(HeaderRightContent)
