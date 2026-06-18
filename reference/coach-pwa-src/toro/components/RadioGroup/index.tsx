import { RadioGroup as ChakraUIRadioGroup, PropsOf } from '@chakra-ui/react'

type RadioGroupProps = PropsOf<typeof ChakraUIRadioGroup> & {
  children: React.ReactNode
}

export default function RadioGroup(props: RadioGroupProps) {
  return <ChakraUIRadioGroup {...props} />
}
