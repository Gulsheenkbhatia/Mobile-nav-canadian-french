import { ChakraProvider, extendTheme, useTheme } from '@chakra-ui/react'
import Box from 'toro/components/Box'

type TemplateThemeProviderProps = {
  id: string
  theme: Record<string, any>
  children?: React.ReactNode
}

/**
 * Provider to support template-scope theme extension.
 *
 * @param {TemplateThemeProviderProps} props - The props for the component.
 * @param {string} props.id - The unique identifier for the component, used for CSS variable scoping.
 * @param {Record<string, any>} props.theme - The custom theme object to extend the base theme.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the provider.
 */
const TemplateThemeProvider = ({
  id,
  theme,
  children,
}: TemplateThemeProviderProps): JSX.Element => {
  const baseTheme = useTheme()

  return (
    <Box id={id}>
      <ChakraProvider theme={extendTheme(baseTheme, theme)} cssVarsRoot={`#${id}`}>
        {children}
      </ChakraProvider>
    </Box>
  )
}

export default TemplateThemeProvider
