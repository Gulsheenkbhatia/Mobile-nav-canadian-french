import React from 'react'
import { render } from '@testing-library/react'
import ItemLists from './index'

jest.mock('next/head', () => ({ children }) => <head>{children}</head>)

const seoProductsMetaData = JSON.stringify({
  '@context': 'http://schema.org',
  '@type': 'ItemList',
  numberOfItems: 2,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: '1',
      name: 'Alter/Ego Satchel Bag In Checkerboard Upcrafted Leather',
      url: [
        'https://coach.com/products/coachtopia/alterego-satchel-bag-in-checkerboard-upcrafted-leather/CAE88.html',
      ],
      image: ['https://coach.scene7.com/is/image/Coach/cae88_mpl_a0'],
    },
    {
      '@type': 'ListItem',
      position: '2',
      name: 'Alter/Ego Shoulder Bag In Checkerboard Upcrafted Leather',
      url: [
        'https://coach.com/products/coachtopia/alterego-shoulder-bag-in-checkerboard-upcrafted-leather/CY360-BLK.html',
      ],
      image: ['https://coach.scene7.com/is/image/Coach/cy360_blk_a0'],
    },
  ],
})

describe('ItemLists component', () => {
  it('renders the correct JSON-LD structured data', () => {
    const { container } = render(<ItemLists seoProductsMetaData={seoProductsMetaData} />)
    const scriptTag = container.querySelector('script[type="application/ld+json"]')

    expect(scriptTag).toHaveAttribute('type', 'application/ld+json')
    expect(scriptTag.textContent).toBe(seoProductsMetaData)
  })

  it('handles empty seoProductsMetaData', () => {
    const { container } = render(<ItemLists seoProductsMetaData="" />)

    expect(container.firstChild).toBeNull()
  })
})
