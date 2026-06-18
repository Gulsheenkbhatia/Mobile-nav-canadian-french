import Flex from 'toro/components/Flex'
import HtmlContent from 'toro/components/HtmlContent'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

const HelpBlock = ({ content }) => {
  const styles = useMultiStyleConfig('HelpBlock')
  if (!content) {
    return null
  }

  return (
    <Flex justifyContent="center" sx={styles.helpBlockContainer}>
      <HtmlContent content={content} sx={styles.helpBlockContent} />
    </Flex>
  )
}
export default HelpBlock
