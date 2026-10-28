import { useEffect, useRef } from 'react'

const calm = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Makro маягийн: гарчгийн үг бүр бүдэг (blur) байдлаас тодорч дээшээ гарна. */
export function BlurWords({ text, delay = 150 }) {
  const words = text.split(' ')
  return words.map((w, i) => (
    <span className="bw" key={i} style={{ '--w': i, '--o': (1 - (i / words.length) * 0.5).toFixed(2), '--bd': `${delay}ms` }}>
      {w}{i < words.length - 1 ? '\u00A0' : ''}
    </span>
  ))
}

/* Makro-ийн "Trusted by" туузан шиг: хоёр эгнээ эсрэг чиглэлд гүйнэ. */
export function PillRows({ top, bottom }) {
  const row = (items, rev) => (
    <div className={`pr${rev ? ' rev' : ''}`} aria-hidden="true">
      <div className="pr-track">
        {[...items, ...items, ...items, ...items].map((t, i) => (
          <span className="pr-i" key={i}><i />{t}</span>
        ))}
      </div>
    </div>
  )
  return (
    <div className="prs" role="list" aria-label={top?.join(', ')}>
      {top && row(top, false)}
      {bottom && row(bottom, true)}
    </div>
  )
}

/* Scroll хийх тусам үг бүр ээлжлэн асдаг текст. */
export function ScrollWords({ text, className = '' }) {
  const ref = useRef(null)
  const words = text.split(' ')
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const spans = el.querySelectorAll('.sw')
    if (calm()) { spans.forEach((s) => s.classList.add('on')); return }
    let raf = 0
    const upd = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p = Math.min(1, Math.max(0, (vh * 0.88 - r.top) / (vh * 0.42 + r.height)))
      const n = Math.round(p * spans.length * 1.04)
      spans.forEach((s, i) => s.classList.toggle('on', i < n))
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(upd) }
    upd()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); cancelAnimationFrame(raf); window.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [])
  return (
    <p ref={ref} className={`swd ${className}`.trim()}>
      {words.map((w, i) => <span className="sw" key={i}>{w}{i < words.length - 1 ? ' ' : ''}</span>)}
    </p>
  )
}

/* Давхарлан наалдах 3 карт. Карт бүр ТЭР ЧИГЭЭР, өөрийн scroll-ийн явцаар ижил animation хийнэ
   (доороос өргөгдөж, томорч, тодорно) — дарагдах/бараантах эффектгүй тул сүүлийн карт ялгарахгүй. */
export function StackCards({ items = [] }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const cards = [...ref.current.querySelectorAll('.stk-c')]
    if (calm() || cards.length === 0) return
    let raf = 0
    const upd = () => {
      raf = 0
      const vh = window.innerHeight
      cards.forEach((c) => {
        const stick = parseFloat(getComputedStyle(c).top) || 0
        const d = c.getBoundingClientRect().top - stick // наалдах цэг хүртэлх зай
        const e = 1 - Math.min(1, Math.max(0, d / (vh * 0.5)))
        c.style.setProperty('--e', e.toFixed(3))
      })
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(upd) }
    upd()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [items])

  return (
    <ol className="stk" ref={ref}>
      {items.map((it, i) => (
        <li
          className="stk-c"
          key={it.title || i}
          style={{
            '--i': i,
            '--c1': it.c?.[0] || '#f4f5f8',
            '--c2': it.c?.[1] || '#ffffff',
            top: `calc(100px + ${i * 24}px)`,
          }}
        >
          <div className="stk-t">
            {it.title && <h3>{it.title}</h3>}
            {it.text && <p>{it.text}</p>}
          </div>
        </li>
      ))}
    </ol>
  )
}
