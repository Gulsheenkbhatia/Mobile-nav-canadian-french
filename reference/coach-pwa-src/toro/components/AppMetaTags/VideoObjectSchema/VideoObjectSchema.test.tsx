import { render } from '@testing-library/react'

import VideoObjectSchema from './'
import { SCHEMA_TYPES, SCHEMA_URLS } from 'toro/constants/seo'

const mockVideo1 = {
  src: 'https://example.com/video.mp4',
  type: 'video',
  position: 1,
  createdDate: '2026-02-20T10:08:00.522Z',
  poster: {
    src: 'https://example.com/poster.jpg',
    title: 'Test Video Title',
    alt: 'Test video poster',
  },
}

const mockVideo2 = {
  src: 'https://example.com/video2.mp4',
  type: 'video',
  position: 2,
  createdDate: '2026-02-20T10:08:00.522Z',
  poster: {
    src: 'https://example.com/poster2.jpg',
    title: 'Second Video Title',
    alt: 'Second video poster',
  },
}

const setup = (videos = [mockVideo1]) => {
  const { container } = render(<VideoObjectSchema videos={videos} />)
  const scriptEl = container.querySelector('script[data-key="ProductVideoObject"]')
  const json = JSON.parse(scriptEl?.innerHTML ?? '{}')
  return { scriptEl, json }
}

describe('VideoObjectSchema', () => {
  it('renders a script tag with type application/ld+json', () => {
    const { scriptEl } = setup()
    expect(scriptEl).toBeInTheDocument()
    expect(scriptEl).toHaveAttribute('type', 'application/ld+json')
  })

  it('renders a script tag with data-key ProductVideoObject', () => {
    const { scriptEl } = setup()
    expect(scriptEl).toHaveAttribute('data-key', 'ProductVideoObject')
  })

  it('sets schema @context and type correctly', () => {
    const { json } = setup()
    expect(json['@context']).toBe(SCHEMA_URLS.BASE_URL)
    expect(json['@type']).toBe(SCHEMA_TYPES.ITEM_LIST)
  })

  it('maps a single video to an ItemList element with correct fields', () => {
    const { json } = setup()
    expect(json.itemListElement).toHaveLength(1)

    const item = json.itemListElement[0]

    expect(item['@type']).toBe(SCHEMA_TYPES.VIDEO)
    expect(item.position).toBe(1)
    expect(item.name).toBe('video')
    expect(item.thumbnailUrl).toBe(mockVideo1.poster.src)
    expect(item.contentUrl).toBe(mockVideo1.src)
    expect(item.uploadDate).toBe(mockVideo1.createdDate)
  })

  it('sets position based on array index (1-based), not video.position prop', () => {
    const videoWithDifferentPosition = { ...mockVideo1, position: 99 }
    const { json } = setup([videoWithDifferentPosition])
    expect(json.itemListElement[0].position).toBe(1)
  })

  it('maps multiple videos with sequential positions', () => {
    const { json } = setup([mockVideo1, mockVideo2])
    expect(json.itemListElement).toHaveLength(2)

    expect(json.itemListElement[0].position).toBe(1)
    expect(json.itemListElement[0].name).toBe('video')

    expect(json.itemListElement[1].position).toBe(2)
    expect(json.itemListElement[1].name).toBe('video2')
  })
})
