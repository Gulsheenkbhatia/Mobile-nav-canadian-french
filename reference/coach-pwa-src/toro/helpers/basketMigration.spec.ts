import {
  validateMigrationPayload,
  convertPayloadToSfccBasket,
  populateMigrationCookie,
  consumeMigrationCookie,
  type MigrationPayload,
} from './basketMigration'
import type { NextApiRequest, NextApiResponse } from 'next'

// Mock dependencies
const mockGet = jest.fn()
const mockSet = jest.fn()

jest.mock('cookies', () => {
  return jest.fn().mockImplementation(() => ({
    get: mockGet,
    set: mockSet,
  }))
})

describe('basketMigration', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = { ...originalEnv }
    mockGet.mockReturnValue(undefined)
    mockSet.mockImplementation(() => {})

    // Mock process.env.NODE_ENV for logging tests
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'test',
      writable: true,
    })
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('validateMigrationPayload', () => {
    it('should validate correct payload', () => {
      const payload: MigrationPayload = [
        { pid: 'SKU123', qty: 2 },
        { pid: 'SKU456', qty: 1 },
      ]
      expect(validateMigrationPayload(payload)).toBe(true)
    })

    it('should reject null payload', () => {
      expect(validateMigrationPayload(null)).toBe(false)
    })

    it('should reject undefined payload', () => {
      expect(validateMigrationPayload(undefined)).toBe(false)
    })

    it('should reject non-array payload', () => {
      expect(validateMigrationPayload({ pid: 'SKU123', qty: 1 })).toBe(false)
      expect(validateMigrationPayload('invalid')).toBe(false)
      expect(validateMigrationPayload(123)).toBe(false)
    })

    it('should accept empty array (valid structure, just no items to migrate)', () => {
      expect(validateMigrationPayload([])).toBe(true)
    })

    it('should reject item without pid', () => {
      const payload = [{ qty: 1 }] as unknown as MigrationPayload
      expect(validateMigrationPayload(payload)).toBe(false)
    })

    it('should reject item with empty pid string', () => {
      const payload: MigrationPayload = [{ pid: '', qty: 1 }]
      expect(validateMigrationPayload(payload)).toBe(false)
    })

    it('should reject item with whitespace-only pid', () => {
      const payload: MigrationPayload = [{ pid: '   ', qty: 1 }]
      expect(validateMigrationPayload(payload)).toBe(false)
    })

    it('should reject item without qty', () => {
      const payload = [{ pid: 'SKU123' }] as unknown as MigrationPayload
      expect(validateMigrationPayload(payload)).toBe(false)
    })

    it('should reject item with non-integer qty', () => {
      const payload = [{ pid: 'SKU123', qty: 1.5 }] as unknown as MigrationPayload
      expect(validateMigrationPayload(payload)).toBe(false)
    })

    it('should reject item with zero qty', () => {
      const payload: MigrationPayload = [{ pid: 'SKU123', qty: 0 }]
      expect(validateMigrationPayload(payload)).toBe(false)
    })

    it('should reject item with negative qty', () => {
      const payload: MigrationPayload = [{ pid: 'SKU123', qty: -1 }]
      expect(validateMigrationPayload(payload)).toBe(false)
    })

    it('should reject item with non-number qty', () => {
      const payload = [{ pid: 'SKU123', qty: '1' }] as unknown as MigrationPayload
      expect(validateMigrationPayload(payload)).toBe(false)
    })

    it('should accept payload with trimmed pid', () => {
      const payload: MigrationPayload = [{ pid: '  SKU123  ', qty: 1 }]
      // Note: validation checks for non-empty after trim, but doesn't trim itself
      // The actual trimming happens in extractBasketPayload
      expect(validateMigrationPayload(payload)).toBe(true)
    })

    it('should reject item with null pid', () => {
      const payload = [{ pid: null, qty: 1 }] as unknown as MigrationPayload
      expect(validateMigrationPayload(payload)).toBe(false)
    })

    it('should reject item with non-string pid', () => {
      const payload = [{ pid: 123, qty: 1 }] as unknown as MigrationPayload
      expect(validateMigrationPayload(payload)).toBe(false)
    })
  })

  describe('convertPayloadToSfccBasket', () => {
    it('should convert migration payload to SFCC basket format', () => {
      const payload: MigrationPayload = [
        { pid: 'SKU123', qty: 2 },
        { pid: 'SKU456', qty: 1 },
      ]

      const result = convertPayloadToSfccBasket(payload)

      expect(result).toEqual({
        product_items: [
          { product_id: 'SKU123', quantity: 2 },
          { product_id: 'SKU456', quantity: 1 },
        ],
      })
    })

    it('should handle single item payload', () => {
      const payload: MigrationPayload = [{ pid: 'SKU123', qty: 5 }]

      const result = convertPayloadToSfccBasket(payload)

      expect(result).toEqual({
        product_items: [{ product_id: 'SKU123', quantity: 5 }],
      })
    })

    it('should handle empty payload', () => {
      const payload: MigrationPayload = []

      const result = convertPayloadToSfccBasket(payload)

      expect(result).toEqual({
        product_items: [],
      })
    })
  })

  describe('populateMigrationCookie', () => {
    const mockReq = {} as NextApiRequest
    const mockRes = {} as NextApiResponse

    it('should write cookie when feature flag is enabled and basket has items', async () => {
      process.env.BASKET_MIGRATION_COOKIE_WRITE = 'legacyBasket'

      const basketResponse = {
        product_items: [
          { product_id: 'SKU123', quantity: 2 },
          { product_id: 'SKU456', quantity: 1 },
        ],
      }

      await populateMigrationCookie(mockReq, mockRes, basketResponse)

      expect(mockSet).toHaveBeenCalledWith(
        'legacyBasket',
        JSON.stringify([
          { pid: 'SKU123', qty: 2 },
          { pid: 'SKU456', qty: 1 },
        ]),
        expect.objectContaining({
          maxAge: 2592000, // 30 days
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
        })
      )
    })

    it('should not write cookie when feature flag is disabled', async () => {
      delete process.env.BASKET_MIGRATION_COOKIE_WRITE

      const basketResponse = {
        product_items: [{ product_id: 'SKU123', quantity: 1 }],
      }

      await populateMigrationCookie(mockReq, mockRes, basketResponse)

      expect(mockSet).not.toHaveBeenCalled()
    })

    it('should not write cookie when basket is empty', async () => {
      process.env.BASKET_MIGRATION_COOKIE_WRITE = 'legacyBasket'

      const basketResponse = {
        product_items: [],
      }

      await populateMigrationCookie(mockReq, mockRes, basketResponse)

      expect(mockSet).not.toHaveBeenCalled()
    })

    it('should not write cookie when basket has no product_items', async () => {
      process.env.BASKET_MIGRATION_COOKIE_WRITE = 'legacyBasket'

      const basketResponse = {}

      await populateMigrationCookie(mockReq, mockRes, basketResponse)

      expect(mockSet).not.toHaveBeenCalled()
    })

    it('should handle raw Response object and extract product_items', async () => {
      process.env.BASKET_MIGRATION_COOKIE_WRITE = 'legacyBasket'

      const mockResponseData = {
        product_items: [{ product_id: 'BOPIS-SKU', quantity: 3 }],
      }

      // Mock cloned Response with its own json method
      const mockClonedResponse = {
        json: jest.fn().mockResolvedValue(mockResponseData),
      }

      // Mock Response object - clone returns a separate object with json method
      const mockResponse = {
        json: jest.fn(),
        clone: jest.fn().mockReturnValue(mockClonedResponse),
      } as unknown as Response

      await populateMigrationCookie(mockReq, mockRes, mockResponse)

      expect(mockResponse.clone).toHaveBeenCalled()
      expect(mockClonedResponse.json).toHaveBeenCalled()
      expect(mockSet).toHaveBeenCalledWith(
        'legacyBasket',
        JSON.stringify([{ pid: 'BOPIS-SKU', qty: 3 }]),
        expect.any(Object)
      )
    })

    it('should not write cookie when Response parsing fails', async () => {
      process.env.BASKET_MIGRATION_COOKIE_WRITE = 'legacyBasket'

      // Mock cloned Response that fails to parse
      const mockClonedResponse = {
        json: jest.fn().mockRejectedValue(new Error('Parse error')),
      }

      const mockResponse = {
        json: jest.fn(),
        clone: jest.fn().mockReturnValue(mockClonedResponse),
      } as unknown as Response

      await populateMigrationCookie(mockReq, mockRes, mockResponse)

      expect(mockSet).not.toHaveBeenCalled()
    })
  })

  describe('consumeMigrationCookie', () => {
    const mockReq = {} as NextApiRequest
    const mockRes = {} as NextApiResponse

    it('should read and delete cookie when feature flag is enabled and cookie exists', () => {
      process.env.BASKET_MIGRATION_COOKIE_READ = 'legacyBasket'
      const cookieValue = JSON.stringify([
        { pid: 'SKU123', qty: 2 },
        { pid: 'SKU456', qty: 1 },
      ])
      mockGet.mockReturnValue(cookieValue)

      const result = consumeMigrationCookie(mockReq, mockRes)

      expect(mockGet).toHaveBeenCalledWith('legacyBasket')
      expect(result).toEqual({
        product_items: [
          { product_id: 'SKU123', quantity: 2 },
          { product_id: 'SKU456', quantity: 1 },
        ],
      })
      // Cookie should be deleted after reading
      expect(mockSet).toHaveBeenCalledWith(
        'legacyBasket',
        '',
        expect.objectContaining({
          maxAge: 0,
        })
      )
    })

    it('should return null when feature flag is disabled', () => {
      delete process.env.BASKET_MIGRATION_COOKIE_READ

      const result = consumeMigrationCookie(mockReq, mockRes)

      expect(result).toBeNull()
      expect(mockGet).not.toHaveBeenCalled()
    })

    it('should return null when cookie does not exist', () => {
      process.env.BASKET_MIGRATION_COOKIE_READ = 'legacyBasket'
      mockGet.mockReturnValue(undefined)

      const result = consumeMigrationCookie(mockReq, mockRes)

      expect(result).toBeNull()
      expect(mockGet).toHaveBeenCalledWith('legacyBasket')
    })

    it('should return null when cookie contains empty array', () => {
      process.env.BASKET_MIGRATION_COOKIE_READ = 'legacyBasket'
      mockGet.mockReturnValue('[]')

      const result = consumeMigrationCookie(mockReq, mockRes)

      expect(result).toBeNull()
      // Cookie should still be deleted even if empty
      expect(mockSet).toHaveBeenCalled()
    })

    it('should return null and delete cookie when cookie contains invalid JSON', () => {
      process.env.BASKET_MIGRATION_COOKIE_READ = 'legacyBasket'
      mockGet.mockReturnValue('invalid-json')

      const result = consumeMigrationCookie(mockReq, mockRes)

      expect(result).toBeNull()
      // Cookie should be deleted even if invalid
      expect(mockSet).toHaveBeenCalled()
    })

    it('should return null and delete cookie when cookie contains invalid payload structure', () => {
      process.env.BASKET_MIGRATION_COOKIE_READ = 'legacyBasket'
      mockGet.mockReturnValue('{"invalid": "structure"}')

      const result = consumeMigrationCookie(mockReq, mockRes)

      expect(result).toBeNull()
      // Cookie should be deleted even if invalid
      expect(mockSet).toHaveBeenCalled()
    })
  })

  describe('populateMigrationCookie + consumeMigrationCookie integration', () => {
    const mockReq = {} as NextApiRequest
    const mockRes = {} as NextApiResponse

    it('should round-trip: write cookie and read it back', async () => {
      // Setup: enable both feature flags
      process.env.BASKET_MIGRATION_COOKIE_WRITE = 'legacyBasket'
      process.env.BASKET_MIGRATION_COOKIE_READ = 'legacyBasket'

      const basketResponse = {
        product_items: [
          { product_id: 'SKU123', quantity: 2 },
          { product_id: 'SKU456', quantity: 1 },
        ],
      }

      // Write cookie
      await populateMigrationCookie(mockReq, mockRes, basketResponse)

      // Verify cookie was written
      expect(mockSet).toHaveBeenCalledWith(
        'legacyBasket',
        JSON.stringify([
          { pid: 'SKU123', qty: 2 },
          { pid: 'SKU456', qty: 1 },
        ]),
        expect.any(Object)
      )

      // Simulate cookie being read back (get the value that was set)
      const writtenCookieValue = mockSet.mock.calls[0][1]
      mockGet.mockReturnValue(writtenCookieValue)

      // Read cookie
      const result = consumeMigrationCookie(mockReq, mockRes)

      // Verify correct conversion
      expect(result).toEqual({
        product_items: [
          { product_id: 'SKU123', quantity: 2 },
          { product_id: 'SKU456', quantity: 1 },
        ],
      })
    })

    it('should handle single item round-trip', async () => {
      process.env.BASKET_MIGRATION_COOKIE_WRITE = 'legacyBasket'
      process.env.BASKET_MIGRATION_COOKIE_READ = 'legacyBasket'

      const basketResponse = {
        product_items: [{ product_id: 'SKU789', quantity: 5 }],
      }

      await populateMigrationCookie(mockReq, mockRes, basketResponse)

      const writtenCookieValue = mockSet.mock.calls[0][1]
      mockGet.mockReturnValue(writtenCookieValue)

      const result = consumeMigrationCookie(mockReq, mockRes)

      expect(result).toEqual({
        product_items: [{ product_id: 'SKU789', quantity: 5 }],
      })
    })
  })
})
