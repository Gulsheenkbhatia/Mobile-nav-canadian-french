const fs = require('fs')
const path = require('path')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({
    path: `./environments/.env${process.env.ENV_ORIGIN ? `.${process.env.ENV_ORIGIN}` : ''}`,
  })
}

const getBrandTheme = () => {
  if (process.env.BRAND_THEME) {
    return `${process.env.BRAND}/themes/${process.env.BRAND_THEME}`
  }
  return `${process.env.BRAND}`
}

const getBrandThemeLocale = () => {
  // Special handling for kate-spade-outlet
  // Kate Spade outlet uses BRAND=kate-spade (same as main site) but needs its own theme
  // Unlike coach-outlet which has BRAND=coach-outlet, we can't change the BRAND env var
  // So we detect outlet environment via ENV_ORIGIN=katespade-outlet
  if (process.env.ENV_ORIGIN === 'katespade-outlet') {
    return '-kate-spade-outlet'
  }
  if (process.env.BRAND_THEME) {
    return `-${process.env.BRAND}-${process.env.BRAND_THEME}`
  }
  return `${process.env.BRAND === 'coach' ? '' : `-${process.env.BRAND}`}`
}

const getSubBrandThemeLocale = () => {
  const { SUB_BRAND = '', BRAND_THEME = '', BRAND = '' } = process.env
  const subBrandThemesExist = fs.existsSync(
    path.join(__dirname, `src/toro/theme-${SUB_BRAND}-${BRAND_THEME}.js`)
  )
  if (SUB_BRAND) {
    return `-${SUB_BRAND}${BRAND_THEME && subBrandThemesExist ? `-${BRAND_THEME}` : ''}`
  }
  return `${BRAND === 'coach' ? '' : `-${BRAND}`}`
}

const getSubBrandTheme = () => {
  const { SUB_BRAND = '', BRAND_THEME = '', BRAND = '' } = process.env
  if (SUB_BRAND) {
    const localSubBrandThemesExist = fs.existsSync(
      path.join(
        __dirname,
        `node_modules/@tapestry-inc/design-tokens/${SUB_BRAND}/themes/${BRAND_THEME}`
      )
    )
    return `${SUB_BRAND}${BRAND_THEME && localSubBrandThemesExist ? `/themes/${BRAND_THEME}` : ''}`
  }
  return BRAND
}

const getSubBrandExperimentThemes = () => {
  const { SUB_BRAND = '', BRAND_THEME = '' } = process.env
  const prefix = 'src/toro/experiment-themes'
  let tempPath = ''
  if (SUB_BRAND) {
    if (BRAND_THEME) {
      tempPath = `${prefix}/${SUB_BRAND}-${BRAND_THEME}.ts`
    } else {
      tempPath = `${prefix}/${SUB_BRAND}.ts`
    }
  }
  if (tempPath !== '' && fs.existsSync(path.join(__dirname, tempPath))) {
    return path.join(__dirname, tempPath)
  }
  return path.join(__dirname, `${prefix}/fallback.ts`)
}

const getBrandExperimentThemes = () => {
  const { BRAND_THEME = '', BRAND = '' } = process.env
  const prefix = 'src/toro/experiment-themes'
  let tempPath = ''

  // Special handling for kate-spade-outlet
  // Kate Spade outlet needs its own experiment themes but shares BRAND=kate-spade
  // We detect outlet environment via ENV_ORIGIN=katespade-outlet to load outlet experiments
  if (process.env.ENV_ORIGIN === 'katespade-outlet') {
    tempPath = `${prefix}/kate-spade-outlet.ts`
    if (fs.existsSync(path.join(__dirname, tempPath))) {
      return path.join(__dirname, tempPath)
    }
  }

  if (BRAND_THEME) {
    tempPath = `${prefix}/${BRAND}-${BRAND_THEME}.ts`
  } else {
    tempPath = `${prefix}/${BRAND}.ts`
  }
  if (tempPath !== '' && fs.existsSync(path.join(__dirname, tempPath))) {
    return path.join(__dirname, tempPath)
  }
  return path.join(__dirname, `${prefix}/fallback.ts`)
}

const getCmsStyles = () => {
  const sourcePath = 'src/toro/styles'
  if (process.env.BRAND_THEME) {
    const brandWithRegionFolder = `cms-${process.env.BRAND}-${process.env.BRAND_THEME}`
    if (fs.existsSync(path.join(sourcePath, brandWithRegionFolder))) {
      return brandWithRegionFolder
    } else {
      return `cms-${process.env.BRAND_THEME}`
    }
  }
  const brandMap = {
    'kate-spade': 'kate-spade',
  }
  const brandPath = brandMap[process.env.BRAND]
  return `cms${brandPath ? `-${brandPath}` : ''}`
}

const getSubBrandCMS = () => {
  if (process.env.SUB_BRAND) {
    return `cms-${process.env.SUB_BRAND}`
  }
  return 'default'
}

const PDP_THEME_PREFIXES = {
  v6: 'src/toro/components/product/mobile/theme',
  v7: 'src/toro/components/product/mobile/v7/theme',
  v7_desktop: 'src/toro/components/product/desktop/theme/v7/theme',
  v5_1: 'src/toro/components/product/desktop/theme/v5_1/theme',
}

/**
 * Resolves the brand-specific theme path for PDP templates (mobile v6/v7, desktop v5_1/v7).
 * @param {string} version - Template version: 'v6' | 'v7' | 'v7_desktop' | 'v5_1'
 * @returns {string} Path to the theme file (without extension)
 */
const getPdpBrandThemeLocale = (version) => {
  const prefix = PDP_THEME_PREFIXES[version]

  if (
    process.env.BRAND_THEME &&
    fs.existsSync(
      path.join(__dirname, `${prefix}-${process.env.BRAND}-${process.env.BRAND_THEME}.ts`)
    )
  ) {
    return `${prefix}-${process.env.BRAND}-${process.env.BRAND_THEME}`
  }

  if (
    process.env.BRAND !== 'coach' &&
    fs.existsSync(path.join(__dirname, `${prefix}-${process.env.BRAND}.ts`))
  ) {
    return `${prefix}-${process.env.BRAND}`
  }
  return prefix
}

const getPdpSubBrandThemeLocale = (version) => {
  const prefix = PDP_THEME_PREFIXES[version]
  const { SUB_BRAND = '', BRAND_THEME = '' } = process.env

  const subBrandThemesExist = fs.existsSync(
    path.join(__dirname, `${prefix}-${SUB_BRAND}-${BRAND_THEME}.ts`)
  )
  if (SUB_BRAND && BRAND_THEME && subBrandThemesExist) {
    return `${prefix}-${SUB_BRAND}-${BRAND_THEME}`
  }
  return prefix
}

module.exports = {
  resolve: {
    alias: {
      components: path.join(__dirname, 'src/components'),
      pages: path.join(__dirname, 'src/pages'),
      helpers: path.join(__dirname, 'src/helpers'),
      hooks: path.join(__dirname, 'src/hooks'),
      lib: path.join(__dirname, 'src/toro/lib'),
      toro: path.join(__dirname, 'src/toro'),
      cms: path.join(__dirname, 'src/cms'),
      constants: path.join(__dirname, 'src/constants'),
      store: path.join(__dirname, 'src/store'),
      'design-tokens': path.join(
        __dirname,
        `node_modules/@tapestry-inc/design-tokens/${getBrandTheme()}`
      ),
      'sub-theme-tokens': path.join(
        __dirname,
        `node_modules/@tapestry-inc/design-tokens/${getSubBrandTheme()}`
      ),
      theme: path.join(__dirname, `src/toro/theme${getBrandThemeLocale()}`),
      'sub-theme': path.join(__dirname, `src/toro/theme${getSubBrandThemeLocale()}`),
      'cms-styles': path.join(__dirname, `src/toro/styles/${getCmsStyles()}`),
      'sub-theme-cms-style': path.join(__dirname, `src/toro/styles/${getSubBrandCMS()}`),
      'sub-theme-cms-typography': path.join(
        __dirname,
        `node_modules/@tapestry-inc/design-tokens/${getSubBrandTheme()}`
      ),
      'cms-typography': path.join(
        __dirname,
        `node_modules/@tapestry-inc/design-tokens/${getBrandTheme()}`
      ),
      'brand-experiment-themes': getBrandExperimentThemes(),
      'sub-brand-experiment-themes': getSubBrandExperimentThemes(),
      'pdpv6-theme': path.join(__dirname, getPdpBrandThemeLocale('v6')),
      'pdpv6-sub-theme': path.join(__dirname, getPdpSubBrandThemeLocale('v6')),
      'pdpv7-theme': path.join(__dirname, getPdpBrandThemeLocale('v7')),
      'pdpv7-desktop-theme': path.join(__dirname, getPdpBrandThemeLocale('v7_desktop')),
      'pdpv5_1-theme': path.join(__dirname, getPdpBrandThemeLocale('v5_1')),
    },
  },
}
