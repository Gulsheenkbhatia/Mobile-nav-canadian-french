import Box from 'toro/components/Box'
import usePreference from 'toro/hooks/usePreference_new'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import { useIntl } from 'react-intl'
import InlineSearchInput from 'toro/components/AdaptableInlineSearch/InlineSearchInput'
import InlineSearchSuggestions from 'toro/components/AdaptableInlineSearch/InlineSearchSuggestions'
import InlineSearchStarsIcons from 'toro/components/AdaptableInlineSearch/InlineSearchStarsIcons'
import get from 'lodash/get'
import { renderWithSpecialCharacters } from 'toro/helpers/strings'

function AdaptableInlineSearch() {
  const styles = useStyleConfig('AdaptableInlineSearch')
  const { formatMessage } = useIntl()

  const {
    adaptiveExperience: { inlineSearch: inlineSearchPreference },
  } = usePreference({
    adaptiveExperience: ['inlineSearch'],
  })
  const inlineSearch = get(inlineSearchPreference, 'inlineSearch')

  const title = renderWithSpecialCharacters(
    formatMessage({
      id: 'plp.inlineSearch.title',
      defaultMessage: 'Search & discover your new fav',
    })
  )

  const label = renderWithSpecialCharacters(
    formatMessage({
      id: 'plp.inlineSearch.suggestionsTitle',
      defaultMessage: 'Suggested searches',
    })
  )

  const shouldDisplayStars = get(inlineSearch, 'showStars')

  return (
    <Box sx={styles.inlineSearchContainer}>
      <Box sx={styles.inlineSearchWraper}>
        {shouldDisplayStars && <InlineSearchStarsIcons styles={styles} />}

        <Box as="h2" sx={styles.searchTitle}>
          {title}
        </Box>
        <InlineSearchInput styles={styles} />

        <Box sx={styles.suggestionsWrapper}>
          <InlineSearchSuggestions styles={styles} label={label} />
        </Box>
      </Box>
    </Box>
  )
}

export default AdaptableInlineSearch
