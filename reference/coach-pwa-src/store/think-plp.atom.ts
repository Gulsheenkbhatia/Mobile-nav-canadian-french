import { atom } from 'jotai'

export type ThinkTemplateHeaderConfig = {
  mobile?: {
    active: {
      backgroundColor: string
      textColor: string
    }
    inActive: {
      backgroundColor: string
      textColor: string
    }
  }
  enableTransparentHeader?: boolean
}

export type ThinkPLPData = {
  isThinkPage: boolean
  PLPTabColor: ThinkTemplateHeaderConfig | null
  enableTransparentHeader: boolean
}

export const thinkPLPAtom = atom<ThinkPLPData>({
  isThinkPage: false,
  PLPTabColor: null,
  enableTransparentHeader: false,
})
