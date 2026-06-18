import Flex from 'toro/components/Flex'
import useStyles from 'toro/hooks/useStyles'

const PostAddToCartDrawer2upGrid = ({ children }) => {
  const styles = useStyles()

  return <Flex sx={styles.grid2Up}>{children}</Flex>
}

export default PostAddToCartDrawer2upGrid
