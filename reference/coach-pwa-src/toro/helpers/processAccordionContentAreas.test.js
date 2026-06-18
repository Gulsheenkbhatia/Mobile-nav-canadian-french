import processAccordionContentAreas from './processAccordionContentAreas'
import { parseCMSContentSlots } from 'toro/cms/server/contentSlotsParser'
import get from 'lodash/get'

jest.mock('toro/cms/server/contentSlotsParser')
jest.mock('lodash/get')

const mockParseCMSContentSlots = jest.mocked(parseCMSContentSlots)
const mockGet = jest.mocked(get)

describe('processAccordionContentAreas', () => {
  const siteId = 'coach-us'
  const viewport = 'mobile'
  const masterCustomAttributes = {
    c_pdp6AccordionContent1: 'content-id-1',
    c_pdp6AccordionContent2: 'content-id-2',
  }
  const contentAssetsDataFull = {
    'content-id-1': {
      c_body: {
        default: {
          markup: '<p>Care instructions</p>',
        },
      },
    },
    'content-id-2': {
      c_body: {
        default: {
          markup: '<p>Sustainability info</p>',
        },
      },
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()

    // Default mock for get function
    mockGet.mockImplementation((obj, path) => {
      if (obj === masterCustomAttributes) {
        return masterCustomAttributes[path]
      }
      return undefined
    })
  })

  describe('Basic Functionality', () => {
    it('should return empty array when accordionConfig is not enabled', () => {
      const accordionConfig = {
        enabled: false,
        accordions: [],
      }

      const result = processAccordionContentAreas(
        accordionConfig,
        masterCustomAttributes,
        contentAssetsDataFull,
        siteId,
        viewport
      )

      expect(result).toEqual([])
      expect(mockParseCMSContentSlots).not.toHaveBeenCalled()
    })

    it('should return empty array when accordions array is empty', () => {
      const accordionConfig = {
        enabled: true,
        accordions: [],
      }

      const result = processAccordionContentAreas(
        accordionConfig,
        masterCustomAttributes,
        contentAssetsDataFull,
        siteId,
        viewport
      )

      expect(result).toEqual([])
      expect(mockParseCMSContentSlots).not.toHaveBeenCalled()
    })

    it('should return empty array when accordionConfig is null', () => {
      const result = processAccordionContentAreas(
        null,
        masterCustomAttributes,
        contentAssetsDataFull,
        siteId,
        viewport
      )

      expect(result).toEqual([])
    })

    it('should return empty array when accordionConfig is undefined', () => {
      const result = processAccordionContentAreas(
        undefined,
        masterCustomAttributes,
        contentAssetsDataFull,
        siteId,
        viewport
      )

      expect(result).toEqual([])
    })
  })

  describe('Accordion Processing', () => {
    it('should process enabled accordions correctly', () => {
      const accordionConfig = {
        enabled: true,
        accordions: [
          {
            id: 'accordion-1',
            enabled: true,
            title: { en_US: 'Care Instructions' },
            content: 'c_pdp6AccordionContent1',
            openOnLoad: false,
          },
        ],
      }

      mockParseCMSContentSlots.mockReturnValue({
        'accordion-1': {
          online: { default: true },
          content: {
            html: '<p>Care instructions</p>',
            metaData: { title: 'Care Instructions Meta' },
          },
        },
      })

      const result = processAccordionContentAreas(
        accordionConfig,
        masterCustomAttributes,
        contentAssetsDataFull,
        siteId,
        viewport
      )

      expect(result).toEqual([
        {
          id: 'accordion-1',
          title: 'Care Instructions',
          content: '<p>Care instructions</p>',
          openOnLoad: false,
        },
      ])

      expect(mockParseCMSContentSlots).toHaveBeenCalledWith(
        {
          'accordion-1': {
            content: contentAssetsDataFull['content-id-1'],
            config: { device: 'All' },
          },
        },
        { siteId, viewport }
      )
    })

    it('should process multiple accordions', () => {
      const accordionConfig = {
        enabled: true,
        accordions: [
          {
            id: 'accordion-1',
            enabled: true,
            title: { en_US: 'Care Instructions' },
            content: 'c_pdp6AccordionContent1',
            openOnLoad: false,
          },
          {
            id: 'accordion-2',
            enabled: true,
            title: { en_US: 'Sustainability' },
            content: 'c_pdp6AccordionContent2',
            openOnLoad: true,
          },
        ],
      }

      mockParseCMSContentSlots.mockReturnValue({
        'accordion-1': {
          online: { default: true },
          content: {
            html: '<p>Care instructions</p>',
            metaData: { title: 'Care Meta' },
          },
        },
        'accordion-2': {
          online: { default: true },
          content: {
            html: '<p>Sustainability info</p>',
            metaData: { title: 'Sustainability Meta' },
          },
        },
      })

      const result = processAccordionContentAreas(
        accordionConfig,
        masterCustomAttributes,
        contentAssetsDataFull,
        siteId,
        viewport
      )

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        id: 'accordion-1',
        title: 'Care Instructions',
        content: '<p>Care instructions</p>',
        openOnLoad: false,
      })
      expect(result[1]).toEqual({
        id: 'accordion-2',
        title: 'Sustainability',
        content: '<p>Sustainability info</p>',
        openOnLoad: true,
      })
    })
  })

  describe('Filtering Logic', () => {
    it('should skip disabled accordions', () => {
      const accordionConfig = {
        enabled: true,
        accordions: [
          {
            id: 'accordion-1',
            enabled: false, // Disabled
            title: { en_US: 'Should Not Render' },
            content: 'c_pdp6AccordionContent1',
            openOnLoad: false,
          },
        ],
      }

      mockParseCMSContentSlots.mockReturnValue({
        'accordion-1': {
          online: { default: true },
          content: {
            html: '<p>Content</p>',
            metaData: { title: 'Title' },
          },
        },
      })

      const result = processAccordionContentAreas(
        accordionConfig,
        masterCustomAttributes,
        contentAssetsDataFull,
        siteId,
        viewport
      )

      expect(result).toEqual([])
    })

    it('should skip accordions without content slot', () => {
      const accordionConfig = {
        enabled: true,
        accordions: [
          {
            id: 'accordion-1',
            enabled: true,
            title: { en_US: 'Test' },
            content: 'c_pdp6AccordionContent1',
            openOnLoad: false,
          },
        ],
      }

      mockParseCMSContentSlots.mockReturnValue({
        // No accordion-1 in parsed slots
      })

      const result = processAccordionContentAreas(
        accordionConfig,
        masterCustomAttributes,
        contentAssetsDataFull,
        siteId,
        viewport
      )

      expect(result).toEqual([])
    })

    it('should skip accordions with offline content', () => {
      const accordionConfig = {
        enabled: true,
        accordions: [
          {
            id: 'accordion-1',
            enabled: true,
            title: { en_US: 'Test' },
            content: 'c_pdp6AccordionContent1',
            openOnLoad: false,
          },
        ],
      }

      mockParseCMSContentSlots.mockReturnValue({
        'accordion-1': {
          online: { default: false }, // Offline
          content: {
            html: '<p>Content</p>',
            metaData: { title: 'Title' },
          },
        },
      })

      const result = processAccordionContentAreas(
        accordionConfig,
        masterCustomAttributes,
        contentAssetsDataFull,
        siteId,
        viewport
      )

      expect(result).toEqual([])
    })

    it('should skip accordions without markup', () => {
      const accordionConfig = {
        enabled: true,
        accordions: [
          {
            id: 'accordion-1',
            enabled: true,
            title: { en_US: 'Test' },
            content: 'c_pdp6AccordionContent1',
            openOnLoad: false,
          },
        ],
      }

      mockParseCMSContentSlots.mockReturnValue({
        'accordion-1': {
          online: { default: true },
          content: {
            html: '', // Empty markup
            metaData: { title: 'Title' },
          },
        },
      })

      const result = processAccordionContentAreas(
        accordionConfig,
        masterCustomAttributes,
        contentAssetsDataFull,
        siteId,
        viewport
      )

      expect(result).toEqual([])
    })

    it('should skip accordions without content property', () => {
      const accordionConfig = {
        enabled: true,
        accordions: [
          {
            id: 'accordion-1',
            enabled: true,
            title: { en_US: 'Test' },
            content: 'c_pdp6AccordionContent1',
            openOnLoad: false,
          },
        ],
      }

      mockParseCMSContentSlots.mockReturnValue({
        'accordion-1': {
          online: { default: true },
          // Missing content property
        },
      })

      const result = processAccordionContentAreas(
        accordionConfig,
        masterCustomAttributes,
        contentAssetsDataFull,
        siteId,
        viewport
      )

      expect(result).toEqual([])
    })
  })

  describe('Title Fallback Logic', () => {
    it('should use config title over metadata title', () => {
      const accordionConfig = {
        enabled: true,
        accordions: [
          {
            id: 'accordion-1',
            enabled: true,
            title: { en_US: 'Config Title' }, // Should use this
            content: 'c_pdp6AccordionContent1',
            openOnLoad: false,
          },
        ],
      }

      mockParseCMSContentSlots.mockReturnValue({
        'accordion-1': {
          online: { default: true },
          content: {
            html: '<p>Content</p>',
            metaData: { title: 'Metadata Title' },
          },
        },
      })

      const result = processAccordionContentAreas(
        accordionConfig,
        masterCustomAttributes,
        contentAssetsDataFull,
        siteId,
        viewport
      )

      expect(result[0].title).toBe('Config Title')
    })

    it('should use metadata title when config title is not provided', () => {
      const accordionConfig = {
        enabled: true,
        accordions: [
          {
            id: 'accordion-1',
            enabled: true,
            title: null, // Empty config title
            content: 'c_pdp6AccordionContent1',
            openOnLoad: false,
          },
        ],
      }

      mockParseCMSContentSlots.mockReturnValue({
        'accordion-1': {
          online: { default: true },
          content: {
            html: '<p>Content</p>',
            metaData: { title: 'Metadata Title' },
          },
        },
      })

      const result = processAccordionContentAreas(
        accordionConfig,
        masterCustomAttributes,
        contentAssetsDataFull,
        siteId,
        viewport
      )

      expect(result[0].title).toBe('Metadata Title')
    })

    it('should use "Content Area" as fallback when no titles are provided', () => {
      const accordionConfig = {
        enabled: true,
        accordions: [
          {
            id: 'accordion-1',
            enabled: true,
            title: null,
            content: 'c_pdp6AccordionContent1',
            openOnLoad: false,
          },
        ],
      }

      mockParseCMSContentSlots.mockReturnValue({
        'accordion-1': {
          online: { default: true },
          content: {
            html: '<p>Content</p>',
            metaData: {}, // No title in metadata
          },
        },
      })

      const result = processAccordionContentAreas(
        accordionConfig,
        masterCustomAttributes,
        contentAssetsDataFull,
        siteId,
        viewport
      )

      expect(result[0].title).toBe('Content Area')
    })

    it('should use correct localized title based on locale', () => {
      const accordionConfig = {
        enabled: true,
        accordions: [
          {
            id: 'accordion-1',
            enabled: true,
            title: {
              en_US: 'Care Instructions',
              fr_CA: "Instructions d'entretien",
            },
            content: 'c_pdp6AccordionContent1',
            openOnLoad: false,
          },
        ],
      }

      mockParseCMSContentSlots.mockReturnValue({
        'accordion-1': {
          online: { default: true },
          content: {
            html: '<p>Content</p>',
            metaData: { title: 'Metadata Title' },
          },
        },
      })

      // Test default locale (en_US)
      const resultDefault = processAccordionContentAreas(
        accordionConfig,
        masterCustomAttributes,
        contentAssetsDataFull,
        siteId,
        viewport
      )
      expect(resultDefault[0].title).toBe('Care Instructions')

      // Test fr-CA locale
      const resultFr = processAccordionContentAreas(
        accordionConfig,
        masterCustomAttributes,
        contentAssetsDataFull,
        siteId,
        viewport,
        'fr-CA'
      )
      expect(resultFr[0].title).toBe("Instructions d'entretien")
    })
  })

  describe('OpenOnLoad Flag', () => {
    it('should preserve openOnLoad flag when true', () => {
      const accordionConfig = {
        enabled: true,
        accordions: [
          {
            id: 'accordion-1',
            enabled: true,
            title: { en_US: 'Test' },
            content: 'c_pdp6AccordionContent1',
            openOnLoad: true,
          },
        ],
      }

      mockParseCMSContentSlots.mockReturnValue({
        'accordion-1': {
          online: { default: true },
          content: {
            html: '<p>Content</p>',
            metaData: { title: 'Test' },
          },
        },
      })

      const result = processAccordionContentAreas(
        accordionConfig,
        masterCustomAttributes,
        contentAssetsDataFull,
        siteId,
        viewport
      )

      expect(result[0].openOnLoad).toBe(true)
    })

    it('should default openOnLoad to false when not provided', () => {
      const accordionConfig = {
        enabled: true,
        accordions: [
          {
            id: 'accordion-1',
            enabled: true,
            title: { en_US: 'Test' },
            content: 'c_pdp6AccordionContent1',
            // openOnLoad not provided
          },
        ],
      }

      mockParseCMSContentSlots.mockReturnValue({
        'accordion-1': {
          online: { default: true },
          content: {
            html: '<p>Content</p>',
            metaData: { title: 'Test' },
          },
        },
      })

      const result = processAccordionContentAreas(
        accordionConfig,
        masterCustomAttributes,
        contentAssetsDataFull,
        siteId,
        viewport
      )

      expect(result[0].openOnLoad).toBe(false)
    })
  })

  describe('Integration with parseCMSContentSlots', () => {
    it('should call parseCMSContentSlots with correct slot structure', () => {
      const accordionConfig = {
        enabled: true,
        accordions: [
          {
            id: 'accordion-1',
            enabled: true,
            title: { en_US: 'Test' },
            content: 'c_pdp6AccordionContent1',
            openOnLoad: false,
          },
        ],
      }

      mockParseCMSContentSlots.mockReturnValue({})

      processAccordionContentAreas(
        accordionConfig,
        masterCustomAttributes,
        contentAssetsDataFull,
        siteId,
        viewport
      )

      expect(mockParseCMSContentSlots).toHaveBeenCalledWith(
        {
          'accordion-1': {
            content: contentAssetsDataFull['content-id-1'],
            config: { device: 'All' },
          },
        },
        { siteId, viewport }
      )
    })

    it('should only include enabled accordions with valid content in slot structure', () => {
      const accordionConfig = {
        enabled: true,
        accordions: [
          {
            id: 'accordion-1',
            enabled: true,
            title: { en_US: 'Enabled' },
            content: 'c_pdp6AccordionContent1',
            openOnLoad: false,
          },
          {
            id: 'accordion-2',
            enabled: false, // Disabled
            title: { en_US: 'Disabled' },
            content: 'c_pdp6AccordionContent2',
            openOnLoad: false,
          },
        ],
      }

      mockParseCMSContentSlots.mockReturnValue({})

      processAccordionContentAreas(
        accordionConfig,
        masterCustomAttributes,
        contentAssetsDataFull,
        siteId,
        viewport
      )

      expect(mockParseCMSContentSlots).toHaveBeenCalledWith(
        {
          'accordion-1': {
            content: contentAssetsDataFull['content-id-1'],
            config: { device: 'All' },
          },
          // accordion-2 should not be included
        },
        { siteId, viewport }
      )
    })
  })
})
