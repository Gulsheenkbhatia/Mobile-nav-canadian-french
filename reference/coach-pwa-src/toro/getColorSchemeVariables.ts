type CssVariablesKeysAndDefaults = {
  [key: string]: string
}

const navigationColorSchemeVariables: CssVariablesKeysAndDefaults = {
  'bg-color': 'var(--color-neutral-dark-1, #161616)',
  'text-color': 'var(--color-neutral-light)',
  'footer-bg-color': 'var(--color-neutral-dark)',
  't1-subline-color': 'var(--color-neutral-base)',
  'header-color': 'var(--color-neutral-light)',
  'list-price-color': 'var(--color-neutral-light)',
  'secondary-text-color': 'var(--color-neutral-light-3)',
  'selected-category-bg': 'var(--color-background-cta-focus)',
  'suggestions-product-text-color': 'var(--color-secondary)',
  'suggestions-strikethrough-text-color': 'var(--color-neutral-light-3)',
  'input-bg-color': 'var(--color-neutral-light, #f7f7f7)',
}

type CssVariablesDeclarations = {
  [key: string]: string
}

export enum NavColorScheme {
  dark = 'darkThemeNAV',
  light = 'lightThemeNAV',
  grey = 'greyThemeNAV',
}

export function generateVariableDeclarations(
  schemeName: string,
  variables: CssVariablesKeysAndDefaults
): CssVariablesDeclarations {
  return Object.keys(variables).reduce(
    (sum, key) => ({
      ...sum,
      [`--scheme-${key}`]: `var(--scheme-${schemeName}-${key}, var(--scheme-default-${key}, ${navigationColorSchemeVariables[key]}))`,
    }),
    {}
  )
}

type GetColorSchemeVariablesProps = {
  navigationColorScheme: string
}

function getColorSchemeVariables({
  navigationColorScheme,
}: GetColorSchemeVariablesProps): CssVariablesDeclarations {
  return {
    ...generateVariableDeclarations(navigationColorScheme, navigationColorSchemeVariables),
  }
}

export default getColorSchemeVariables
