import {
  GRID_SIZES_MAPPING,
  DESKTOP_GRID_VARIANTS,
  MOBILE_GRID_VARIANTS,
  mapPageTemplateToProducts,
  type GridVariant,
  type SFCCPageEntity,
} from './thinkPlp'

jest.mock('toro/lib/cheerio', () => ({
  load: jest.fn(),
}))

jest.mock('toro/helpers/sanitizeHtmlMarkup', () => jest.fn())

const mockCheerioLoad = jest.fn()
const mockSanitizeHtmlMarkup = jest.fn()

describe('thinkPlp helper', () => {
  describe('1. Constants & Mappings', () => {
    describe('GRID_SIZES_MAPPING', () => {
      it('should map all variants to correct numbers', () => {
        expect(GRID_SIZES_MAPPING['1up']).toBe(1)
        expect(GRID_SIZES_MAPPING['2up']).toBe(2)
        expect(GRID_SIZES_MAPPING['3up']).toBe(3)
        expect(GRID_SIZES_MAPPING['4up']).toBe(4)
        expect(GRID_SIZES_MAPPING['5up']).toBe(5)
      })

      it('should map fixed variants to correct sizes', () => {
        expect(GRID_SIZES_MAPPING.fixedA).toBe(5)
        expect(GRID_SIZES_MAPPING.fixedB).toBe(5)
        expect(GRID_SIZES_MAPPING.fixedC).toBe(4)
      })

      it('should return undefined for invalid variants', () => {
        expect(GRID_SIZES_MAPPING['invalid' as GridVariant]).toBeUndefined()
      })
    })

    describe('DESKTOP_GRID_VARIANTS', () => {
      it('should contain all 8 variants', () => {
        expect(DESKTOP_GRID_VARIANTS).toHaveLength(8)
      })

      it('should have correct order', () => {
        const expected = ['1up', '2up', '3up', '4up', '5up', 'fixedA', 'fixedB', 'fixedC']
        expect(DESKTOP_GRID_VARIANTS).toEqual(expected)
      })

      it('should include fixed variants', () => {
        expect(DESKTOP_GRID_VARIANTS).toContain('fixedA')
        expect(DESKTOP_GRID_VARIANTS).toContain('fixedB')
        expect(DESKTOP_GRID_VARIANTS).toContain('fixedC')
      })
    })

    describe('MOBILE_GRID_VARIANTS', () => {
      it('should contain only 3 variants', () => {
        expect(MOBILE_GRID_VARIANTS).toHaveLength(3)
        expect(MOBILE_GRID_VARIANTS).toEqual(['1up', '2up', '3up'])
      })

      it('should not include 4up, 5up, or fixed variants', () => {
        expect(MOBILE_GRID_VARIANTS).not.toContain('4up')
        expect(MOBILE_GRID_VARIANTS).not.toContain('5up')
        expect(MOBILE_GRID_VARIANTS).not.toContain('fixedA')
        expect(MOBILE_GRID_VARIANTS).not.toContain('fixedB')
        expect(MOBILE_GRID_VARIANTS).not.toContain('fixedC')
      })
    })
  })

  describe('2. Grid Variant Adjustment (via mapPageTemplateToProducts)', () => {
    const mockProducts = Array.from({ length: 10 }, (_, i) => ({ id: i + 1 }))
    const mockContentSlotData = '<div id="slot1">Content</div>'

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should downgrade 5up with 3 products to 3up', () => {
      const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '5up' }]
      const products = mockProducts.slice(0, 3)

      const result = mapPageTemplateToProducts({
        pageTemplate,
        products,
        isMobile: false,
        contentSlotData: mockContentSlotData,
        productsPerPage: null,
      })

      expect(result[0]).toMatchObject({
        gridVariant: '3up',
      })
      expect((result[0] as any).products).toHaveLength(3)
    })

    it('should downgrade 4up with 2 products to 2up', () => {
      const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '4up' }]
      const products = mockProducts.slice(0, 2)

      const result = mapPageTemplateToProducts({
        pageTemplate,
        products,
        isMobile: false,
        contentSlotData: mockContentSlotData,
        productsPerPage: null,
      })

      expect(result[0]).toMatchObject({
        gridVariant: '2up',
      })
      expect((result[0] as any).products).toHaveLength(2)
    })

    it('should downgrade 3up with 1 product to 1up', () => {
      const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '3up' }]
      const products = mockProducts.slice(0, 1)

      const result = mapPageTemplateToProducts({
        pageTemplate,
        products,
        isMobile: false,
        contentSlotData: mockContentSlotData,
        productsPerPage: null,
      })

      expect(result[0]).toMatchObject({
        gridVariant: '1up',
      })
      expect((result[0] as any).products).toHaveLength(1)
    })

    it('should downgrade 2up with 1 product to 1up', () => {
      const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '2up' }]
      const products = mockProducts.slice(0, 1)

      const result = mapPageTemplateToProducts({
        pageTemplate,
        products,
        isMobile: false,
        contentSlotData: mockContentSlotData,
        productsPerPage: null,
      })

      expect(result[0]).toMatchObject({
        gridVariant: '1up',
      })
      expect((result[0] as any).products).toHaveLength(1)
    })

    it('should keep 5up with 5+ products as 5up', () => {
      const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '5up' }]
      const products = mockProducts.slice(0, 7)

      const result = mapPageTemplateToProducts({
        pageTemplate,
        products,
        isMobile: false,
        contentSlotData: mockContentSlotData,
        productsPerPage: null,
      })

      expect(result[0]).toMatchObject({
        gridVariant: '5up',
      })
      expect((result[0] as any).products).toHaveLength(5)
    })

    it('should keep 3up with 3+ products as 3up', () => {
      const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '3up' }]
      const products = mockProducts.slice(0, 5)

      const result = mapPageTemplateToProducts({
        pageTemplate,
        products,
        isMobile: false,
        contentSlotData: mockContentSlotData,
        productsPerPage: null,
      })

      expect(result[0]).toMatchObject({
        gridVariant: '3up',
      })
      expect((result[0] as any).products).toHaveLength(3)
    })

    it('should keep 1up with any count as 1up', () => {
      const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '1up' }]
      const products = mockProducts.slice(0, 5)

      const result = mapPageTemplateToProducts({
        pageTemplate,
        products,
        isMobile: false,
        contentSlotData: mockContentSlotData,
        productsPerPage: null,
      })

      expect(result[0]).toMatchObject({
        gridVariant: '1up',
      })
      expect((result[0] as any).products).toHaveLength(1)
    })

    it('should adjust fixedA with 3 products to 3up', () => {
      const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: 'fixedA' }]
      const products = mockProducts.slice(0, 3)

      const result = mapPageTemplateToProducts({
        pageTemplate,
        products,
        isMobile: false,
        contentSlotData: mockContentSlotData,
        productsPerPage: null,
      })

      expect(result[0]).toMatchObject({
        gridVariant: '3up',
      })
      expect((result[0] as any).products).toHaveLength(3)
    })

    it('should adjust fixedB with 2 products to 2up', () => {
      const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: 'fixedB' }]
      const products = mockProducts.slice(0, 2)

      const result = mapPageTemplateToProducts({
        pageTemplate,
        products,
        isMobile: false,
        contentSlotData: mockContentSlotData,
        productsPerPage: null,
      })

      expect(result[0]).toMatchObject({
        gridVariant: '2up',
      })
      expect((result[0] as any).products).toHaveLength(2)
    })

    it('should adjust fixedC with 3 products to 3up', () => {
      const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: 'fixedC' }]
      const products = mockProducts.slice(0, 3)

      const result = mapPageTemplateToProducts({
        pageTemplate,
        products,
        isMobile: false,
        contentSlotData: mockContentSlotData,
        productsPerPage: null,
      })

      expect(result[0]).toMatchObject({
        gridVariant: '3up',
      })
      expect((result[0] as any).products).toHaveLength(3)
    })

    it('should adjust fixedC with 2 products to 2up', () => {
      const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: 'fixedC' }]
      const products = mockProducts.slice(0, 2)

      const result = mapPageTemplateToProducts({
        pageTemplate,
        products,
        isMobile: false,
        contentSlotData: mockContentSlotData,
        productsPerPage: null,
      })

      expect(result[0]).toMatchObject({
        gridVariant: '2up',
      })
      expect((result[0] as any).products).toHaveLength(2)
    })

    it('should adjust fixedC with 1 product to 1up', () => {
      const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: 'fixedC' }]
      const products = mockProducts.slice(0, 1)

      const result = mapPageTemplateToProducts({
        pageTemplate,
        products,
        isMobile: false,
        contentSlotData: mockContentSlotData,
        productsPerPage: null,
      })

      expect(result[0]).toMatchObject({
        gridVariant: '1up',
      })
      expect((result[0] as any).products).toHaveLength(1)
    })
  })

  describe('3. getSequence Function (via mapPageTemplateToProducts)', () => {
    const mockProducts = Array.from({ length: 5 }, (_, i) => ({ id: i + 1 }))
    const mockContentSlotData = '<div id="slot1">Content</div>'

    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe('Mobile Conditions', () => {
      it('should return array for Mobile + 1up + has mobileSequence', () => {
        const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '1up' }]

        const result = mapPageTemplateToProducts({
          pageTemplate,
          products: mockProducts,
          isMobile: true,
          contentSlotData: mockContentSlotData,
          onModelImageSequenceMobile: 'img1,img2,img3',
          productsPerPage: null,
        })

        expect((result[0] as any).onModelSequence).toEqual(['img1', 'img2', 'img3'])
      })

      it('should return undefined for Mobile + 2up + has mobileSequence', () => {
        const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '2up' }]

        const result = mapPageTemplateToProducts({
          pageTemplate,
          products: mockProducts,
          isMobile: true,
          contentSlotData: mockContentSlotData,
          onModelImageSequenceMobile: 'img1,img2,img3',
          productsPerPage: null,
        })

        expect((result[0] as any).onModelSequence).toBeUndefined()
      })

      it('should return undefined for Mobile + 3up + has mobileSequence', () => {
        const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '3up' }]

        const result = mapPageTemplateToProducts({
          pageTemplate,
          products: mockProducts,
          isMobile: true,
          contentSlotData: mockContentSlotData,
          onModelImageSequenceMobile: 'img1,img2,img3',
          productsPerPage: null,
        })

        expect((result[0] as any).onModelSequence).toBeUndefined()
      })

      it('should return undefined for Mobile + 1up + no mobileSequence', () => {
        const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '1up' }]

        const result = mapPageTemplateToProducts({
          pageTemplate,
          products: mockProducts,
          isMobile: true,
          contentSlotData: mockContentSlotData,
          productsPerPage: null,
        })

        expect((result[0] as any).onModelSequence).toBeUndefined()
      })
    })

    describe('Desktop Conditions', () => {
      it('should return array for Desktop + 1up + has desktopSequence', () => {
        const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '1up' }]

        const result = mapPageTemplateToProducts({
          pageTemplate,
          products: mockProducts,
          isMobile: false,
          contentSlotData: mockContentSlotData,
          onModelImageSequenceDesktop: 'img1,img2,img3',
          productsPerPage: null,
        })

        expect((result[0] as any).onModelSequence).toEqual(['img1', 'img2', 'img3'])
      })

      it('should return array for Desktop + 2up + has desktopSequence', () => {
        const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '2up' }]

        const result = mapPageTemplateToProducts({
          pageTemplate,
          products: mockProducts,
          isMobile: false,
          contentSlotData: mockContentSlotData,
          onModelImageSequenceDesktop: 'img1,img2,img3',
          productsPerPage: null,
        })

        expect((result[0] as any).onModelSequence).toEqual(['img1', 'img2', 'img3'])
      })

      it('should return array for Desktop + fixedA + has desktopSequence', () => {
        const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: 'fixedA' }]

        const result = mapPageTemplateToProducts({
          pageTemplate,
          products: mockProducts,
          isMobile: false,
          contentSlotData: mockContentSlotData,
          onModelImageSequenceDesktop: 'img1,img2,img3',
          productsPerPage: null,
        })

        expect((result[0] as any).onModelSequence).toEqual(['img1', 'img2', 'img3'])
      })

      it('should return array for Desktop + fixedB + has desktopSequence', () => {
        const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: 'fixedB' }]

        const result = mapPageTemplateToProducts({
          pageTemplate,
          products: mockProducts,
          isMobile: false,
          contentSlotData: mockContentSlotData,
          onModelImageSequenceDesktop: 'img1,img2,img3',
          productsPerPage: null,
        })

        expect((result[0] as any).onModelSequence).toEqual(['img1', 'img2', 'img3'])
      })

      it('should return array for Desktop + fixedC + has desktopSequence', () => {
        const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: 'fixedC' }]

        const result = mapPageTemplateToProducts({
          pageTemplate,
          products: mockProducts,
          isMobile: false,
          contentSlotData: mockContentSlotData,
          onModelImageSequenceDesktop: 'img1,img2,img3',
          productsPerPage: null,
        })

        expect((result[0] as any).onModelSequence).toEqual(['img1', 'img2', 'img3'])
      })

      it('should return undefined for Desktop + 3up + has desktopSequence', () => {
        const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '3up' }]

        const result = mapPageTemplateToProducts({
          pageTemplate,
          products: mockProducts,
          isMobile: false,
          contentSlotData: mockContentSlotData,
          onModelImageSequenceDesktop: 'img1,img2,img3',
          productsPerPage: null,
        })

        expect((result[0] as any).onModelSequence).toBeUndefined()
      })

      it('should return undefined for Desktop + 4up + has desktopSequence', () => {
        const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '4up' }]

        const result = mapPageTemplateToProducts({
          pageTemplate,
          products: mockProducts,
          isMobile: false,
          contentSlotData: mockContentSlotData,
          onModelImageSequenceDesktop: 'img1,img2,img3',
          productsPerPage: null,
        })

        expect((result[0] as any).onModelSequence).toBeUndefined()
      })

      it('should return undefined for Desktop + 5up + has desktopSequence', () => {
        const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '5up' }]

        const result = mapPageTemplateToProducts({
          pageTemplate,
          products: mockProducts,
          isMobile: false,
          contentSlotData: mockContentSlotData,
          onModelImageSequenceDesktop: 'img1,img2,img3',
          productsPerPage: null,
        })

        expect((result[0] as any).onModelSequence).toBeUndefined()
      })
    })

    describe('Sequence Parsing', () => {
      it('should parse comma-separated string to array', () => {
        const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '1up' }]

        const result = mapPageTemplateToProducts({
          pageTemplate,
          products: mockProducts,
          isMobile: true,
          contentSlotData: mockContentSlotData,
          onModelImageSequenceMobile: 'img1,img2,img3',
          productsPerPage: null,
        })

        expect((result[0] as any).onModelSequence).toEqual(['img1', 'img2', 'img3'])
      })

      it('should handle single item', () => {
        const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '1up' }]

        const result = mapPageTemplateToProducts({
          pageTemplate,
          products: mockProducts,
          isMobile: true,
          contentSlotData: mockContentSlotData,
          onModelImageSequenceMobile: 'img1',
          productsPerPage: null,
        })

        expect((result[0] as any).onModelSequence).toEqual(['img1'])
      })

      it('should handle empty string', () => {
        const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '1up' }]

        const result = mapPageTemplateToProducts({
          pageTemplate,
          products: mockProducts,
          isMobile: true,
          contentSlotData: mockContentSlotData,
          onModelImageSequenceMobile: '',
          productsPerPage: null,
        })

        expect((result[0] as any).onModelSequence).toBeUndefined()
      })

      it('should preserve spaces in items', () => {
        const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '1up' }]

        const result = mapPageTemplateToProducts({
          pageTemplate,
          products: mockProducts,
          isMobile: true,
          contentSlotData: mockContentSlotData,
          onModelImageSequenceMobile: 'img1, img2',
          productsPerPage: null,
        })

        expect((result[0] as any).onModelSequence).toEqual(['img1', ' img2'])
      })
    })

    describe('Edge Cases', () => {
      it('should choose correct sequence when both sequences present', () => {
        const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '1up' }]

        const resultMobile = mapPageTemplateToProducts({
          pageTemplate,
          products: mockProducts,
          isMobile: true,
          contentSlotData: mockContentSlotData,
          onModelImageSequenceMobile: 'mobile1,mobile2',
          onModelImageSequenceDesktop: 'desktop1,desktop2',
          productsPerPage: null,
        })

        const resultDesktop = mapPageTemplateToProducts({
          pageTemplate,
          products: mockProducts,
          isMobile: false,
          contentSlotData: mockContentSlotData,
          onModelImageSequenceMobile: 'mobile1,mobile2',
          onModelImageSequenceDesktop: 'desktop1,desktop2',
          productsPerPage: null,
        })

        expect((resultMobile[0] as any).onModelSequence).toEqual(['mobile1', 'mobile2'])
        expect((resultDesktop[0] as any).onModelSequence).toEqual(['desktop1', 'desktop2'])
      })

      it('should handle missing sequences', () => {
        const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '1up' }]

        const result = mapPageTemplateToProducts({
          pageTemplate,
          products: mockProducts,
          isMobile: true,
          contentSlotData: mockContentSlotData,
          productsPerPage: null,
        })

        expect((result[0] as any).onModelSequence).toBeUndefined()
      })

      it('should handle empty sequences', () => {
        const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '1up' }]

        const result = mapPageTemplateToProducts({
          pageTemplate,
          products: mockProducts,
          isMobile: true,
          contentSlotData: mockContentSlotData,
          onModelImageSequenceMobile: '',
          productsPerPage: null,
        })

        expect((result[0] as any).onModelSequence).toBeUndefined()
      })
    })
  })

  describe('4. mapPageTemplateToProducts Function', () => {
    let mockCheerioInstance: any
    const mockProducts = Array.from({ length: 10 }, (_, i) => ({ id: i + 1 }))

    beforeEach(() => {
      jest.clearAllMocks()

      mockCheerioInstance = {
        html: jest.fn(),
        find: jest.fn().mockReturnValue({ length: 0 }),
        length: 1,
      }

      mockSanitizeHtmlMarkup.mockReturnValue('<div id="content1">Test Content</div>')
      mockCheerioLoad.mockReturnValue((selector: string) => mockCheerioInstance)

      jest
        .mocked(jest.requireMock('toro/helpers/sanitizeHtmlMarkup'))
        .mockImplementation(mockSanitizeHtmlMarkup)
      jest.mocked(jest.requireMock('toro/lib/cheerio')).load.mockImplementation(mockCheerioLoad)
    })

    describe('Grid Entity Processing', () => {
      describe('Valid Grid Creation', () => {
        it('should create GridEntity for valid grid type', () => {
          const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '3up' }]

          const result = mapPageTemplateToProducts({
            pageTemplate,
            products: mockProducts,
            isMobile: false,
            contentSlotData: '<div></div>',
            productsPerPage: null,
          })

          expect(result).toHaveLength(1)
          expect(result[0]).toMatchObject({
            id: 'grid-0',
            gridVariant: '3up',
            rowStartPosition: 0,
          })
          expect((result[0] as any).products).toHaveLength(3)
        })

        it('should slice correct number of products based on grid size', () => {
          const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '3up' }]

          const result = mapPageTemplateToProducts({
            pageTemplate,
            products: mockProducts,
            isMobile: false,
            contentSlotData: '<div></div>',
            productsPerPage: null,
          })

          expect((result[0] as any).products).toHaveLength(3)
          expect((result[0] as any).products).toEqual(mockProducts.slice(0, 3))
        })

        it('should assign sequential products from array', () => {
          const pageTemplate: SFCCPageEntity[] = [
            { type: 'grid', value: '2up' },
            { type: 'grid', value: '3up' },
          ]

          const result = mapPageTemplateToProducts({
            pageTemplate,
            products: mockProducts,
            isMobile: false,
            contentSlotData: '<div></div>',
            productsPerPage: null,
          })

          expect((result[0] as any).products).toEqual(mockProducts.slice(0, 2))
          expect((result[1] as any).products).toEqual(mockProducts.slice(2, 5))
        })

        it('should increment productsStartIndex correctly', () => {
          const pageTemplate: SFCCPageEntity[] = [
            { type: 'grid', value: '2up' },
            { type: 'grid', value: '3up' },
          ]

          const result = mapPageTemplateToProducts({
            pageTemplate,
            products: mockProducts,
            isMobile: false,
            contentSlotData: '<div></div>',
            productsPerPage: null,
          })

          expect((result[0] as any).rowStartPosition).toBe(0)
          expect((result[1] as any).rowStartPosition).toBe(2)
        })
      })

      describe('Grid Variant Filtering', () => {
        it('should allow only 1up, 2up, 3up on mobile', () => {
          const pageTemplate: SFCCPageEntity[] = [
            { type: 'grid', value: '1up' },
            { type: 'grid', value: '2up' },
            { type: 'grid', value: '3up' },
            { type: 'grid', value: '4up' },
            { type: 'grid', value: '5up' },
            { type: 'grid', value: 'fixedA' },
            { type: 'grid', value: 'fixedB' },
            { type: 'grid', value: 'fixedC' },
          ]

          const result = mapPageTemplateToProducts({
            pageTemplate,
            products: mockProducts,
            isMobile: true,
            contentSlotData: '<div></div>',
            productsPerPage: null,
          })

          expect(result).toHaveLength(3)
          expect((result[0] as any).gridVariant).toBe('1up')
          expect((result[1] as any).gridVariant).toBe('2up')
          expect((result[2] as any).gridVariant).toBe('3up')
        })

        it('should allow all 8 variants on desktop', () => {
          const manyProducts = Array.from({ length: 30 }, (_, i) => ({ id: i + 1 }))

          const pageTemplate: SFCCPageEntity[] = [
            { type: 'grid', value: '1up' },
            { type: 'grid', value: '2up' },
            { type: 'grid', value: '3up' },
            { type: 'grid', value: '4up' },
            { type: 'grid', value: '5up' },
            { type: 'grid', value: 'fixedA' },
            { type: 'grid', value: 'fixedB' },
            { type: 'grid', value: 'fixedC' },
          ]

          const result = mapPageTemplateToProducts({
            pageTemplate,
            products: manyProducts,
            isMobile: false,
            contentSlotData: '<div></div>',
            productsPerPage: null,
          })

          expect(result).toHaveLength(8)
          const variants = result.map((r) => (r as any).gridVariant)
          expect(variants).toEqual([
            '1up',
            '2up',
            '3up',
            '4up',
            '5up',
            'fixedA',
            'fixedB',
            'fixedC',
          ])
        })
      })

      describe('Product Slicing', () => {
        it('should take 5 products for 5up grid', () => {
          const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '5up' }]

          const result = mapPageTemplateToProducts({
            pageTemplate,
            products: mockProducts,
            isMobile: false,
            contentSlotData: '<div></div>',
            productsPerPage: null,
          })

          expect((result[0] as any).products).toHaveLength(5)
          expect((result[0] as any).products).toEqual(mockProducts.slice(0, 5))
        })

        it('should consume products sequentially across multiple grids', () => {
          const pageTemplate: SFCCPageEntity[] = [
            { type: 'grid', value: '2up' },
            { type: 'grid', value: '2up' },
          ]

          const result = mapPageTemplateToProducts({
            pageTemplate,
            products: mockProducts.slice(0, 4),
            isMobile: false,
            contentSlotData: '<div></div>',
            productsPerPage: null,
          })

          expect((result[0] as any).products).toEqual(mockProducts.slice(0, 2))
          expect((result[1] as any).products).toEqual(mockProducts.slice(2, 4))
        })

        it('should handle empty products array', () => {
          const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '3up' }]

          const result = mapPageTemplateToProducts({
            pageTemplate,
            products: [],
            isMobile: false,
            contentSlotData: '<div></div>',
            productsPerPage: null,
          })

          expect(result).toHaveLength(0)
        })
      })

      describe('Grid Adjustment', () => {
        it('should adjust grid variant down when insufficient products on desktop', () => {
          const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '5up' }]

          const result = mapPageTemplateToProducts({
            pageTemplate,
            products: mockProducts.slice(0, 3),
            isMobile: false,
            contentSlotData: '<div></div>',
            productsPerPage: null,
          })

          expect((result[0] as any).gridVariant).toBe('3up')
          expect((result[0] as any).products).toHaveLength(3)
        })

        it('should skip grid entirely when insufficient products on mobile', () => {
          const pageTemplate: SFCCPageEntity[] = [{ type: 'grid', value: '3up' }]

          const result = mapPageTemplateToProducts({
            pageTemplate,
            products: mockProducts.slice(0, 2),
            isMobile: true,
            contentSlotData: '<div></div>',
            productsPerPage: null,
          })

          expect(result).toHaveLength(0)
        })
      })
    })

    describe('Content Entity Processing', () => {
      describe('Valid Content Creation', () => {
        it('should create content entity for valid content type', () => {
          mockCheerioInstance.html.mockReturnValue('Test Content')

          const pageTemplate: SFCCPageEntity[] = [{ type: 'content', value: 'content1' }]

          const result = mapPageTemplateToProducts({
            pageTemplate,
            products: mockProducts,
            isMobile: false,
            contentSlotData: '<div id="content1">Test Content</div>',
            productsPerPage: null,
          })

          expect(result).toHaveLength(1)
          expect(result[0]).toMatchObject({
            id: 'grid-0',
            html: 'Test Content',
          })
        })

        it('should use cheerio to parse HTML and extract slot content', () => {
          const mockSelector = jest.fn().mockReturnValue(mockCheerioInstance)
          const mockLoad = jest.fn().mockReturnValue(mockSelector)

          mockCheerioLoad.mockImplementation(mockLoad)
          mockCheerioInstance.html.mockReturnValue('Extracted Content')

          const pageTemplate: SFCCPageEntity[] = [{ type: 'content', value: 'slot1' }]

          mapPageTemplateToProducts({
            pageTemplate,
            products: mockProducts,
            isMobile: false,
            contentSlotData: '<div id="slot1">Content</div>',
            productsPerPage: null,
          })

          expect(mockSanitizeHtmlMarkup).toHaveBeenCalledWith('<div id="slot1">Content</div>')
          expect(mockCheerioLoad).toHaveBeenCalled()
          expect(mockSelector).toHaveBeenCalledWith('#slot1')
        })

        it('should sanitize HTML before parsing', () => {
          const pageTemplate: SFCCPageEntity[] = [{ type: 'content', value: 'content1' }]

          mapPageTemplateToProducts({
            pageTemplate,
            products: mockProducts,
            isMobile: false,
            contentSlotData: '<script>alert("xss")</script><div id="content1">Safe Content</div>',
            productsPerPage: null,
          })

          expect(mockSanitizeHtmlMarkup).toHaveBeenCalledWith(
            '<script>alert("xss")</script><div id="content1">Safe Content</div>'
          )
        })
      })

      describe('Content Extraction', () => {
        it('should find element by ID and extract inner HTML', () => {
          const mockSelector = jest.fn().mockReturnValue(mockCheerioInstance)

          mockCheerioLoad.mockReturnValue(mockSelector)
          mockCheerioInstance.html.mockReturnValue('   Extracted Content   ')

          const pageTemplate: SFCCPageEntity[] = [{ type: 'content', value: 'mySlot' }]

          const result = mapPageTemplateToProducts({
            pageTemplate,
            products: mockProducts,
            isMobile: false,
            contentSlotData: '<div></div>',
            productsPerPage: null,
          })

          expect(mockSelector).toHaveBeenCalledWith('#mySlot')
          expect((result[0] as any).html).toBe('Extracted Content')
        })

        it('should trim whitespace from extracted content', () => {
          mockCheerioInstance.html.mockReturnValue('   Content with spaces   ')

          const pageTemplate: SFCCPageEntity[] = [{ type: 'content', value: 'content1' }]

          const result = mapPageTemplateToProducts({
            pageTemplate,
            products: mockProducts,
            isMobile: false,
            contentSlotData: '<div></div>',
            productsPerPage: null,
          })

          expect((result[0] as any).html).toBe('Content with spaces')
        })
      })

      describe('Empty Content Handling', () => {
        it('should skip entity when no markup found', () => {
          mockCheerioInstance.html.mockReturnValue(undefined)

          const pageTemplate: SFCCPageEntity[] = [{ type: 'content', value: 'nonexistent' }]

          const result = mapPageTemplateToProducts({
            pageTemplate,
            products: mockProducts,
            isMobile: false,
            contentSlotData: '<div></div>',
            productsPerPage: null,
          })

          expect(result).toHaveLength(0)
        })

        it('should skip entity when empty slot found', () => {
          mockCheerioInstance.html.mockReturnValue('')

          const pageTemplate: SFCCPageEntity[] = [{ type: 'content', value: 'empty' }]

          const result = mapPageTemplateToProducts({
            pageTemplate,
            products: mockProducts,
            isMobile: false,
            contentSlotData: '<div></div>',
            productsPerPage: null,
          })

          expect(result).toHaveLength(0)
        })

        it('should skip entity when only whitespace', () => {
          mockCheerioInstance.html.mockReturnValue('   \n  \t  ')

          const pageTemplate: SFCCPageEntity[] = [{ type: 'content', value: 'whitespace' }]

          const result = mapPageTemplateToProducts({
            pageTemplate,
            products: mockProducts,
            isMobile: false,
            contentSlotData: '<div></div>',
            productsPerPage: null,
          })

          expect(result).toHaveLength(0)
        })
      })
    })

    describe('Filter Entity Processing', () => {
      describe('Filter Creation', () => {
        it('should create FilterEntity for filter type', () => {
          const pageTemplate: SFCCPageEntity[] = [
            {
              type: 'filter',
              title: 'Filter Title',
              tabs: [],
            },
          ]

          const result = mapPageTemplateToProducts({
            pageTemplate,
            products: mockProducts,
            isMobile: false,
            contentSlotData: '<div></div>',
            productsPerPage: 20,
          })

          expect(result).toHaveLength(1)
          expect(result[0]).toMatchObject({
            id: 'filter-0',
            title: 'Filter Title',
            productsPerPage: 20,
            rowStartPosition: 0,
          })
          expect((result[0] as any).tabs).toEqual([])
        })

        it('should include title and productsPerPage', () => {
          const pageTemplate: SFCCPageEntity[] = [
            {
              type: 'filter',
              title: 'My Filter',
              tabs: [],
            },
          ]

          const result = mapPageTemplateToProducts({
            pageTemplate,
            products: mockProducts,
            isMobile: false,
            contentSlotData: '<div></div>',
            productsPerPage: 50,
          })

          expect((result[0] as any).title).toBe('My Filter')
          expect((result[0] as any).productsPerPage).toBe(50)
        })

        it('should set rowStartPosition from current product index', () => {
          const pageTemplate: SFCCPageEntity[] = [
            { type: 'grid', value: '3up' },
            { type: 'filter', title: 'Filter', tabs: [] },
          ]

          const result = mapPageTemplateToProducts({
            pageTemplate,
            products: mockProducts,
            isMobile: false,
            contentSlotData: '<div></div>',
            productsPerPage: 20,
          })

          expect((result[1] as any).rowStartPosition).toBe(3)
        })
      })

      describe('Tabs Processing', () => {
        it('should map each tab in layout.tabs array', () => {
          mockCheerioInstance.html.mockReturnValue('Tab Content')

          const pageTemplate: SFCCPageEntity[] = [
            {
              type: 'filter',
              title: 'Filter',
              tabs: [
                { buttonText: 'Tab 1', content: 'tab1', filterString: 'filter1' },
                { buttonText: 'Tab 2', content: 'tab2', filterString: 'filter2' },
              ],
            },
          ]

          const result = mapPageTemplateToProducts({
            pageTemplate,
            products: mockProducts,
            isMobile: false,
            contentSlotData: '<div></div>',
            productsPerPage: 20,
          })

          expect((result[0] as any).tabs).toHaveLength(2)
          expect((result[0] as any).tabs[0]).toMatchObject({
            buttonText: 'Tab 1',
            filterString: 'filter1',
            content: {
              id: 'tab1',
              html: 'Tab Content',
            },
          })
        })

        it('should extract content HTML for each tab', () => {
          const mockSelector = jest.fn()

          mockSelector.mockReturnValueOnce({
            html: () => 'Content 1',
            find: jest.fn().mockReturnValue({ length: 0 }),
          })
          mockSelector.mockReturnValueOnce({
            html: () => 'Content 2',
            find: jest.fn().mockReturnValue({ length: 0 }),
          })
          mockCheerioLoad.mockReturnValue(mockSelector)

          const pageTemplate: SFCCPageEntity[] = [
            {
              type: 'filter',
              title: 'Filter',
              tabs: [
                { buttonText: 'Tab 1', content: 'content1', filterString: 'filter1' },
                { buttonText: 'Tab 2', content: 'content2', filterString: 'filter2' },
              ],
            },
          ]

          mapPageTemplateToProducts({
            pageTemplate,
            products: mockProducts,
            isMobile: false,
            contentSlotData: '<div></div>',
            productsPerPage: 20,
          })

          expect(mockSelector).toHaveBeenCalledWith('#content1')
          expect(mockSelector).toHaveBeenCalledWith('#content2')
        })

        it('should handle missing content gracefully', () => {
          mockCheerioInstance.html.mockReturnValue(null)

          const pageTemplate: SFCCPageEntity[] = [
            {
              type: 'filter',
              title: 'Filter',
              tabs: [{ buttonText: 'Tab 1', content: 'missing', filterString: 'filter1' }],
            },
          ]

          const result = mapPageTemplateToProducts({
            pageTemplate,
            products: mockProducts,
            isMobile: false,
            contentSlotData: '<div></div>',
            productsPerPage: 20,
          })

          expect((result[0] as any).tabs[0].content).toBeNull()
        })
      })

      describe('Tab Content Extraction', () => {
        it('should look up element by tab content ID', () => {
          const mockSelector = jest.fn().mockReturnValue(mockCheerioInstance)

          mockCheerioLoad.mockReturnValue(mockSelector)
          mockCheerioInstance.html.mockReturnValue('Tab HTML')

          const pageTemplate: SFCCPageEntity[] = [
            {
              type: 'filter',
              title: 'Filter',
              tabs: [{ buttonText: 'Tab', content: 'tabContent', filterString: 'filter' }],
            },
          ]

          mapPageTemplateToProducts({
            pageTemplate,
            products: mockProducts,
            isMobile: false,
            contentSlotData: '<div></div>',
            productsPerPage: 20,
          })

          expect(mockSelector).toHaveBeenCalledWith('#tabContent')
        })

        it('should create content object with html and id when markup exists', () => {
          mockCheerioInstance.html.mockReturnValue('Tab Content HTML')

          const pageTemplate: SFCCPageEntity[] = [
            {
              type: 'filter',
              title: 'Filter',
              tabs: [{ buttonText: 'Tab', content: 'tab1', filterString: 'filter' }],
            },
          ]

          const result = mapPageTemplateToProducts({
            pageTemplate,
            products: mockProducts,
            isMobile: false,
            contentSlotData: '<div></div>',
            productsPerPage: 20,
          })

          expect((result[0] as any).tabs[0].content).toEqual({
            id: 'tab1',
            html: 'Tab Content HTML',
            hasVideo: false,
          })
        })

        it('should set content to null when no markup found', () => {
          mockCheerioInstance.html.mockReturnValue(null)

          const pageTemplate: SFCCPageEntity[] = [
            {
              type: 'filter',
              title: 'Filter',
              tabs: [{ buttonText: 'Tab', content: 'missing', filterString: 'filter' }],
            },
          ]

          const result = mapPageTemplateToProducts({
            pageTemplate,
            products: mockProducts,
            isMobile: false,
            contentSlotData: '<div></div>',
            productsPerPage: 20,
          })

          expect((result[0] as any).tabs[0].content).toBeNull()
        })
      })
    })

    describe('Recommendation Entities Processing', () => {
      it('should create RecommendationsEntity for recomGrid type', () => {
        const desktopSlotInstance = {
          html: jest.fn().mockReturnValue('<p>Test content</p>'),
          find: jest.fn().mockReturnValue({ length: 0 }),
          length: 1,
        }

        const mockSelector = jest.fn((selector: string) => {
          if (selector === '#desktop-slot') {
            return desktopSlotInstance
          }
          return mockCheerioInstance
        })

        mockCheerioLoad.mockReturnValue(mockSelector)
        mockSanitizeHtmlMarkup.mockReturnValue('<div id="desktop-slot"><p>Test content</p></div>')

        const pageTemplate: SFCCPageEntity[] = [
          {
            type: 'recomGrid',
            schema: 'similar-products',
            viewMoreText: 'View More',
            viewLessText: 'View Less',
            content: 'desktop-slot',
          },
        ]

        const result = mapPageTemplateToProducts({
          pageTemplate,
          products: mockProducts,
          isMobile: false,
          contentSlotData: '<div id="desktop-slot"><p>Test content</p></div>',
          productsPerPage: 20,
        })

        expect(result).toHaveLength(1)
        expect(result[0]).toMatchObject({
          id: 'recom-grid-0',
          type: 'recomGrid',
          schema: 'similar-products',
          viewMoreText: 'View More',
          viewLessText: 'View Less',
          content: {
            html: '<p>Test content</p>',
            id: 'desktop-slot',
            hasVideo: false,
          },
        })
      })

      it('should set content to null when not provided', () => {
        const pageTemplate: SFCCPageEntity[] = [
          {
            type: 'recomGrid',
            schema: 'similar-products',
            viewMoreText: 'View More',
            viewLessText: 'View Less',
          },
        ]

        const result = mapPageTemplateToProducts({
          pageTemplate,
          products: mockProducts,
          isMobile: false,
          contentSlotData: '<div></div>',
          productsPerPage: 20,
        })

        const recomGrid = result[0] as {
          content: { html: string; id: string; hasVideo: boolean } | null
        }
        expect(recomGrid.content).toBeNull()
      })

      it('should set hasVideo to true when content contains video', () => {
        const desktopSlotWithVideo = {
          html: jest.fn().mockReturnValue('<div class="content-video">Video content</div>'),
          find: jest.fn().mockReturnValue({ length: 1 }),
          length: 1,
        }

        const mockSelector = jest.fn((selector: string) => {
          if (selector === '#desktop-slot') {
            return desktopSlotWithVideo
          }
          return mockCheerioInstance
        })

        mockCheerioLoad.mockReturnValue(mockSelector)
        mockSanitizeHtmlMarkup.mockReturnValue(
          '<div id="desktop-slot"><div class="content-video">Video content</div></div>'
        )

        const pageTemplate: SFCCPageEntity[] = [
          {
            type: 'recomGrid',
            schema: 'similar-products',
            viewMoreText: 'View More',
            viewLessText: 'View Less',
            content: 'desktop-slot',
          },
        ]

        const result = mapPageTemplateToProducts({
          pageTemplate,
          products: mockProducts,
          isMobile: false,
          contentSlotData:
            '<div id="desktop-slot"><div class="content-video">Video content</div></div>',
          productsPerPage: 20,
        })

        expect(result[0]).toMatchObject({
          content: {
            html: '<div class="content-video">Video content</div>',
            id: 'desktop-slot',
            hasVideo: true,
          },
        })
      })

      it('should set content to null when markup is empty', () => {
        const emptySlotInstance = {
          html: jest.fn().mockReturnValue(''),
          find: jest.fn().mockReturnValue({ length: 0 }),
          length: 1,
        }

        const mockSelector = jest.fn((selector: string) => {
          if (selector === '#empty-slot') {
            return emptySlotInstance
          }
          return mockCheerioInstance
        })

        mockCheerioLoad.mockReturnValue(mockSelector)
        mockSanitizeHtmlMarkup.mockReturnValue('<div id="empty-slot"></div>')

        const pageTemplate: SFCCPageEntity[] = [
          {
            type: 'recomGrid',
            schema: 'similar-products',
            viewMoreText: 'View More',
            viewLessText: 'View Less',
            content: 'empty-slot',
          },
        ]

        const result = mapPageTemplateToProducts({
          pageTemplate,
          products: mockProducts,
          isMobile: false,
          contentSlotData: '<div id="empty-slot"></div>',
          productsPerPage: 20,
        })

        const recomGrid = result[0] as {
          content: { html: string; id: string; hasVideo: boolean } | null
        }
        expect(recomGrid.content).toBeNull()
      })

      it('should create RecomCarouselEntity for recomCarousel type', () => {
        const pageTemplate: SFCCPageEntity[] = [
          {
            type: 'recomCarousel',
            schema: 'recently-viewed',
          },
        ]

        const result = mapPageTemplateToProducts({
          pageTemplate,
          products: mockProducts,
          isMobile: false,
          contentSlotData: '<div></div>',
          productsPerPage: 20,
        })

        expect(result).toHaveLength(1)
        expect(result[0]).toMatchObject({
          id: 'recom-carousel-0',
          type: 'recomCarousel',
          schema: 'recently-viewed',
        })
      })
    })
  })
})
