import { useEffect, useState } from 'react'
import { contact, navLinks } from './data.js'
import { Button } from './ui.jsx'
import { Cursor } from './fx.jsx'
import Wordmark from './components/Wordmark.jsx'
import { onAnchorClick, useActiveSection } from './hooks.js'
import { Outlet } from 'react-router-dom'

const ids = navLinks.map((l) => l.id)

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const active = useActiveSection(ids)

  /* Гүйлгэсэн үед цэс хөвөгч pill болно */
  useEffect(() => {
    let raf = 0
    const run = () => {
      raf = 0
      setScrolled(window.scrollY > 24)
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(run) }
    run()
    window.addEventListener('scroll', on, { passive: true })
    return () => { window.removeEventListener('scroll', on); cancelAnimationFrame(raf) }
  }, [])

  useEffect(() => {
    if (!menu) return
    const esc = (e) => e.key === 'Escape' && setMenu(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [menu])

  const links = (onNavigate) =>
    navLinks.map((l) => (
      <a
        key={l.id}
        href={`#${l.id}`}
        className={`u${active === l.id ? ' active' : ''}`}
        aria-current={active === l.id ? 'location' : undefined}
        onClick={(e) => { onAnchorClick(e); onNavigate?.() }}
      >
        {l.label}
      </a>
    ))

  const closeMenu = () => setMenu(false)

  return (
    <>
      <Cursor />
      <a className="skip" href="#main">Үндсэн агуулга руу шилжих</a>

      <header className={`hdr${scrolled ? ' sc' : ''}`}>
        <div className="container hdr-in">
          <a href="#home" className="logo" aria-label="Brandify by Yuna — нүүр хэсэг" onClick={onAnchorClick}>
            <Wordmark />
          </a>
          <div className="hdr-r">
            <nav className="nav" aria-label="Үндсэн цэс">{links()}</nav>
            <span className="hdr-cta">
              <Button href="#contact" small>Хамтын ажиллагаа</Button>
            </span>
            <button type="button" className="burger" aria-expanded={menu} aria-controls="mnav" onClick={() => setMenu(!menu)}>
              Цэс <i aria-hidden="true" />
            </button>
          </div>
        </div>
        <nav id="mnav" className={`mnav${menu ? ' open' : ''}`} aria-label="Гар утасны цэс">
          {links(closeMenu)}
          <a href="#contact" className="btn" onClick={(e) => { onAnchorClick(e); closeMenu() }}>Хамтын ажиллагаа</a>
        </nav>
      </header>

      <main id="main">
        <Outlet />
      </main>

      <footer className="ftr">
        <div className="container">
          <div className="ftr-grid">
            <div>
              <a href="#home" className="logo" aria-label="Brandify by Yuna" onClick={onAnchorClick}>
                <Wordmark />
              </a>
              <p className="ftr-tag">Таны брэндийн дараагийн өсөлт эндээс эхэлнэ.</p>
            </div>
            <div>
              <h4>Цэс</h4>
              <ul>{navLinks.map((l) => <li key={l.id}><a href={`#${l.id}`} className="u" onClick={onAnchorClick}>{l.label}</a></li>)}</ul>
            </div>
            <div>
              <h4>Холбоо барих</h4>
              <ul>
                <li>{contact.address}</li>
                <li><a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`} className="u">{contact.phone}</a></li>
                <li><a href={`mailto:${contact.email}`} className="u">{contact.email}</a></li>
              </ul>
            </div>
            <div>
              <h4>Сошиал</h4>
              <ul>{contact.social.map((s) => <li key={s.label}><a href={s.href} className="u">{s.label}</a></li>)}</ul>
            </div>
          </div>
          <div className="ftr-base">
            <span>© {new Date().getFullYear()} Brandify by Yuna</span>
            <span>Улаанбаатар, Монгол</span>
          </div>
        </div>
      </footer>
    </>
  )
}
