import { atom } from 'jotai'

interface GlobalSlotData {
  [key: string]: {
    styles?: string
    content?: string
    items?: string[]
    [key: string]: any
  }
}

export const globalSlotDataAtom = atom<GlobalSlotData>({})
