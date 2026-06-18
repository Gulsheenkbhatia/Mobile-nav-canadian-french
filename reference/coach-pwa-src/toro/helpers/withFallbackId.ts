import { NextApiRequest, NextApiResponse } from 'next'

const SECONDARY_CALL_HEADER_NAME = 'x-error-reason'

export const deriveFallbackId = (slug: string[] = []) => {
  if (!Array.isArray(slug) || slug.length < 3) {
    return ''
  }
  return slug.slice(-2).join('/').replace('.html', '')
}

export default function withFallbackId(
  req: NextApiRequest,
  res: NextApiResponse,
  handler: (req: NextApiRequest, id: string, ...rest: any[]) => Promise<any>
) {
  const { slug } = req.query
  const fallbackId = deriveFallbackId(slug as string[])
  return async (id: string, ...rest: any[]) => {
    if (!fallbackId) return await handler(req, id, ...rest)
    try {
      const result = await handler(req, id, ...rest)
      return result
    } catch {
      res.setHeader(
        SECONDARY_CALL_HEADER_NAME,
        `Failed to get response for Product id of ${id}. Proceeding with ${fallbackId}`
      )
      return await handler(req, fallbackId, ...rest)
    }
  }
}
