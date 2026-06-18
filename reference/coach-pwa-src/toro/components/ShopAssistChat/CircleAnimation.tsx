import React from 'react'
import Box from 'toro/components/Box'
import useStyles from 'toro/hooks/useStyles'
import CharacterSVG from 'toro/icons/giftCharacter.svg'
import SparkleSVG from 'toro/icons/giftSparkle.svg'
import HeartSVG from 'toro/icons/coloredHeart.svg'

const TOTAL_PARTICLES = 24
const RADIUS = 200

const CircleAnimation: React.FC = () => {
  const styles = useStyles()

  const particles = Array.from({ length: TOTAL_PARTICLES }).map((_, i) => ({
    id: i,
    isHeart: i % 3 === 0,
    angle: (360 / TOTAL_PARTICLES) * i,
    delay: i * 0.08,
  }))

  const totalDuration = particles[particles.length - 1].delay + 0.3

  return (
    <Box sx={styles.circleContainer}>
      {particles.map((p) => (
        <Box
          key={p.id}
          sx={styles.particle}
          style={
            {
              '--angle': `${p.angle}deg`,
              '--radius': `${RADIUS}px`,
              animationDelay: `${p.delay}s`,
            } as React.CSSProperties
          }
        >
          {p.isHeart ? (
            <HeartSVG width={32} height={32} aria-hidden="true" focusable={false} />
          ) : (
            <SparkleSVG width={32} height={32} aria-hidden="true" focusable={false} />
          )}
        </Box>
      ))}

      <Box sx={styles.character} style={{ animationDuration: `${totalDuration}s` }}>
        <CharacterSVG width="100%" height="100%" aria-hidden="true" focusable={false} />
      </Box>
    </Box>
  )
}

export default React.memo(CircleAnimation)
