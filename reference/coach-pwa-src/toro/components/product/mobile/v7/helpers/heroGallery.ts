import { useMemo } from 'react'
import useProductData from 'toro/hooks/useProductData'
import {
  findMediaIndexByAssetSuffix,
  findMediaIndexByVideoAssetKey,
} from './matchMediaByAssetSuffix'
import type { HeroGalleryRow } from 'toro/types/productTypes/baseProduct'

export type HeroGalleryImageEntry = {
  order: number
  tabLabel: string
  type?: undefined
  asset_suffix: string
}

export type HeroGalleryVideoEntry = {
  order: number
  tabLabel: string
  type: 'video'
  assetUrl: string
}

export type HeroGalleryEntry = HeroGalleryImageEntry | HeroGalleryVideoEntry

export type ResolvedHeroTab = HeroGalleryEntry & { mediaIndex: number }

function isHeroGalleryVideoEntry(entry: HeroGalleryEntry): entry is HeroGalleryVideoEntry {
  return 'type' in entry && entry.type === 'video'
}

function normalizeHeroGalleryRows(rows: readonly HeroGalleryRow[] | undefined): HeroGalleryEntry[] {
  if (!Array.isArray(rows)) return []

  const validRows = rows
    .map((rawRow) => {
      if (rawRow === null || typeof rawRow !== 'object') return null
      const fields = rawRow as Record<string, unknown>
      const order = Number(fields.order)
      const tabLabel = typeof fields.tabLabel === 'string' ? fields.tabLabel : ''

      if (!Number.isFinite(order) || !tabLabel) return null

      if (fields.type === 'video') {
        const assetUrl = typeof fields.assetUrl === 'string' ? fields.assetUrl.trim() : ''
        if (!assetUrl) return null
        const videoRow: HeroGalleryVideoEntry = {
          order,
          tabLabel,
          type: 'video',
          assetUrl,
        }
        return videoRow
      }

      const asset_suffix = typeof fields.asset_suffix === 'string' ? fields.asset_suffix : ''
      if (asset_suffix.trim() === '') return null
      const imageRow: HeroGalleryImageEntry = { order, tabLabel, asset_suffix }
      return imageRow
    })
    .filter((row): row is HeroGalleryEntry => row !== null)

  return validRows.sort((a, b) => a.order - b.order)
}

function resolveMediaIndexForEntry(
  fullMedias: readonly unknown[],
  entry: HeroGalleryEntry
): number {
  if (isHeroGalleryVideoEntry(entry)) {
    return findMediaIndexByVideoAssetKey(fullMedias, entry.assetUrl)
  }
  return findMediaIndexByAssetSuffix(fullMedias, entry.asset_suffix)
}

export function useHeroGalleryEntries(): HeroGalleryEntry[] {
  const heroGalleryData = useProductData('heroGalleryData')

  return useMemo(() => {
    return normalizeHeroGalleryRows(heroGalleryData)
  }, [heroGalleryData])
}

export function resolveHeroGalleryTabs(
  fullMedias: readonly unknown[],
  sortedEntries: readonly HeroGalleryEntry[]
): ResolvedHeroTab[] {
  return sortedEntries
    .map((entry) => {
      const mediaIndex = resolveMediaIndexForEntry(fullMedias, entry)
      return { ...entry, mediaIndex }
    })
    .filter((tab) => tab.mediaIndex >= 0)
}

export function getHeroGalleryMediaIndices(
  fullMedias: readonly unknown[],
  sortedEntries: readonly HeroGalleryEntry[]
): number[] {
  return resolveHeroGalleryTabs(fullMedias, sortedEntries).map((tab) => tab.mediaIndex)
}

/**
 * Which tab (0-based index among the hero tabs) should look active for the current slide?
 * - If the user is exactly on a "tab" slide, highlight that tab.
 * - If they're on an in-between slide (e.g. swiped partway), highlight whichever tab's slide is
 *   *closest* in the carousel to the current slide. If two are equally close, the earlier tab wins
 *   (same as before).
 */
export function getHeroGalleryTabPosition(
  tabMediaIndices: readonly number[],
  activeMediaIndex: number
): number {
  const tabIndexMatchingCurrentSlide = tabMediaIndices.indexOf(activeMediaIndex)
  if (tabIndexMatchingCurrentSlide >= 0) {
    return tabIndexMatchingCurrentSlide
  }

  let closestTabIndex = 0
  let smallestDistance = Infinity

  for (let tabIndex = 0; tabIndex < tabMediaIndices.length; tabIndex++) {
    const slideIndexForTab = tabMediaIndices[tabIndex]
    const distanceFromActiveSlide = Math.abs(slideIndexForTab - activeMediaIndex)

    if (distanceFromActiveSlide < smallestDistance) {
      smallestDistance = distanceFromActiveSlide
      closestTabIndex = tabIndex
    }
  }

  return closestTabIndex
}

export function getFirstHeroGalleryMediaIndex(
  fullMedias: readonly unknown[],
  sortedEntries: readonly HeroGalleryEntry[]
): number {
  const indices = getHeroGalleryMediaIndices(fullMedias, sortedEntries)
  return indices[0] ?? 0
}
