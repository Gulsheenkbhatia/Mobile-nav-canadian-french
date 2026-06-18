import Text from 'toro/components/Text'
import Box from 'toro/components/Box'
import Link from 'toro/components/Link'
import Button from 'toro/components/Button'
import { useIntl } from 'react-intl'
import { useCertonaOnMount } from 'toro/hooks/useCertonaRequest'
import HtmlContent from 'toro/components/HtmlContent'

const ErrorPage = ({ content = '' }) => {
  const { formatMessage } = useIntl()

  useCertonaOnMount({
    pagetype: 'error',
  })

  return (
    <>
      <Box textAlign="center" margin="96px 0 48px 0">
        <Text size="lg">{formatMessage({ id: 'home.errorPage.Woops' })}</Text>
        <Text
          mt="l"
          variant="body-primary"
          size="lg"
          dangerouslySetInnerHTML={{
            __html: formatMessage({ id: 'home.errorPage.couldNotFindPage' }),
          }}
        ></Text>
        <Link href="/" variant="unstyled">
          <Button mt="l">{formatMessage({ id: 'home.errorPage.continueShoppingButton' })}</Button>
        </Link>
      </Box>
      {content && (
        <HtmlContent lazyLoadImages lazyLoadVideos key={'errorPageContent'} content={content} />
      )}
    </>
  )
}

export default ErrorPage
