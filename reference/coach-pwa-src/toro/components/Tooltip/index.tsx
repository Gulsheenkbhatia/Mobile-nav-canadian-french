import { Tooltip as ChakraUITooltip, PropsOf } from '@chakra-ui/react'

type TooltipProps = PropsOf<typeof ChakraUITooltip> & {
  children: React.ReactNode
}

export default function Tooltip(props: TooltipProps) {
  return <ChakraUITooltip {...props} />
}
