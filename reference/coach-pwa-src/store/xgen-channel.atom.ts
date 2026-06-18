import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { STORAGE_XGEN_CHANNEL } from 'toro/constants/storageIds'

export const xgenChannelAtom = atomWithStorage<string | null>(
  STORAGE_XGEN_CHANNEL,
  null,
  createJSONStorage<string | null>(() => sessionStorage)
)
