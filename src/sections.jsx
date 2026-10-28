import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, Compass, Filter, Gem, Heart, Megaphone, PenLine, Plus, TrendingUp, ChartLine } from 'lucide-react'
import { journey, palettes } from './data.js'
import { Reveal } from './ui.jsx'
import { onAnchorClick } from './hooks.js'
import fallbackImg from './assets/mn.jpg'

/* =========================================================
   2. CUSTOMER JOURNEY муруй (зөвхөн hero-н арын чимэглэл)
   ========================================================= */
const W = 1000
const H = 470
const pts = journey.map((_, i) => {
  const t = i / (journey.length - 1)
  return { x: 8 + t * 84, y: 76 - 62 * Math.pow(t, 1.5) }
})

function curve(p) {
  const P = p.map((q) => [q.x * (W / 100), q.y * (H / 100)])
  let d = `M ${P[0][0]} ${P[0][1]}`
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[i - 1] || P[i]
    const p1 = P[i]
    const p2 = P[i + 1]
    const p3 = P[i + 2] || p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return { d, last: P[P.length - 1], first: P[0] }
}
const { d: curveD, last: curveLast, first: curveFirst } = curve(pts)
const areaD = `${curveD} L ${curveLast[0]} ${H} L ${curveFirst[0]} ${H} Z`

/* =========================================================
   3. SERVICE CARDS — bento картууд (дугаарлалтгүй)
   ========================================================= */
const icons = { '01': Compass, '02': Gem, '03': PenLine, '04': Megaphone, '05': TrendingUp, '06': Filter, '07': Heart, '08': ChartLine }

const VStrategy = () => (
  <div className="v v-orbit">
    <div className="o-ring r1"><i /><i /></div>
    <div className="o-ring r2"><i /></div>
    <span className="o-c">STP</span>
  </div>
)

const VBrand = () => (
  <div className="v v-tags">
    <div className="tg">
      {['Naming', 'Logo', 'Story', 'Slogan', 'Identity', 'Brand book', 'Tone'].map((t, i) => (
        <span key={t} style={{ '--i': i }}>{t}</span>
      ))}
    </div>
  </div>
)

const feed = [['Reels', '12.4k үзэлт', 'Hot'], ['Carousel', 'Хадгалалт +38%', 'Шинэ'], ['Story', 'Хариу 214', 'Live'], ['Copy', 'CTR 4.1%', 'A/B']]
const VContent = () => (
  <div className="v v-feed">
    <div className="fd-in">
      {[...feed, ...feed].map(([a, b, c], i) => (
        <div className="fd-r" key={i}>
          <span><b>{a}</b><small>{b}</small></span>
          <em>{c}</em>
        </div>
      ))}
    </div>
  </div>
)

const VCampaign = () => (
  <div className="v v-pulse">
    <i /><i /><i />
    <span className="pc"><Megaphone size={22} /></span>
  </div>
)

const VGrowth = () => (
  <div className="v v-bars">
    <div className="bars">
      {[34, 52, 44, 68, 60, 88, 100].map((h, i) => (
        <i key={i} style={{ '--h': `${h}%`, '--i': i }} />
      ))}
    </div>
    <span className="chip2">ROAS 4.2×</span>
  </div>
)

const VNurture = () => (
  <div className="v v-funnel">
    <div className="fn f1"><span>Lead</span></div>
    <div className="fn f2"><span>Харилцагч</span></div>
    <div className="fn f3"><span>Худалдан авагч</span></div>
    {[0, 1, 2, 3, 4].map((i) => (
      <b key={i} style={{ '--i': i, left: `${22 + i * 14}%` }} />
    ))}
  </div>
)

const VRetention = () => (
  <div className="v v-loyal">
    <div className="stamps">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} style={{ '--i': i }}><Check size={16} strokeWidth={3} /></span>
      ))}
    </div>
    <div className="gift"><Heart size={15} fill="currentColor" /> Үнэнч гишүүн · бэлэг</div>
  </div>
)

const VAnalytics = () => (
  <div className="v v-chart">
    <svg viewBox="0 0 260 150" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="an-f" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#111" stopOpacity="0.14" />
          <stop offset="1" stopColor="#111" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[40, 80, 120].map((y) => <line key={y} x1="8" x2="252" y1={y} y2={y} className="an-g" />)}
      <path className="an-a" d="M8 122 C40 118, 56 96, 86 100 S130 70, 158 62 S210 38, 252 20 L252 150 L8 150 Z" fill="url(#an-f)" />
      <path className="an-l" pathLength="1" d="M8 122 C40 118, 56 96, 86 100 S130 70, 158 62 S210 38, 252 20" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
      <circle className="an-d" cx="252" cy="20" r="5" />
    </svg>
    <span className="chip2 an-p">ROI +32%</span>
  </div>
)

export const visuals = { '01': VStrategy, '02': VBrand, '03': VContent, '04': VCampaign, '05': VGrowth, '06': VNurture, '07': VRetention, '08': VAnalytics }

export function ServiceCards({ services = [], compact = false, onPick }) {
  const [open, setOpen] = useState(-1)

  const parseList = (value) => {
    if (!value) return []

    if (Array.isArray(value)) {
      return value
    }

    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return String(value)
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)
    }
  }

  return (
    <ol className={`sv${compact ? ' sv--sm' : ''}`}>
      {services.map((s, i) => {
        /*
         * DB-ийн service_id:
         * 8  -> 1-р visual
         * 9  -> 2-р visual
         * 10 -> 3-р visual
         * 12 -> 4-р visual
         * 18 -> 5-р visual
         *
         * Тиймээс DB ID биш index ашиглаж байна.
         */
        const visualKey = String(i + 1).padStart(2, '0')
        const V = visuals[visualKey] || VStrategy

        const isOpen = open === i

        const bullets = parseList(s.bullets)
        const serviceKey = s.service_id || i

        return (
          <Reveal
            as="li"
            key={serviceKey}
            delay={(i % 4) * 90}
            onPointerMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect()

              e.currentTarget.style.setProperty(
                '--mx',
                `${e.clientX - r.left}px`
              )

              e.currentTarget.style.setProperty(
                '--my',
                `${e.clientY - r.top}px`
              )
            }}
            className={`sv-c${isOpen ? ' open' : ''}`}
            style={{
              '--d': `${(i % 4) * 90}ms`,
              '--c1': palettes[i % palettes.length][0],
              '--c2': palettes[i % palettes.length][1],
            }}
          >
            <h3 className="sv-t">
              {s.title}
            </h3>

            <p className="sv-d">
              {s.description || s.desc || ''}
            </p>

            <div
              className="sv-vis"
              aria-hidden="true"
            >
              <V />
            </div>

            <button
              type="button"
              className="sv-btn"
              aria-expanded={isOpen}
              aria-controls={`sv-${serviceKey}`}
              onClick={() =>
                setOpen(isOpen ? -1 : i)
              }
            >
              <Plus
                size={18}
                aria-hidden="true"
              />

              <span className="sr">
                {s.title} — дэлгэрэнгүй
              </span>
            </button>

            <div
              className="sv-panel"
              id={`sv-${serviceKey}`}
            >
              <ul>
                {bullets.map((p, index) => (
                  <li key={`${serviceKey}-${index}`}>
                    {p}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className="link u"
                onClick={(e) => {
                  onPick?.(s.title)
                  onAnchorClick(e)
                }}
              >
                {s.cta || 'Зөвлөгөө авах'}
                <ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        )
      })}
    </ol>
  )
}

/* =========================================================
   4. HERO BACKDROP
   ========================================================= */
export function JourneyBackdrop({ light = false }) {
  const c = light ? '#111' : '#fff'
  const P = pts.map((q) => [q.x * (W / 100), q.y * (H / 100)])
  return (
    <div className={`jb${light ? ' jb--light' : ''}`} aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMaxYMax meet" focusable="false">
        <defs>
          <linearGradient id="jb-s" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={c} stopOpacity="0.25" />
            <stop offset="0.75" stopColor={c} stopOpacity="0.9" />
            <stop offset="1" stopColor="#e4572e" />
          </linearGradient>
          <linearGradient id="jb-f" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#e4572e" stopOpacity="0.28" />
            <stop offset="1" stopColor="#e4572e" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} className="jb-grid" />)}
        <path d={areaD} fill="url(#jb-f)" className="jb-area" />
        <path d={curveD} fill="none" stroke="url(#jb-s)" strokeWidth="2.2" strokeLinecap="round" pathLength="1" className="jb-path" />
        {P.map(([x, y], i) => {
          const end = i === P.length - 1
          return (
            <g key={journey[i].t} className={`jb-n${end ? ' end' : ''}`} style={{ '--i': i }}>
              <circle cx={x} cy={y} r={5 + i * 0.9} className="jb-dot" />
              {end && <circle cx={x} cy={y} r={5 + i * 0.9} className="jb-ping" />}
              <text x={x} y={y - 18 - i * 1.2} textAnchor={end ? 'end' : 'middle'} className="jb-t">{journey[i].t}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

/* =========================================================
   5. ABOUT OVERLAY
   ========================================================= */
const ABOUT_IMG = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop'
const pillars = [
  ['Стратеги ба Төлөвлөлт', 'Бизнесийн тань онцлогт тохирсон өсөлтийн урт хугацааны стратеги.'],
  ['Брэнд дүр төрх', 'Хэрэглэгчийн сэтгэлд хоногшихуйц дизайн, өнгө аяс, визуаль шийдэл.'],
  ['Үнэнч хэрэглэгч', 'Нэг удаагийн худалдан авагчийг брэндийг дэмжигч олон нийт болгоно.'],
]

export function AboutOverlay() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (calm || !('IntersectionObserver' in window)) { el.classList.add('in'); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect() } }, { threshold: 0.25 })
    io.observe(el)
    let raf = 0
    const upd = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)))
      el.style.setProperty('--p', p.toFixed(3))
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(upd) }
    upd()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { io.disconnect(); cancelAnimationFrame(raf); window.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [])
  const words = 'Бид зүгээр нэг пост хийдэг агентлаг биш.'.split(' ')
  return (
    <section className="ov" ref={ref} aria-labelledby="ov-h">
      <div className="ov-frame">
        <img
          className="ov-img"
          src={ABOUT_IMG}
          alt="Брэндийн стратегийн талаар ярилцаж буй баг"
          width="2000" height="1333" loading="lazy" decoding="async"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackImg }}
        />
        <div className="ov-shade" aria-hidden="true" />
        <div className="ov-body">
          <h2 id="ov-h" className="ov-h">
            {words.map((w, i) => <span key={i} className="ov-w" style={{ '--w': i }}>{w}&nbsp;</span>)}
          </h2>
          <p className="ov-p">Стратеги, брэнд, контент, кампанит ажил, lead nurturing, хэрэглэгч хадгалалт — маркетингийн бүх замыг нэг системээр хариуцна.</p>
        </div>
        <ul className="ov-cards">
          {pillars.map(([t, d], i) => (
            <li key={t} className="ov-card" style={{ '--k': i }}>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}