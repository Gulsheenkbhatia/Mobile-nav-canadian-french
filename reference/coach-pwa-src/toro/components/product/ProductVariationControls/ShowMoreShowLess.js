import React from 'react'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import PropTypes from 'prop-types'
import useStyles from 'toro/hooks/useStyles'

function ShowMoreShowLess({ text, onClick }) {
  const styles = useStyles()

  return (
    <Box
      sx={styles.showMoreShowLessWrapper}
      maxWidth="80px"
      minWidth="80px"
      minHeight="80px"
      as="button"
      onClick={onClick}
    >
      <Text sx={styles.showMoreShowLessText}>{text}</Text>
    </Box>
  )
}

ShowMoreShowLess.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
}

ShowMoreShowLess.defaultProps = {
  onClick: () => {},
}

export default withErrorBoundaryWrapper(ShowMoreShowLess)
