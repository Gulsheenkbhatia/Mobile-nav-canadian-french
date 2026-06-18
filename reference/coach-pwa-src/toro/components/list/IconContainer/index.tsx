import React from 'react'
import Box from 'toro/components/Box'
import useMultiStyleComponent, { MultiStyleComponent } from 'toro/hooks/useMultiStyleComponent'

const IconContainer: React.FC = () => {
  const { EmptyStar, HalfStar, FullStar, WishlistIcon, WishlistIconFilled } =
    useMultiStyleComponent(MultiStyleComponent.icons)
  return (
    <Box w="0" h="0" position="absolute" overflow="hidden">
      <FullStar id="icon-star" />
      <HalfStar id="icon-half-star" />
      <EmptyStar id="icon-empty-star" />
      <WishlistIcon id="icon-empty-heart" />
      <WishlistIconFilled id="icon-heart" />
    </Box>
  )
}

export default IconContainer
