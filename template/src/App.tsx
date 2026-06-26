import { useCallback, useEffect, useState } from 'react'
import { CoachHomePage } from './components/homepage/CoachHomePage'
import { NavBrandProvider } from './components/nav/NavBrandContext'
import { NavSearchExposed } from './components/nav/NavSearchExposed'
import { OutletHomePage } from './components/homepage/OutletHomePage'
import { NavV3ImageCollage } from './components/nav/v3/NavV3ImageCollage'
import { NavScrim } from './components/NavScrim'

export default function App() {
  const [activeBrand, setActiveBrand] = useState<'coach' | 'outlet'>('coach')
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen, closeMenu])

  useEffect(() => {
    document.body.classList.toggle('drawerOpened', menuOpen)
    return () => document.body.classList.remove('drawerOpened')
  }, [menuOpen])

  return (
    <NavBrandProvider activeBrand={activeBrand} setActiveBrand={setActiveBrand}>
      <div className="v1-prototype relative flex min-h-[100dvh] w-full min-w-0 flex-col bg-coach-white font-extended">
        <NavSearchExposed
          activeBrand={activeBrand}
          onBrandChange={setActiveBrand}
          bagCount={0}
          alwaysShowBagBadge
          onMenuSearchClick={() => setMenuOpen(true)}
        />

        {activeBrand === 'coach' ? <CoachHomePage /> : <OutletHomePage />}

        <NavScrim open={menuOpen} onClose={closeMenu} />
        <NavV3ImageCollage open={menuOpen} onClose={closeMenu} />
      </div>
    </NavBrandProvider>
  )
}
