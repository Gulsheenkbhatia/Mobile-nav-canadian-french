import Text from 'toro/components/Text'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import PropTypes from 'prop-types'
import { FormErrorOutlineIcon as AlertIcon } from 'toro/icons'

function ProductInfoMessage({ variant, textSize, textProps, children, isQuickView, sx, ...props }) {
  const dataQa = isQuickView
    ? 'pdp_txt_notifyme_alert'
    : variant === 'alert' && 'pdp_txt_notifyme_alert'
  const styles = useMultiStyleConfig('ProductInfoMessage', { variant })
  return (
    <Box
      {...props}
      {...(dataQa ? { 'data-qa': dataQa } : {})}
      sx={{ ...styles.infoMessageContainer, ...sx }}
    >
      <Flex sx={styles.infoMsgWrapper}>
        {variant === 'alert' && (
          <Box sx={styles.alertIconContainer}>
            <AlertIcon width="16" height="16" />
          </Box>
        )}
        <Text
          variant="body-primary"
          size={textSize}
          {...textProps}
          as="div"
          sx={styles.infoMessage}
        >
          {children}
        </Text>
      </Flex>
    </Box>
  )
}

export default withErrorBoundaryWrapper(ProductInfoMessage)

ProductInfoMessage.propTypes = {
  variant: PropTypes.string,
  textSize: PropTypes.string,
  textProps: PropTypes.object,
  isQuickView: PropTypes.bool,
}

ProductInfoMessage.defaultProps = {
  textSize: 'md',
  textProps: {},
  sx: {},
}
