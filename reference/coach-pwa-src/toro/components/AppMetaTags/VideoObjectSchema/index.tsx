import { SCHEMA_TYPES, SCHEMA_URLS } from 'toro/constants/seo'

type VideoObjectSchemaProps = {
  videos: {
    src: string
    type: string
    position: number | string
    createdDate: string
    poster: {
      src: string
      title: string
      alt: string
    }
  }[]
}

const VideoObjectSchema = ({ videos }: VideoObjectSchemaProps) => {
  const { BASE_URL } = SCHEMA_URLS
  const { ITEM_LIST, VIDEO } = SCHEMA_TYPES

  const json = {
    '@context': BASE_URL,
    '@type': ITEM_LIST,
    name: 'Product Videos',

    itemListElement: videos.map((video, index) => ({
      '@type': VIDEO,
      position: index + 1,
      name: video.src.split('/').pop()?.split('.')[0] || `Video ${index + 1}`,
      thumbnailUrl: video.poster.src,
      contentUrl: video.src,
      uploadDate: video.createdDate,
    })),
  }

  return (
    <script
      type="application/ld+json"
      data-key="ProductVideoObject"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    ></script>
  )
}

export default VideoObjectSchema
