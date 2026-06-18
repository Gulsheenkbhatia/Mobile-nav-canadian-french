import { memo, useCallback } from 'react'
import type { KeyboardEvent } from 'react'
import ScrollableContent from 'toro/components/ScrollableContent'
import Text from 'toro/components/Text'
import Box from 'toro/components/Box'
import Link from 'toro/components/Link'
import Flex from 'toro/components/Flex'
import type Category from 'toro/types/categoryTypes'
import type { SystemStyleObject } from '@chakra-ui/react'
import { getDataQa } from 'toro/components/header/MobileMenuDrawerContentV2/helpers'
import SubBrandLogoDark from 'sub-theme-tokens/logo/primary-black.svg'
import SubBrandLogoLight from 'sub-theme-tokens/logo/primary-white.svg'
import { NavChevronRightIcon } from 'toro/icons'

type TierOneMobileCategoriesProps = {
  t1Categories: Category[]
  onClickT1: (cgid: string, closeMenu?: boolean, name?: string) => void
  styles: Record<string, SystemStyleObject>
  t1ActiveCgid: string
  isDarkNavTheme: boolean
  isSubBrandEnabled: boolean
  isOneCoachTabEnabled: boolean
  activeT1ItemRef: React.RefObject<HTMLDivElement>
  isFY26Drawer?: boolean
}

const TierOneMobileCategories = ({
  onClickT1,
  t1Categories,
  styles,
  t1ActiveCgid,
  isDarkNavTheme,
  isSubBrandEnabled,
  isOneCoachTabEnabled,
  activeT1ItemRef,
  isFY26Drawer = false,
}: TierOneMobileCategoriesProps) => {
  const onT1RowKeyDown = useCallback(
    (cgid: string, name: string | undefined) => (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onClickT1(cgid, false, name)
      }
    },
    [onClickT1]
  )

  const t1List = t1Categories.map(
    ({
      name,
      cgid,
      url,
      subCategories,
      isCoachtopiaSubCategory,
      isCoachtopiaRootCategory,
      navFlyoutCatStyleMob,
    }) => {
      const isActive = cgid === t1ActiveCgid
      const textSx = isFY26Drawer
        ? {
            ...styles?.t1VerticalText,
            fontWeight: isActive ? 700 : 400,
            color:
              navFlyoutCatStyleMob && isDarkNavTheme
                ? navFlyoutCatStyleMob
                : styles?.t1VerticalText?.color ?? styles?.t1ItemText?.color,
          }
        : {
            ...styles?.t1ItemText,
            color:
              navFlyoutCatStyleMob && isDarkNavTheme
                ? navFlyoutCatStyleMob
                : styles?.t1ItemText?.color,
          }

      const t1Content = (
        <Box
          className={isActive ? 'active' : ''}
          sx={isFY26Drawer ? { flex: 1, minWidth: 0 } : styles?.t1Item}
          data-iscoachtopiasubcategory={isCoachtopiaSubCategory}
          data-iscoachtopiarootcategory={isCoachtopiaRootCategory}
        >
          <Text
            className={isActive ? 'active' : ''}
            sx={textSx}
            data-qa={`l1_nav_${cgid}`}
          >
            {cgid === 'coachtopia' && isSubBrandEnabled && isOneCoachTabEnabled ? (
              isDarkNavTheme ? (
                <SubBrandLogoLight style={{ height: '20px' }} />
              ) : (
                <SubBrandLogoDark style={{ height: '20px' }} />
              )
            ) : (
              name || ''
            )}
          </Text>
        </Box>
      )

      if (isFY26Drawer) {
        const rowInner = (
          <Flex
            ref={isActive ? activeT1ItemRef : null}
            sx={styles?.t1VerticalRow}
            align="center"
            justify="space-between"
            w="100%"
          >
            {t1Content}
            {subCategories?.length ? (
              <Box sx={styles?.t1VerticalChevron} aria-hidden>
                <NavChevronRightIcon width="24px" height="24px" color="currentColor" />
              </Box>
            ) : null}
          </Flex>
        )

        return subCategories?.length > 0 ? (
          <Box
            key={cgid}
            role="button"
            tabIndex={0}
            onClick={() => onClickT1(cgid, false, name)}
            onKeyDown={onT1RowKeyDown(cgid, name)}
          >
            {rowInner}
          </Box>
        ) : (
          <Link
            key={cgid}
            href={url}
            prefetch={true}
            sx={{ display: 'block', width: '100%' }}
            onClick={() => onClickT1(cgid, true, name)}
          >
            {rowInner}
          </Link>
        )
      }

      return subCategories?.length > 0 ? (
        <Box
          key={cgid}
          ref={isActive ? activeT1ItemRef : null}
          sx={styles?.t1ItemWrapper}
          onClick={() => onClickT1(cgid, false, name)}
        >
          {t1Content}
        </Box>
      ) : (
        <Link
          key={cgid}
          ref={isActive ? activeT1ItemRef : null}
          href={url}
          prefetch={true}
          sx={styles?.t1ItemWrapper}
          onClick={() => onClickT1(cgid, true, name)}
        >
          {t1Content}
        </Link>
      )
    }
  )

  if (isFY26Drawer) {
    return (
      <Flex
        as="nav"
        aria-label="Primary"
        sx={styles?.t1VerticalList}
        flexDirection="column"
        data-qa={getDataQa('MenuContainer', 1)}
      >
        {t1List}
      </Flex>
    )
  }

  return (
    <ScrollableContent
      fadeColor="var(--scheme-bg-color)"
      mx="var(--spacing-4)"
      minH="50px"
      data-qa={getDataQa('MenuContainer', 1)}
    >
      {t1List}
    </ScrollableContent>
  )
}

export default memo(TierOneMobileCategories)
