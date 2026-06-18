/* eslint-disable import/no-duplicates */
import { atom } from 'jotai'
import { experimentsAtom } from 'store/experiments.atom'
import mergeWith from 'lodash/mergeWith'
import _get from 'lodash/get'
import isString from 'lodash/isString'
import isFunction from 'lodash/isFunction'
import isPlainObject from 'lodash/isPlainObject'
import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray'
import uniq from 'lodash/uniq'
import { brandAtom, isSubBrandActiveAtom } from 'store/global.atom'
import getTheme from '../getTheme'
import { preferencesAtom } from './preferences.atom'
import brandExperimentThemes from 'brand-experiment-themes'
import subBrandExperimentThemes from 'sub-brand-experiment-themes'
import { NavColorScheme } from 'toro/getColorSchemeVariables'

/**
 * This merge helper is doing multiple things.
 *
 * One, it's generating objects for the 'baseStyle', 'variants' and 'sizes' props, just like the
 * merge helper from src/helpers/baseStylesCustomiser.js is doing, no matter if on the left side
 * they're objects or functions that return an object.
 *
 * Two, it always generates a function that returns an object for props that are functions on the
 * right side, while keeping the props that are not functions the same type.
 *
 * Three, it recursively merges the left side theme with the right side theme. The props from both
 * themes are kept, but the ones on the right side will take precedence. A prop that is a function
 * on both sides will still be a function, but the styling object it returns will contain the inner
 * props of both the objects returned by the left side and right side function invocations.
 */
export const themeMerger =
  (theme: Record<string, any> = null) =>
  (left: any, right: any, key: string) => {
    if (isFunction(right)) {
      if (isFunction(left)) {
        return (...args) => mergeWith({}, left(...args), right(...args), themeMerger(theme))
      }
      if (isPlainObject(left)) {
        if (['baseStyle', 'variants', 'sizes'].includes(key)) {
          return mergeWith({}, left, right({ theme }), themeMerger(theme))
        }
        return (...args) => mergeWith({}, left, right(...args), themeMerger(theme))
      }
    }
    if (isArray(left) && isArray(right)) {
      return uniq([...left, ...right])
    }
  }

const getExperimentThemes = (isSubBrandActive: boolean) => {
  if (isSubBrandActive && !isEmpty(subBrandExperimentThemes)) {
    return subBrandExperimentThemes
  } else if (!isEmpty(brandExperimentThemes)) {
    return brandExperimentThemes
  }
}

const getColorSchemeOptions = (get) => {
  const preferences = get(preferencesAtom)
  let navigationColorScheme =
    _get(preferences, 'navFlyoutStylings.chooseNavTheme') || NavColorScheme.dark

  if (_get(preferences, 'xgenPreferences.searchV2Features.NavSearchRedesign')) {
    navigationColorScheme = NavColorScheme.grey
  }

  return {
    navigationColorScheme,
  }
}

/*
  Contains a theme object created by recursively merging the base theme with the (sub)brand theme.
 */
export const themeAtom = atom<Record<string, any>>((get) => {
  const brand = get(brandAtom)
  const isSubBrandActive = get(isSubBrandActiveAtom)

  return getTheme(brand, isSubBrandActive, getColorSchemeOptions(get))
})

/*
  Contains a theme object created by recursively merging the (sub)brand final theme with the themes
  enabled by the currently active experiments.
 */
export const themeWithExperimentsAtom = atom((get) => {
  const theme = get(themeAtom)
  const isSubBrandActive = get(isSubBrandActiveAtom)

  const experimentThemes = getExperimentThemes(isSubBrandActive)
  if (experimentThemes === null) {
    return theme
  }

  const experiments = get(experimentsAtom)
  const splitExperiments = experiments.split('-')
  const themedExperimentComponents = splitExperiments.reduce((acc: any, experimentId: string) => {
    const components = _get(experimentThemes, experimentId)
    if (components) {
      for (const component of components) {
        if (component) {
          const [componentKey, componentTheme] = component
          if (isString(componentKey) && componentKey.length > 0 && componentTheme) {
            acc[componentKey] = mergeWith({}, acc[componentKey], componentTheme, themeMerger(theme))
          }
        }
      }
    }
    return acc
  }, {})

  return mergeWith({}, theme, { components: themedExperimentComponents }, themeMerger(theme))
})
