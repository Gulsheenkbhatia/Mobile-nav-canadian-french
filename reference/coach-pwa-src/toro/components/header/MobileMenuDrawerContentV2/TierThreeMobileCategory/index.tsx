import { memo } from 'react'
import Link from 'toro/components/Link'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import type Category from 'toro/types/categoryTypes'
import type { SystemStyleObject } from '@chakra-ui/react'
import { getMobileNavigationT3DataQa } from 'toro/components/header/MobileMenuDrawerContentV2/helpers'

type TierThreeMobileCategoryProps = {
  t3Category: Category
  styles: Record<string, SystemStyleObject>
  handleNavigation: (
    e: any,
    url: string,
    cgid: string,
    data: { parentCategoryTree: { cgid: string; name: string }[] }
  ) => void | Promise<void>
  isSelected: boolean
  isDarkNavTheme: boolean
}

const TierThreeMobileCategory = ({
  t3Category,
  styles,
  handleNavigation,
  isSelected,
  isDarkNavTheme,
}: TierThreeMobileCategoryProps) => {
  const { url, cgid, parentCategoryTree, navFlyoutCatStyleMob } = t3Category
  const handleT3LinkNavigation = (e: any) => {
    const data = { parentCategoryTree }
    handleNavigation(e, url, cgid, data)
  }

  return (
    <Box
      key={t3Category.cgid}
      sx={{ ...styles.buttonWrapper, ...(isSelected ? styles.selectedCategory : {}) }}
      data-iscoachtopiasubcategory={t3Category.isCoachtopiaSubCategory}
      data-iscoachtopiarootcategory={t3Category.isCoachtopiaRootCategory}
    >
      <Box sx={styles.subCategoryAccordionItemBox}>
        <Link href={t3Category.url} sx={styles.menuLinkLayout} onClick={handleT3LinkNavigation}>
          <Text
            as="span"
            data-qa={getMobileNavigationT3DataQa(t3Category)}
            sx={{
              ...styles.buttonContent,
              color:
                navFlyoutCatStyleMob && isDarkNavTheme
                  ? navFlyoutCatStyleMob
                  : styles.buttonContent.color,
            }}
          >
            {t3Category.name}
          </Text>
        </Link>
      </Box>
    </Box>
  )
}

export default memo(TierThreeMobileCategory)
