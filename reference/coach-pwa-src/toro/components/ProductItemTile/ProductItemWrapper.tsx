import Box from 'toro/components/Box'
import Link from 'toro/components/Link'
import useStyles from 'toro/hooks/useStyles'

const ProductItemWrapper = ({
  children,
  url,
  onClick,
}: {
  children: React.ReactNode
  url: string
  onClick: () => void
}) => {
  const styles: any = useStyles()

  return (
    <Box sx={styles.tileWrapper} onClick={onClick}>
      <Link href={url} prefetch={true}>
        {children}
      </Link>
    </Box>
  )
}

export default ProductItemWrapper
