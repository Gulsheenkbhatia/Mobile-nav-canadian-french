import { useCallback, useState } from 'react'
import { MobileNavFlyout } from './components/MobileNavFlyout'
import { IconBag, IconMenuSearchCombo } from './components/icons'
import './App.css'

export default function App() {
  const [flyoutOpen, setFlyoutOpen] = useState(false)

  const openFlyout = useCallback(() => setFlyoutOpen(true), [])
  const closeFlyout = useCallback(() => setFlyoutOpen(false), [])

  return (
    <div className="app">
      <p className="app__hint">
        Static prototype — no SFCC wiring. Nav data: <code>src/data/coachNavMock.ts</code>. Tokens:{' '}
        <code>src/styles/design-tokens.css</code>. Icons: <code>src/components/icons.tsx</code>.
      </p>

      <div className="phone">
        <header className="demoChrome" aria-label="Global navigation">
          <div className="demoChrome__tabs" role="presentation">
            <span className="demoChrome__tab demoChrome__tab--active">
              <span className="demoChrome__wordmark">COACH</span>
            </span>
            <span className="demoChrome__tab demoChrome__tab--muted">
              <span className="demoChrome__wordmark demoChrome__wordmark--inverse">COACH OUTLET</span>
            </span>
          </div>
          <div className="demoChrome__actions">
            <a href="#bag" className="demoChrome__bagLink" aria-label="Shopping bag, 0 items">
              <IconBag count={0} />
            </a>
            <button
              type="button"
              className="demoChrome__menuSearch"
              aria-label="Open menu and search"
              aria-expanded={flyoutOpen}
              onClick={openFlyout}
            >
              <IconMenuSearchCombo size="lg" />
            </button>
          </div>
        </header>

        <main className="demoHome" aria-label="Homepage">
          <div className="demoHome__hero">
            <p className="demoHome__amp">&COACH</p>
            <h1 className="demoHome__headline">Moments of becoming. Singular yet universally felt.</h1>
            <p className="demoHome__lede">
              Co-created with Gen Z, &amp;Coach explores the moments in between, where confidence is built—not
              after you&apos;ve arrived, but on the way there.
            </p>
            <p className="demoHome__ctas">
              <a className="demoHome__cta" href="#shop-bags">
                Shop Bags
              </a>
              <a className="demoHome__cta" href="#discover">
                Discover &amp;Coach
              </a>
            </p>
          </div>

          <section className="demoHome__cards" aria-label="Featured">
            <article className="demoCard demoCard--product">
              <div className="demoCard__media demoCard__media--bag" role="img" aria-label="Tabby bag (placeholder)" />
              <a className="demoCard__link" href="#tabby">
                Shop Tabby
              </a>
            </article>
            <article className="demoCard demoCard--story">
              <div className="demoCard__media demoCard__media--stage" role="img" aria-label="Campaign (placeholder)">
                <span className="demoCard__pause" aria-hidden>
                  <span className="demoCard__pauseBar" />
                  <span className="demoCard__pauseBar" />
                </span>
                <span className="demoCard__fab" aria-hidden>
                  +
                </span>
              </div>
              <div className="demoCard__storyMeta">
                <p className="demoCard__script">Emotional Support</p>
                <p className="demoCard__serifMark">&COACH</p>
              </div>
            </article>
          </section>
        </main>

        <MobileNavFlyout isOpen={flyoutOpen} onClose={closeFlyout} />
      </div>
    </div>
  )
}
