import { useEffect, useRef, useState } from 'react'
import Button from 'toro/components/Button'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useViewportType from 'toro/hooks/useViewportType'
import Text from 'toro/components/Text'
import { useIntl } from 'react-intl'
import { useId } from '@chakra-ui/react'

interface ViewMoreTextProps {
  viewMore: boolean
  text?: string
  authorName?: string
}

const ViewMoreText = ({ viewMore, text, authorName }: ViewMoreTextProps) => {
  const styles = useMultiStyleConfig('UGCStyling')
  const { isDesktop } = useViewportType()
  const { formatMessage } = useIntl()
  const [viewMoreToogle, setViewMoreToogle] = useState<boolean>(viewMore || true)
  const textId = useId()
  const textRef = useRef(null)

  useEffect(() => {
    if (!viewMoreToogle) {
      textRef.current?.focus?.()
    }
  }, [viewMoreToogle])

  const changeView = () => {
    setViewMoreToogle(!viewMoreToogle)
  }

  return (
    <>
      {authorName && <Text sx={styles.authorName}>{authorName}</Text>}
      <Text
        ref={textRef}
        id={textId}
        mt={authorName ? '0' : '12px'}
        ml={!isDesktop ? '16px' : null}
        mr={!isDesktop ? '22px' : null}
        sx={styles.viewMore(viewMoreToogle)}
        maxWidth={!isDesktop ? '340px' : '375px'}
        tabIndex={-1}
      >
        {text}
      </Text>
      <Button
        ml={!isDesktop ? '16px' : null}
        onClick={changeView}
        variant="link"
        sx={styles.buttonViewMore}
        data-qa="ugc_link_image_container_view_more"
        aria-controls={textId}
        aria-expanded={!viewMoreToogle}
      >
        {viewMoreToogle
          ? formatMessage({ id: 'pdp.product.wyngViewMore', defaultMessage: 'VIEW MORE' })
          : formatMessage({ id: 'pdp.product.viewLess', defaultMessage: 'VIEW LESS' })}
      </Button>
    </>
  )
}

export default ViewMoreText
