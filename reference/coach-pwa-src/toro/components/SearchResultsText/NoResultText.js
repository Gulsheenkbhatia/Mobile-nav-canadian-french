import Text from 'toro/components/Text'
import { useIntl } from 'react-intl'
import useViewportType from 'toro/hooks/useViewportType'
import PropTypes from 'prop-types'

const NoResultText = ({ query, styles }) => {
  const { isMobile } = useViewportType()
  const { formatMessage } = useIntl()
  const noResultsText = formatMessage({
    id: 'search.noResultsFoundFor',
    defaultMessage: 'No Results Found for',
  })
  const noResultQuery = `"${query}"`
  return (
    <Text
      name="NoResultText"
      sx={styles.NoResultText(isMobile)}
      minWidth={0}
      variant="secondary"
      data-qa="hs_nsr_txt_hdng"
    >
      {noResultsText}&nbsp;
      <Text
        name="NoResultTextQuery"
        sx={styles.NoResultTextQuery(isMobile)}
        minWidth={0}
        variant="secondary"
        display="inline"
        as="span"
      >
        {noResultQuery}
      </Text>
    </Text>
  )
}

NoResultText.propTypes = {
  query: PropTypes.string,
  styles: PropTypes.shape({
    NoResultText: PropTypes.func,
    NoResultTextQuery: PropTypes.func,
  }),
}

NoResultText.defaultProps = {
  query: '',
  styles: {
    NoResultText: () => ({}),
    NoResultTextQuery: () => ({}),
  },
}

export default NoResultText
