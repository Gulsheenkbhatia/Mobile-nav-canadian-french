import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import { CaretDownIcon as ArrowDown } from 'toro/icons'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { LANGUAGE_FLAG_ICONS } from 'toro/constants/ContentFlag'

const SelectedCountryInfo = ({ selector, enableArrow = true }) => {
  const styles = useMultiStyleConfig('LanguageSelector')
  return (
    <>
      <Box
        className="countrySelector"
        w="24px"
        data-qa={selector?.dataQA?.flag || 'd_hdr_cs_flag'}
        aria-label={selector?.countryFullName ? selector?.countryFullName : 'Language Selector'}
      >
        {selector?.flag && LANGUAGE_FLAG_ICONS[selector.flag]}
      </Box>
      <Text
        variant="body-primary"
        size="sm"
        sx={styles.languageSelectionText}
        data-qa={selector?.dataQA?.label || 'm_hdr_txt_cs_label'}
      >
        {selector?.label}
      </Text>
      {enableArrow && (
        <Box w="24px">
          <ArrowDown width="24" height="24" />
        </Box>
      )}
    </>
  )
}

export default SelectedCountryInfo
