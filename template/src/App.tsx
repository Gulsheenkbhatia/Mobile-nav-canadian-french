import { useCallback, useEffect, useState } from 'react'
import { CoachHomePage } from './components/homepage/CoachHomePage'
import { NavBrandProvider } from './components/nav/NavBrandContext'
import { NavSearchExposed } from './components/nav/NavSearchExposed'
import { NavV3ImageCollage } from './components/nav/v3/NavV3ImageCollage'
import { NavTemplateGallery } from './components/nav/gallery/NavTemplateGallery'
import { NavScrim } from './components/NavScrim'

function useGalleryMode(): boolean {
  const [gallery, setGallery] = useState(
    () => new URLSearchParams(window.location.search).get('gallery') === 'nav',
  )

  useEffect(() => {
    const onPopState = () => {
      setGallery(new URLSearchParams(window.location.search).get('gallery') === 'nav')
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  return gallery
}

export default function App() {
  const galleryMode = useGalleryMode()
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

  if (galleryMode) {
    return <NavTemplateGallery />
  }

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

        <CoachHomePage showSubnav={false} />

        <NavScrim open={menuOpen} onClose={closeMenu} />
        <NavV3ImageCollage open={menuOpen} onClose={closeMenu} />
      </div>
    </NavBrandProvider>
  )
}
