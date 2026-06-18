import { atom } from 'jotai'

export type PdpV7EntrancePhase = 'off' | 'hold' | 'play' | 'done'

export const pdpV7EntrancePhaseAtom = atom<PdpV7EntrancePhase>('off')

export const pdpV7SuppressEntranceForPathKeyAtom = atom(null as string | null)

export function isPdpV7SuppressEntranceForPath(pending: string | null, pathKey: string): boolean {
  return pending !== null && pending === pathKey
}

export const clearPdpV7SuppressEntranceIfPathMismatchAtom = atom(
  null,
  (get, set, completedPathKey: string) => {
    const pending = get(pdpV7SuppressEntranceForPathKeyAtom)
    if (pending !== null && !isPdpV7SuppressEntranceForPath(pending, completedPathKey)) {
      set(pdpV7SuppressEntranceForPathKeyAtom, null)
    }
  }
)

export const isPdpV7CharmsSectionInViewAtom = atom<boolean>(false)

export const setIsPdpV7CharmsSectionInViewAtom = atom(null, (_, set, inView: boolean) => {
  set(isPdpV7CharmsSectionInViewAtom, inView)
})
