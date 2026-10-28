import { useEffect, useState } from 'react'

export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title
    let m = document.querySelector('meta[name="description"]')
    if (!m) {
      m = document.createElement('meta')
      m.name = 'description'
      document.head.appendChild(m)
    }
    if (description) m.content = description
  }, [title, description])
}

export function useUbTime() {
  const get = () =>
    new Intl.DateTimeFormat('mn-MN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Ulaanbaatar' }).format(new Date())
  const [t, setT] = useState(get)
  useEffect(() => {
    const id = setInterval(() => setT(get()), 20000)
    return () => clearInterval(id)
  }, [])
  return t
}

/* =========================================================
   One-page навигаци: зөөлөн scroll + идэвхтэй хэсгийг мэдрэх
   ========================================================= */
const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Хэсэг рүү зөөлөн гулсана. "home" нь хуудасны орой. */
export function goTo(id, { hash = true, instant = false } = {}) {
  const el = id === 'home' ? null : document.getElementById(id)
  if (id !== 'home' && !el) return false

  const behavior = instant || reduced() ? 'auto' : 'smooth'
  if (el) el.scrollIntoView({ behavior, block: 'start' })
  else window.scrollTo({ top: 0, behavior })

  if (hash) {
    const url = id === 'home' ? window.location.pathname + window.location.search : `#${id}`
    window.history.replaceState(null, '', url)
  }

  /* Keyboard / screen reader хэрэглэгчийн фокусыг шинэ хэсэгт шилжүүлнэ */
  const target = el || document.getElementById('main')
  if (target) {
    target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  }
  return true
}

/* <a href="#section" onClick={onAnchorClick}> */
export function onAnchorClick(e) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  const href = e.currentTarget.getAttribute('href') || ''
  if (!href.startsWith('#')) return
  if (goTo(href.slice(1) || 'home')) e.preventDefault()
}

/* Дэлгэцийн голд аль хэсэг байгааг (scroll-spy) буцаана. */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])
  const key = ids.join('|')

  useEffect(() => {
    const list = key.split('|')
    const els = list.map((id) => document.getElementById(id)).filter(Boolean)
    if (!els.length || !('IntersectionObserver' in window)) return

    const seen = new Map()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting))
        const current = list.filter((id) => seen.get(id)).pop()
        if (current) setActive(current)
      },
      { rootMargin: '-45% 0px -54% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])

  return active
}
