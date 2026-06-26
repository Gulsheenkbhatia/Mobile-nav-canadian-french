import { createContext, useContext, type ReactNode } from 'react'
import type { BrandId } from './NavSearchExposed'

type NavBrandContextValue = {
  activeBrand: BrandId
  setActiveBrand: (brand: BrandId) => void
}

const NavBrandContext = createContext<NavBrandContextValue | null>(null)

export function NavBrandProvider({
  activeBrand,
  setActiveBrand,
  children,
}: NavBrandContextValue & { children: ReactNode }) {
  return (
    <NavBrandContext.Provider value={{ activeBrand, setActiveBrand }}>
      {children}
    </NavBrandContext.Provider>
  )
}

export function useNavBrand() {
  const ctx = useContext(NavBrandContext)
  if (!ctx) {
    throw new Error('useNavBrand must be used within NavBrandProvider')
  }
  return ctx
}
