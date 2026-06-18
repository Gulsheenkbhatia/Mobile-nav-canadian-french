import React, { memo, useMemo, useState, useContext, useEffect } from 'react'
import get from 'lodash/get'
import PWAContext from 'components/common/PWAContext'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import Box from 'toro/components/Box'
import Menu from 'toro/components/Menu'
import MenuButton from 'toro/components/MenuButton'
import MenuList from 'toro/components/MenuList'
import { MenuItemOption, MenuOptionGroup, Button } from '@chakra-ui/react'
import useTheme from 'toro/hooks/useTheme'
import useHasMounted from 'toro/hooks/useHasMounted'
import useAnalytics from 'toro/analytics/useAnalytics'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import { useAtomSetter } from 'toro/helpers/jotai/useAtomSetter'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import {
  currentSortAtom,
  searchResultsReloadingAtom,
  setSortHistoryAtom,
  setSortingRuleAtom,
  sortingRuleAtom,
  sortOptionsAtom,
} from 'store/search-results.atom'
import { useIntl } from 'react-intl'
import {
  CaretUpIcon,
  CaretDownIcon,
  ChevronBoldUpIcon,
  ChevronBoldDownIcon,
  CheckmarkIcon,
} from 'toro/icons'
import { isCompletePlpV3DesktopAtom } from 'store/plp.atom'
import useIsKS from 'toro/helpers/isKS'
import { isJapan as isJP } from 'toro/helpers/localization'

function Sort({ variant, ...props }) {
  const { appData } = useContext(PWAContext)
  const siteId = get(appData, 'siteId')
  const isJapan = isJP(siteId)
  const { formatMessage } = useIntl()
  const theme = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const analytics = useAnalytics()
  const { fontSizes, colors } = theme
  const srule = useAtomValue(sortingRuleAtom)
  const sortOptions = useAtomValue(sortOptionsAtom)
  const currentSort = useAtomValue(currentSortAtom)
  const setReloading = useAtomSetter(searchResultsReloadingAtom)
  const setSort = useAtomSetter(setSortingRuleAtom)
  const isCompletePlpV3Desktop = useAtomValue(isCompletePlpV3DesktopAtom)
  const {
    generalConfiguration: { siteIdentifier },
  } = usePreferenceNew({
    generalConfiguration: ['siteIdentifier'],
  })
  const isCoachSite = ['coach', 'coach-outlet'].includes(siteIdentifier)
  const isKS = useIsKS()
  const showCheckmark = (isKS || isCoachSite) && isCompletePlpV3Desktop

  const setLastAppliedSortValue = useUpdateAtom(setSortHistoryAtom)

  useEffect(() => {
    if (currentSort) {
      setLastAppliedSortValue(currentSort)
    }
  }, [currentSort, setLastAppliedSortValue])

  const handleMenuClose = () => {
    setIsMenuOpen(false)
  }

  const defaultSortOptionName = useMemo(
    () => sortOptions?.find((item) => item.isDefault)?.name,
    [sortOptions]
  )

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const handleClick = (sortOption) => (e) => {
    e.preventDefault()
    setIsMenuOpen(false)
    if (sortOption && srule?.toLowerCase?.() !== sortOption?.toLowerCase?.()) {
      setSort(sortOption)
      setReloading(true)
      window.preserveDataLayer = true
      analytics.send('sort', {
        eventLocation: 'header',
        eventAction: 'apply',
        sortOption,
      })
    }
  }

  const MenuButtonIcon = useMemo(() => (isMenuOpen ? CaretUpIcon : CaretDownIcon), [isMenuOpen])
  const MenuButtonIconDesktopV3 = isMenuOpen ? ChevronBoldUpIcon : ChevronBoldDownIcon
  const styles = useMultiStyleConfig('Sort', { variant })
  const isMounted = useHasMounted()

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleMenuToggle()
    }
    if (event.key === 'Escape' && isMenuOpen) {
      event.preventDefault()
      setIsMenuOpen(false)
    }
  }

  return (
    <Flex height="24px" alignItems="center" {...props} data-qa="d_plpsrt_sctn_srtby">
      <Text name="sortText" sx={styles.sortByText} data-qa="d_plpsrt_txt_srtby">
        {formatMessage({
          id: 'plp.filter.sortBy',
          defaultMessage: 'Sort by',
        })}
        {isJapan || !isCompletePlpV3Desktop ? ':' : ''}
      </Text>
      <Box
        className="sortDrawer"
        data-qa="d_plpsrt_drpdwn_srtby"
        onMouseEnter={() => {
          setIsMenuOpen(true)
        }}
        onMouseLeave={() => setIsMenuOpen(false)}
      >
        <Menu
          isOpen={isMenuOpen}
          onClose={handleMenuClose}
          trigger="none"
          closeOnSelect={false}
          closeOnBlur={true}
        >
          <MenuButton
            name="sortButton"
            as={Button}
            className="Menusort"
            colorScheme="none"
            variant="ghost"
            onClick={handleMenuToggle}
            onKeyDown={handleKeyDown}
            aria-label={`Sort by: ${currentSort || defaultSortOptionName}`}
            rightIcon={
              isCompletePlpV3Desktop ? (
                <MenuButtonIconDesktopV3 width="16" height="16" />
              ) : (
                <MenuButtonIcon width="24" height="24" />
              )
            }
            sx={{
              '& span': { textTransform: 'capitalize' },
              '& svg': { transform: 'scale(1.3)', width: `${fontSizes.xl}` },
              ...styles.sortButton,
            }}
            data-qa="d_plpsrt_drpdwn_srtby"
          >
            {currentSort || defaultSortOptionName}
          </MenuButton>
          {isMounted && (
            <MenuList
              className="menuList"
              sx={styles.sortOptionsWrapper}
              minWidth="188px"
              zIndex="14"
              aria-label="Sort options"
            >
              {sortOptions?.length > 0 && (
                <MenuOptionGroup
                  value={srule || sortOptions?.find((item) => item.isDefault)?.code}
                  type="radio"
                >
                  {sortOptions.map((option) => {
                    const isSelected = srule ? srule === option.code : option.isDefault
                    return (
                      <MenuItemOption
                        name="sortOptions"
                        key={`option-${option.code}`}
                        sx={
                          isSelected
                            ? { ...styles.sortOptions, ...styles.sortOptionsSRule }
                            : { ...styles.sortOptions }
                        }
                        onClick={handleClick(option.code)}
                        value={option.code}
                        data-qa={'d_plpsrt_select_srtby' + `_${option.id}`}
                        _hover={{ bg: colors.main.lightGray }}
                        icon={
                          showCheckmark && isSelected ? (
                            <CheckmarkIcon width="16px" height="16px" />
                          ) : null
                        }
                        aria-label={option.name}
                      >
                        {option.name}
                      </MenuItemOption>
                    )
                  })}
                </MenuOptionGroup>
              )}
            </MenuList>
          )}
        </Menu>
      </Box>
    </Flex>
  )
}

export default withErrorBoundaryWrapper(memo(Sort))
