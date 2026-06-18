export interface BundleProperties {
  bundleMsg?: string
  bundleLinkText?: string
  bundleUrl?: string
  bundleContentImages?: {
    viewType?: string
    images?: BundleImage[]
  }
}

interface BundleImage {
  path?: string
  alt?: string
  url?: string
  index?: string
  title?: string
  secureUrl?: string
  absURL?: string
  srcset?: ImageSrcSet
  isScene7Enable?: boolean
  zoomUrl?: string
  zoomSrcset?: ImageSrcSet
}

interface ImageSrcSet {
  desktop?: string
  mobile?: string
  tablet?: string
}
