import { useEffect, useRef } from 'react'
import { Lines } from './ui.jsx'
import statementImg from './assets/fn.jpg'

const calm = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Forsman маягийн жижиг cursor цэг. [data-cursor] дээр томорч шошго харуулна. Зөвхөн хулгана бүхий төхөөрөмж дээр. */
export function Cursor() {
  const dot = useRef(null)
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || calm()) return
    const el = dot.current
    let x = -100, y = -100, cx = x, cy = y, raf
    const move = (e) => {
      x = e.clientX; y = e.clientY
      const t = e.target.closest?.('[data-cursor]')
      el.classList.toggle('big', !!t)
      el.firstChild.textContent = t ? t.dataset.cursor : ''
    }
    const loop = () => {
      cx += (x - cx) * 0.2; cy += (y - cy) * 0.2
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', move, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf) }
  }, [])
  return <div className="cur" ref={dot} aria-hidden="true"><span /></div>
}

/* Monks маягийн scroll-д тэлдэг дугуй. Текст нь дугуйн дотор өнгөө урвуулна. */
export function ScrollCircle() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (calm()) { el.style.setProperty('--p', 1); return }
    let raf
    const upd = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)))
      el.style.setProperty('--p', p.toFixed(3))
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(upd) }
    upd()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [])
  return (
    <section className="circ" ref={ref} aria-labelledby="stmt">
      <div className="circ-stick">
        <i className="circ-dot" aria-hidden="true" />
        <div className="container circ-txt">
          <h2 id="stmt" className="h-hero">
            <Lines lines={['Бид зүгээр нэг', 'пост хийдэг', 'агентлаг биш.']} />
          </h2>
          <p className="circ-p">Стратеги, брэнд, контент, кампанит ажил, lead nurturing, борлуулалт, хэрэглэгч хадгалалт — маркетингийн бүх замыг нэг системээр хариуцна.</p>
        </div>
        <figure className="circ-fig">
          <img src={statementImg} alt="Брэндийн тухай ярилцаж буй баг" width="1003" height="601" loading="lazy" decoding="async" />
          <figcaption><i aria-hidden="true" />Brandify баг</figcaption>
        </figure>
      </div>
    </section>
  )
}
