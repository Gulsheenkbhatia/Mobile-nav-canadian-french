import { useMultiStyleConfig } from '@chakra-ui/react'
import Button from 'toro/components/Button'

type SeeMorePhotosProps = {
  isBottomMost?: boolean
  onClick?: () => void
}

export default function SeeMorePhotos({
  onClick = () => {},
  isBottomMost = false,
}: SeeMorePhotosProps) {
  const styles = useMultiStyleConfig('SeeMorePhotos', isBottomMost && { variant: 'bottomMost' })
  return (
    <Button onClick={onClick} sx={styles.button}>
      See more photos
    </Button>
  )
}
