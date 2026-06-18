interface MediaItemBase {
  src: string
  title?: string
  alt?: string
  type?: string
  position?: number
}

export interface MediaItemType extends MediaItemBase {
  poster?: string
}

export interface BentoMediaItemType extends MediaItemType {
  isLarge: boolean
}

export interface RawMediaItemType extends MediaItemBase {
  poster?: {
    src: string
    title: string
    alt: string
  }
}
