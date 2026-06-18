import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import Button from 'toro/components/Button'
import { useIntl } from 'react-intl'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

interface WhoopsMessageProps {
  closeAeDrawer: () => void
}

const WhoopsMessage = ({ closeAeDrawer }: WhoopsMessageProps) => {
  const { formatMessage } = useIntl()
  const styles = useMultiStyleConfig('AEDrawer')
  return (
    <>
      <Text sx={styles.whoopsMessage}>
        {formatMessage({
          id: 'header.aeDrawer.whoops',
          defaultMessage: "Whoops! We couldn't load the products.",
        })}
      </Text>
      <Flex sx={styles.drawerCloseBtnWrapper}>
        <Button onClick={closeAeDrawer} sx={styles.drawerCloseBtn}>
          {formatMessage({
            id: 'header.aeDrawer.close',
            defaultMessage: 'Close',
          })}
        </Button>
      </Flex>
    </>
  )
}

export default WhoopsMessage
