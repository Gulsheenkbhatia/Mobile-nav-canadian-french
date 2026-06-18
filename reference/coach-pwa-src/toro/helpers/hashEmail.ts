import { sha256 } from 'js-sha256'

export function hashEmail(email: string): string {
  return sha256(email.toLowerCase())
}
