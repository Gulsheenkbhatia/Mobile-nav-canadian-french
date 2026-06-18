import { memo } from 'react'
import { Accordion } from '@chakra-ui/react'
import AccordionButton from 'toro/components/AccordionButton'
import AccordionItem from 'toro/components/AccordionItem'
import AccordionPanel from 'toro/components/AccordionPanel'
import TierThreeMobileCategory from 'toro/components/header/MobileMenuDrawerContentV2/TierThreeMobileCategory'
import Box from 'toro/components/Box'
import Link from 'toro/components/Link'
import Text from 'toro/components/Text'
import getAPIURL from 'helpers/getAPIURL'
import type Category from 'toro/types/categoryTypes'
import type { SystemStyleObject } from '@chakra-ui/react'
import {
  getDataQa,
  getMobileNavigationT2DataQA,
} from 'toro/components/header/MobileMenuDrawerContentV2/helpers'
import {
  AccordionIcon,
  AccordionIconExpanded,
} from 'toro/components/header/MobileMenuDrawerContentV2/icons'
import { useAtomValue } from 'jotai/utils'
import { selectedMobileItemAtom } from 'store/menu-data.atom'
import useAnalytics from 'toro/analytics/useAnalytics'

type TierTwoMobileCategoryProps = {
  t2Category: Category
  styles: Record<string, SystemStyleObject>
  handleNavigation: (
    e: any,
    url: string,
    cgid: string,
    data: { parentCategoryTree: { cgid: string; name: string }[] },
    name?: string
  ) => void | Promise<void>
  getSubCategoriesByCgid: (string) => Category[]
  isDarkNavTheme: boolean
  isFY26Drawer?: boolean
}

const TierTwoMobileCategory = ({
  t2Category,
  styles,
  handleNavigation,
  getSubCategoriesByCgid,
  isDarkNavTheme,
  isFY26Drawer = false,
}: TierTwoMobileCategoryProps) => {
  const analytics = useAnalytics()
  const selectedMobileItem = useAtomValue(selectedMobileItemAtom)
  const {
    url,
    cgid,
    name,
    parentCategoryTree,
    isCoachtopiaSubCategory,
    isCoachtopiaRootCategory,
    navFlyoutCatStyleMob,
  } = t2Category
  const subCategories = getSubCategoriesByCgid(cgid)
  const hasChildren = subCategories.length > 0
  const textContentProps = {
    sx: {
      ...styles.buttonContent,
      ...(isFY26Drawer ? styles.tierTwoFY26ButtonContent : {}),
      color:
        navFlyoutCatStyleMob && isDarkNavTheme ? navFlyoutCatStyleMob : styles.buttonContent?.color,
    },
    'data-qa': getMobileNavigationT2DataQA(t2Category),
  }

  const handleT2LinkNavigation = (e: any) => {
    const data = { parentCategoryTree }
    handleNavigation(e, url, cgid, data, name)
  }

  const handleT2AccordionClick = (isExpanded: boolean) => {
    !isExpanded &&
      analytics.send('navClick', {
        eventLocation: 'header',
        text: name,
        navigationItemData: { parentCategoryTree },
      })
  }

  const selectedStyle = cgid === selectedMobileItem.cgid ? styles.selectedCategory : {}

  if (!hasChildren) {
    return (
      <Box
        key={cgid}
        sx={{
          ...styles.buttonWrapper,
          ...selectedStyle,
          ...(isFY26Drawer ? styles.tierTwoFY26LeafRow : {}),
        }}
        as="button"
      >
        <Box sx={styles.accordionItemBox}>
          <Link
            href={url}
            sx={styles.menuLinkLayout}
            onClick={handleT2LinkNavigation}
            prefetchUrl={getAPIURL(url)}
            prefetch={url?.includes('/shop/')}
          >
            <Text as="span" {...textContentProps}>
              {name}
            </Text>
          </Link>
        </Box>
      </Box>
    )
  }

  return (
    <AccordionItem
      key={cgid}
      sx={styles.accordionItem}
      data-qa={getDataQa('menuItem', 2)}
      data-iscoachtopiasubcategory={isCoachtopiaSubCategory}
      data-iscoachtopiarootcategory={isCoachtopiaRootCategory}
    >
      {({ isExpanded }) => (
        <>
          <AccordionButton
            py={0}
            sx={{
              ...styles.accordionButton,
              ...(isFY26Drawer ? styles.tierTwoFY26AccordionButton : {}),
            }}
            onClick={() => handleT2AccordionClick(isExpanded)}
            color={navFlyoutCatStyleMob}
          >
            <Box
              sx={{
                ...styles.buttonWrapper,
                ...styles.noBackground,
              }}
            >
              <Text as="span" {...textContentProps}>
                {name}
              </Text>
              {isExpanded ? (
                <AccordionIconExpanded data-qa="expandedMenu" />
              ) : (
                <AccordionIcon data-qa="collapasedMenu" />
              )}
            </Box>
          </AccordionButton>

          <AccordionPanel sx={styles.accordionPanel} data-qa={getDataQa('allMenuContainer', 3)}>
            <Accordion w="100%" allowToggle>
              {subCategories.map((subCategory) => (
                <TierThreeMobileCategory
                  key={subCategory.cgid}
                  t3Category={subCategory}
                  handleNavigation={handleNavigation}
                  styles={styles}
                  isSelected={subCategory?.cgid === selectedMobileItem.cgid}
                  isDarkNavTheme={isDarkNavTheme}
                />
              ))}
            </Accordion>
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  )
}

export default memo(TierTwoMobileCategory)
