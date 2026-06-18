import {
  Skeleton as ChakraUISkeleton,
  SkeletonProps as ChakraUISkeletonProps,
} from '@chakra-ui/react'

interface SkeletonProps extends ChakraUISkeletonProps {
  children?: React.ReactNode
  isLoaded?: boolean
}

export default function Skeleton({ children, isLoaded, ...props }: SkeletonProps) {
  return (
    <ChakraUISkeleton
      sx={isLoaded ? {} : { animationIterationCount: 11 }}
      isLoaded={isLoaded}
      {...props}
    >
      {children}
    </ChakraUISkeleton>
  )
}
