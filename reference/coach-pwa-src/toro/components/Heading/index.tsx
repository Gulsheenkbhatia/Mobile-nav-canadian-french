import React from 'react'
import { Heading as ChakraUIHeading, PropsOf } from '@chakra-ui/react'

/**
 * TORO Heading
 *
 * @param {variant} possible values: ['primary', 'secondary', 'white']
 * @param {level} possible values: "1" - "6"
 */

interface HeadingProps extends PropsOf<typeof ChakraUIHeading> {
  level?: string
}

export default function Heading({ level, size, as, ...props }: HeadingProps) {
  const levelNumber = Number(level)
  const isValidLevel = levelNumber > 0 && levelNumber < 7
  return (
    <ChakraUIHeading
      size={isValidLevel ? `h${level}` : size}
      as={isValidLevel ? (`h${level}` as PropsOf<typeof ChakraUIHeading>['as']) : as}
      {...props}
    />
  )
}
