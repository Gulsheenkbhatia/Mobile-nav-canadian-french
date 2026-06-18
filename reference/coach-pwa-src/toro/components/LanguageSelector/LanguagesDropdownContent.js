import React, { forwardRef } from 'react'
import useTheme from 'toro/hooks/useTheme'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import { LANGUAGE_FLAG_ICONS } from 'toro/constants/ContentFlag'
import Link from 'toro/components/Link'
import useAnalytics from 'toro/analytics/useAnalytics'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import getCountryOptionsFromPriceLabel from 'toro/helpers/getCountryOptions'
import { NavChevronRightIcon } from 'toro/icons'
import isCA from 'toro/helpers/isCA'

const LanguagesDropdownContent = forwardRef(({ content, setRedirectLink, selectedFlag }, ref) => {
  const theme = useTheme()
  const analytics = useAnalytics()
  const iconSize = theme.space.l
  const styles = useMultiStyleConfig('LanguageSelector')

  const onLanguageClick = (e, language, isSelectedLanguage, label) => {
    e.preventDefault()
    const currentCountryOptions = getCountryOptionsFromPriceLabel(label)
    const [country, currency] = currentCountryOptions
    const selectedValue = {
      country,
      language: language?.name,
      currency,
    }

    let languageHref = language?.href
    if (!isSelectedLanguage && languageHref) {
      setRedirectLink(languageHref)
    }
    analytics.send('selectCountry', {
      eventAction: 'country select',
      language: language,
      countryList: content,
      selectedValue: selectedValue,
    })
  }

  return (
    <Box width="255px">
      <Text
        variant="body-primary"
        size="sm"
        sx={styles.languageDropdownLocationTitle}
        data-qa="d_hdr_drpdwn_hdr_txt"
      >
        {content?.title}
      </Text>
      <Flex flexDirection="column" ref={ref} sx={styles.languageDropdownMainContainer}>
        {content?.items?.map(({ label, flag, languages, dataQA }) => (
          <Flex
            as="ul"
            key={flag}
            alignItems="center"
            sx={styles.languageDropdownIconContainer(flag, selectedFlag)}
          >
            <Flex as="li" alignItems="center" flex={'0 0 155px'}>
              <Link
                href={languages?.[0]?.href ?? ''}
                variant="unstyled"
                display="flex"
                alignItems="center"
                className="languageClick"
                onClick={(e) => onLanguageClick(e, languages?.[0], flag === selectedFlag, label)}
              >
                <Box
                  w={iconSize}
                  data-qa={
                    dataQA?.flag ||
                    (flag === selectedFlag
                      ? 'd_hdr_cs_drpdwn_flag_active'
                      : 'd_hdr_cs_drpdwn_flag_us')
                  }
                  aria-hidden="true"
                >
                  {LANGUAGE_FLAG_ICONS[flag]}
                </Box>
                <Text
                  variant="body-primary"
                  size="sm"
                  sx={styles.languageCountrySelectorText}
                  data-qa={
                    dataQA?.label ||
                    (flag === selectedFlag
                      ? 'd_hdr_cs_drpdwn_label_active'
                      : 'd_hdr_cs_drpdwn_label_us')
                  }
                >
                  {label}
                </Text>
              </Link>
            </Flex>
            <Flex as="li" flex={'1 0 auto'} sx={styles.languagesWrapper}>
              {languages?.map((language, languageIndex) => (
                <Link
                  onClick={(e) =>
                    onLanguageClick(
                      e,
                      language,
                      flag === selectedFlag && languageIndex === content?.selectedLanguageIndex,
                      label
                    )
                  }
                  key={`${flag}-${language?.name}`}
                  href={language.href}
                  variant="unstyled"
                  height={iconSize}
                  display="flex"
                  alignItems="center"
                  className="DropDownlanguagelink"
                  sx={styles.dropdownLanguageLink}
                >
                  <Text
                    variant="body-primary"
                    size="sm"
                    cursor="pointer"
                    sx={styles.dropdownLanguageText(languageIndex, content, flag, selectedFlag)}
                    data-qa={
                      flag === selectedFlag
                        ? 'd_hdr_cs_drpdwn_lang_active'
                        : isCA()
                        ? languageIndex === content?.selectedLanguageIndex
                          ? 'd_hdr_cs_drpdwn_lang1_ca'
                          : 'd_hdr_cs_drpdwn_lang2_ca'
                        : dataQA?.lang
                    }
                  >
                    {language?.name}
                  </Text>
                </Link>
              ))}
            </Flex>
          </Flex>
        ))}
      </Flex>
      {content?.viewMore?.viewMoreText?.length > 0 && content?.viewMore?.viewMoreLink?.length > 0 && (
        <Flex alignItems="center" width="100%" sx={styles.dropdownViewMoreContainer}>
          <Link href={content.viewMore.viewMoreLink}>
            <Text
              variant="body-primary"
              size="sm"
              data-qa="d_hdr_cs_vmo_label_country"
              sx={styles.dropdownViewMoreText}
            >
              {content.viewMore.viewMoreText}
            </Text>
          </Link>
          <Box sx={styles.dropdownNextArrowWrapper}>
            <NavChevronRightIcon width="12px" height="12px" viewBox="0 0 24 24" />
          </Box>
        </Flex>
      )}
    </Box>
  )
})

export default LanguagesDropdownContent
