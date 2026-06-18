import { useEffect, useState } from 'react'
import Box from 'toro/components/Box'
import useStyles from 'toro/hooks/useStyles'
import HeartIcon from 'toro/icons/coloredHeart.svg'
import GiftBox from 'toro/icons/giftBox.svg'

type Heart = {
  id: number
}

const HEART_INTERVAL_MS = 1000
const HEART_LIFETIME_MS = 2000

export default function GiftWithHearts() {
  const styles = useStyles()
  const [hearts, setHearts] = useState<Heart[]>([])

  useEffect(() => {
    let id = 0

    const interval = setInterval(() => {
      const newHeart = { id: id++ }

      setHearts((prev) => [...prev, newHeart])

      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== newHeart.id))
      }, HEART_LIFETIME_MS)
    }, HEART_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [])

  return (
    <Box sx={styles.giftWrapper} aria-hidden="true">
      <GiftBox aria-hidden="true" focusable="false" />

      {hearts.map((heart) => (
        <Box key={heart.id} sx={styles.giftHeart} aria-hidden="true">
          <Box sx={styles.giftHeartWind}>
            <HeartIcon aria-hidden="true" focusable="false" />
          </Box>
        </Box>
      ))}
    </Box>
  )
}
