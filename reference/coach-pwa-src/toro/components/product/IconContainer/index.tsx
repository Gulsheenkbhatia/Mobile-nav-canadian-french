import React from 'react'
import useMultiStyleComponent, { MultiStyleComponent } from 'toro/hooks/useMultiStyleComponent'
import Box from 'toro/components/Box'

const IconContainer: React.FC = () => {
  const { EmptyStar, HalfStar, FullStar, WishlistIcon, WishlistIconFilled } =
    useMultiStyleComponent(MultiStyleComponent.icons)
  return (
    <Box w="0" h="0" position="absolute" overflow="hidden">
      <FullStar width="100%" height="100%" id="icon-star" />
      <HalfStar width="100%" height="100%" id="icon-half-star" />
      <EmptyStar width="100%" height="100%" id="icon-empty-star" />
      <WishlistIcon id="icon-empty-heart" />
      <WishlistIconFilled id="icon-heart" />
    </Box>
  )
}

export default IconContainer
