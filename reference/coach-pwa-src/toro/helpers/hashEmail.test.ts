import { sha256 } from 'js-sha256'
import { hashEmail } from './hashEmail'

describe('hashEmail', () => {
  it('returns the SHA-256 hash of the lowercased email', () => {
    expect(hashEmail('user@example.com')).toBe(sha256('user@example.com'))
  })

  it('is case-insensitive — same hash regardless of capitalisation', () => {
    expect(hashEmail('USER@EXAMPLE.COM')).toBe(hashEmail('user@example.com'))
    expect(hashEmail('User@Example.Com')).toBe(hashEmail('user@example.com'))
  })

  it('produces different hashes for different email addresses', () => {
    expect(hashEmail('a@example.com')).not.toBe(hashEmail('b@example.com'))
  })

  it('returns a 64-character lowercase hex string (SHA-256 output)', () => {
    expect(hashEmail('test@test.com')).toMatch(/^[a-f0-9]{64}$/)
  })
})
