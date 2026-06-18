import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { useAtomValue } from 'jotai/utils'
import { themeWithExperimentsAtom } from 'store/theme-with-experiments.atom'

type ThemeProviderProps = {
  children: React.ReactNode
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const theme = useAtomValue(themeWithExperimentsAtom)
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>
}

export default ThemeProvider
