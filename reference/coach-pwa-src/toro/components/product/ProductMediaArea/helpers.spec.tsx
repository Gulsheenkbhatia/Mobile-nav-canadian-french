import {
  getFileBaseName,
  getLastImageIdx,
  getVideoSources,
  isSpecificAssetTypeSrc,
} from 'toro/components/product/ProductMediaArea/helpers'

import isString from 'lodash/isString'
import isEmpty from 'lodash/isEmpty'

jest.mock('lodash/isString')
jest.mock('lodash/isEmpty')

describe('Utility Functions', () => {
  beforeEach(() => {
    ;(isString as unknown as jest.Mock).mockReset()
    ;(isEmpty as unknown as jest.Mock).mockReset()
  })

  describe('getFileBaseName', () => {
    it('should return an empty string if input is not a string', () => {
      ;(isString as unknown as jest.Mock).mockReturnValue(false)
      expect(getFileBaseName(123)).toBe('')
      expect(isString).toHaveBeenCalledWith(123)
    })

    it('should return the file base name from a URL', () => {
      ;(isString as unknown as jest.Mock).mockReturnValue(true)
      expect(getFileBaseName('http://coach.com/path/to/file.txt')).toBe('file.txt')
      expect(getFileBaseName('http://coach.com/path/to/file.txt?query=123')).toBe('file.txt')
      expect(getFileBaseName('http://coach.com/path/to/file.txt#fragment')).toBe('file.txt')
    })

    it('should return the correct file base name for URLs with special characters', () => {
      ;(isString as unknown as jest.Mock).mockReturnValue(true)
      expect(getFileBaseName('http://coach.com/path/to/file name with spaces.txt')).toBe(
        'file name with spaces.txt'
      )
    })
  })

  describe('getLastImageIdx', () => {
    it('should return the last index of a non-video media', () => {
      const medias = [{ type: 'video' }, { type: 'image' }, { type: 'video' }, { type: 'image' }]
      expect(getLastImageIdx(medias)).toBe(3)
    })

    it('should return undefined if all medias are videos', () => {
      const medias = [{ type: 'video' }, { type: 'video' }]
      expect(getLastImageIdx(medias)).toBeUndefined()
    })
  })

  describe('getVideoSources', () => {
    it('should return an empty array if no product videos are available', () => {
      ;(isEmpty as unknown as jest.Mock).mockReturnValue(true)
      expect(getVideoSources({}, null, null)).toEqual([])
    })

    it('should return video sources matching the cleaned color variant', () => {
      ;(isEmpty as unknown as jest.Mock).mockReturnValue(false)
      const videoSrc = {
        Product: {
          video_123: 'videoUrl1',
          video_456: 'videoUrl2',
        },
      }
      const selectedVariant = {
        variationValues: {
          color: '123',
        },
      }
      const selectedColor = { id: '456' }
      expect(getVideoSources(videoSrc, selectedVariant, selectedColor)).toEqual(['videoUrl1'])
    })

    it('should handle cases where selectedVariant is empty', () => {
      ;(isEmpty as unknown as jest.Mock).mockReturnValue(true)
      const videoSrc = {
        Product: {
          video_123: 'videoUrl1',
          video_456: 'videoUrl2',
        },
      }
      const selectedColor = { id: '123' }
      expect(getVideoSources(videoSrc, null, selectedColor)).toEqual(['videoUrl1'])
    })
  })

  describe('isSpecificAssetTypeSrc', () => {
    it('should return true if the src ends with the specified asset type', () => {
      expect(isSpecificAssetTypeSrc('http://coach.com/image_b0', '_b0')).toBe(true)
    })

    it('should return false if the src does not end with the specified asset type', () => {
      expect(isSpecificAssetTypeSrc('http://coach.com/image_b1', '_b0')).toBe(false)
    })

    it('should return false if src is undefined or empty', () => {
      expect(isSpecificAssetTypeSrc('', '_b0')).toBe(false)
    })
  })
})
