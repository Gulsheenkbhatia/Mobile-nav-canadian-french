import Cookies from 'cookies'
import type { NextApiRequest, NextApiResponse } from 'next'
import isFunction from 'lodash/isFunction'
import isPlainObject from 'lodash/isPlainObject'

// Cookie domain with leading dot for subdomain support (e.g., .coach.com)
const COOKIE_DOMAIN = `.${process.env.BASE_DOMAIN_PATH}`
const COOKIE_MAX_AGE = 2592000 // 30 days in seconds
const COOKIE_PATH = '/'
const COOKIE_SECURE = process.env.NODE_ENV === 'production'

// Types
export type MigrationPayloadItem = {
  pid: string
  qty: number
}

export type MigrationPayload = MigrationPayloadItem[]

export type SfccBasketProductItem = {
  product_id: string
  quantity: number
}

export type SfccBasketPayload = {
  product_items: Array<SfccBasketProductItem>
}

export type BasketResponse = {
  product_items?: Array<{ product_id?: string; quantity?: number }>
}

/**
 * Type guard to check if value is a Response object (raw fetch response)
 * Response has .json() and .clone() methods, unlike plain objects
 */
function isResponseObject(value: unknown): value is Response {
  if (!value || typeof value !== 'object') return false

  const obj = value as Record<string, unknown>
  return isFunction(obj.json) && isFunction(obj.clone)
}

/**
 * Normalizes basket response - handles both raw Response objects and parsed JSON
 * Returns null if parsing fails or response is not valid
 */
async function normalizeBasketResponse(
  basketResponse: Response | BasketResponse | unknown
): Promise<BasketResponse | null> {
  // Case 1: Raw Response object from fetch - need to parse
  // Check this FIRST because mock Response objects can also pass isPlainObject
  if (isResponseObject(basketResponse)) {
    try {
      // Clone to avoid consuming the response body (in case it's needed elsewhere)
      const clonedResponse = basketResponse.clone()
      const parsed = await clonedResponse.json()
      return parsed as BasketResponse
    } catch (parseError) {
      console.error('[basketMigration] Failed to parse Response object:', parseError)
      return null
    }
  }

  // Case 2: Plain object (already parsed JSON like { product_items: [...] })
  if (isPlainObject(basketResponse)) {
    return basketResponse as BasketResponse
  }

  // Case 3: null, undefined, primitives - skip
  return null
}

function hasValidProductItems(
  productItems: unknown
): productItems is Array<{ product_id?: string; quantity?: number }> {
  return Array.isArray(productItems)
}

function isValidProductId(productId: unknown): productId is string {
  return typeof productId === 'string' && productId.trim() !== ''
}

/**
 * Validates a single migration payload item structure
 */
function isValidPayloadItem(item: unknown): item is MigrationPayloadItem {
  if (typeof item !== 'object' || item === null) {
    return false
  }

  const { pid, qty } = item as Record<string, unknown>

  return (
    typeof pid === 'string' &&
    pid.trim().length > 0 &&
    typeof qty === 'number' &&
    Number.isInteger(qty) &&
    qty > 0
  )
}

/**
 * Validates migration payload structure and constraints
 */
export function validateMigrationPayload(payload: unknown): payload is MigrationPayload {
  if (!payload) {
    return false
  }

  if (!Array.isArray(payload)) {
    return false
  }

  // Validate each item structure (empty array is valid - just no items to migrate)
  for (const item of payload) {
    if (!isValidPayloadItem(item)) {
      return false
    }
  }

  return true
}

function hasProductItems(basketResponse: {
  product_items?: unknown
}): basketResponse is { product_items: unknown } {
  return basketResponse?.product_items !== undefined && basketResponse?.product_items !== null
}

/**
 * Extracts basket payload from SFCC basket response
 */
function extractBasketPayload(basketResponse: {
  product_items?: Array<{ product_id?: string; quantity?: number }>
}): MigrationPayload | null {
  if (!hasProductItems(basketResponse)) {
    return null
  }

  if (!hasValidProductItems(basketResponse.product_items)) {
    return null
  }

  const payload: MigrationPayload = []

  for (const item of basketResponse.product_items) {
    const productId = item?.product_id
    const quantity = item?.quantity

    if (!isValidProductId(productId)) {
      continue
    }

    // Skip items with invalid quantity (should not happen in normal SFCC responses)
    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity <= 0) {
      continue
    }

    payload.push({
      pid: productId.trim(),
      qty: quantity,
    })
  }

  return payload.length > 0 ? payload : null
}

/**
 * Populates migration cookie with basket payload
 * Server-side only
 *
 * This function is self-contained and handles all checks internally:
 * - Feature flag check (cookie name from env variable)
 * - Response normalization (handles both raw Response and parsed JSON)
 * - Payload extraction and validation
 * - Cookie writing with proper configuration
 *
 * Safe to call unconditionally - it will silently return if feature is disabled
 * or payload is invalid.
 */
export async function populateMigrationCookie(
  req: NextApiRequest,
  res: NextApiResponse,
  basketResponse: Response | BasketResponse | unknown
): Promise<void> {
  const cookieName = process.env.BASKET_MIGRATION_COOKIE_WRITE?.trim() || ''

  // Feature flag check: if cookie name is not configured, skip silently
  if (!cookieName) {
    return
  }

  try {
    // Normalize response - handles both raw Response and parsed JSON
    const normalizedResponse = await normalizeBasketResponse(basketResponse)

    if (!normalizedResponse) {
      return
    }

    // Extract payload from basket response
    const payload = extractBasketPayload(normalizedResponse)

    if (!payload) {
      return
    }

    if (!validateMigrationPayload(payload)) {
      return
    }

    // Serialize payload to JSON
    const cookieValue = JSON.stringify(payload)

    // Set cookie using cookies library
    const cookies = new Cookies(req, res, { secure: COOKIE_SECURE })

    cookies.set(cookieName, cookieValue, {
      domain: COOKIE_DOMAIN,
      maxAge: COOKIE_MAX_AGE,
      path: COOKIE_PATH,
      httpOnly: true,
      sameSite: 'lax',
    })
  } catch (error) {
    // Silently fail - don't break cart operations
    console.error('[basketMigration] Failed to populate migration cookie:', error)
  }
}

/**
 * Parses, validates and deletes migration cookie value
 * Server-side only
 *
 * This function:
 * - Parses JSON from cookie value
 * - Validates payload structure
 * - Atomically deletes cookie (acts as lock)
 *
 * Returns null if payload is invalid.
 * Cookie is deleted even if parsing/validation fails.
 */
function parseAndDeleteMigrationCookie(
  cookieValue: string,
  req: NextApiRequest,
  res: NextApiResponse
): MigrationPayload | null {
  // Parse JSON
  let payload: unknown
  try {
    payload = JSON.parse(cookieValue)
  } catch (parseError) {
    // Invalid JSON - treat as no cookie, but still delete it
    console.error('[basketMigration] Failed to parse migration cookie:', parseError)
    deleteMigrationCookie(req, res)
    return null
  }

  // Validate payload
  if (!validateMigrationPayload(payload)) {
    // Invalid payload - treat as no cookie, but still delete it
    console.error('[basketMigration] Invalid migration cookie payload structure')
    deleteMigrationCookie(req, res)
    return null
  }

  deleteMigrationCookie(req, res)

  return payload
}

/**
 * Consumes migration cookie and returns basket payload ready for SFCC
 * Server-side only
 *
 * This function:
 * 1. Reads migration cookie value
 * 2. Parses and validates payload structure
 * 3. Atomically deletes cookie
 * 4. Converts to SFCC basket format
 *
 * Returns null if:
 * - Cookie name is not configured
 * - Cookie doesn't exist
 * - Payload is invalid
 *
 * The cookie is deleted immediately after successful read, ensuring only one
 * request can successfully consume it
 *
 * Returns null if cookie name is not configured (feature flag check).
 */
export function consumeMigrationCookie(
  req: NextApiRequest,
  res: NextApiResponse
): SfccBasketPayload | null {
  const cookieName = process.env.BASKET_MIGRATION_COOKIE_READ?.trim() || ''

  if (!cookieName) {
    return null
  }

  try {
    const cookies = new Cookies(req, res, { secure: COOKIE_SECURE })

    const cookieValue = cookies.get(cookieName)

    if (!cookieValue) {
      return null
    }

    const migrationPayload = parseAndDeleteMigrationCookie(cookieValue, req, res)

    if (!migrationPayload || migrationPayload.length === 0) {
      // Empty array means no items to migrate - treat as no cookie
      return null
    }

    return convertPayloadToSfccBasket(migrationPayload)
  } catch (error) {
    // Silently fail - treat as no cookie
    console.error('[basketMigration] Failed to consume migration cookie:', error)
    return null
  }
}

export function deleteMigrationCookie(req: NextApiRequest, res: NextApiResponse): void {
  const cookieName = process.env.BASKET_MIGRATION_COOKIE_READ?.trim() || ''

  if (!cookieName) {
    return
  }

  try {
    const cookies = new Cookies(req, res, { secure: COOKIE_SECURE })

    // Delete cookie by setting it with past expiration
    cookies.set(cookieName, '', {
      domain: COOKIE_DOMAIN,
      maxAge: 0,
      path: COOKIE_PATH,
      httpOnly: true,
      sameSite: 'lax',
    })
  } catch (error) {
    // Log but don't throw - cookie deletion failure shouldn't break flow
    console.error('[basketMigration] Failed to delete migration cookie:', error)
  }
}

/**
 * Converts migration payload to SFCC basket format
 * Used when creating basket from migration payload
 */
export function convertPayloadToSfccBasket(payload: MigrationPayload): SfccBasketPayload {
  return {
    product_items: payload.map((item) => ({
      product_id: item.pid,
      quantity: item.qty,
    })),
  }
}
