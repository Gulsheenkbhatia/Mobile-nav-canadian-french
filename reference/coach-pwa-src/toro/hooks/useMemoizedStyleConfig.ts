import { useMemo } from 'react'
import { useTheme } from '@chakra-ui/react'
import {
  resolveStyleConfig,
  type ThemingProps,
  type SystemStyleObject,
} from '@chakra-ui/styled-system'
import { type Dict, filterUndefined, memoizedGet as get, mergeWith, omit } from '@chakra-ui/utils'

const refEqualityObj = {} as Record<string, SystemStyleObject>

// Stable version of `useStyleConfigImpl` to avoid costly object merging and comparison
// of style configs on each render inherent to @chakra-ui's `useStyleConfig`
// https://github.com/chakra-ui/chakra-ui/blob/main/packages/core/system/src/use-style-config.ts
function useMemoizedStyleConfig(themeKey: string | null, props: ThemingProps & Dict = {}) {
  const { styleConfig: styleConfigProp, variant, size, ...rest } = props

  const theme = useTheme()

  return useMemo(() => {
    const themeStyleConfig = themeKey ? get(theme, `components.${themeKey}`) : undefined

    const styleConfig = styleConfigProp || themeStyleConfig
    const mergedProps = mergeWith(
      { theme },
      styleConfig?.defaultProps ?? {},
      filterUndefined({ variant, size, ...omit(rest, ['children']) })
    )

    if (styleConfig) {
      const getStyles = resolveStyleConfig(styleConfig)
      const styles = getStyles(mergedProps)

      return styles
    }
    return refEqualityObj
  }, [themeKey, variant, size, ...Object.values(omit(rest, ['children']))])
}

export default useMemoizedStyleConfig
