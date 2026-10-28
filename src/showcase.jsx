import { useEffect, useId, useRef, useState } from 'react'
import { Gift, LayoutGrid, Route, Settings2, Share2, Plus, ChevronDown } from 'lucide-react'
import { Button, Reveal } from './ui.jsx'

const calm = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* =========================================================
   Хяналтын самбарын жишээ (зөвхөн дүрслэл — aria-hidden)
   ========================================================= */

/* Босоо зураасан (hatch) талбайтай муруй */
function Line({ d, area, h = 100 }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className="d-line" viewBox={`0 0 200 ${h}`} preserveAspectRatio="none" focusable="false">
      <defs>
        <pattern id={id} width="3" height="3" patternUnits="userSpaceOnUse">
          <path d="M0 0V3" stroke="#111" strokeOpacity="0.28" strokeWidth="0.7" />
        </pattern>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={d} fill="none" stroke="#111" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

const LINE_A = {
  d: 'M0 62 C20 60, 34 48, 56 62 S92 78, 112 56 S150 30, 172 26 S190 12, 200 10',
  area: 'M0 62 C20 60, 34 48, 56 62 S92 78, 112 56 S150 30, 172 26 S190 12, 200 10 L200 100 L0 100 Z',
}
const LINE_B = {
  d: 'M0 70 C24 70, 40 52, 64 56 S100 66, 124 44 S168 14, 200 12',
  area: 'M0 70 C24 70, 40 52, 64 56 S100 66, 124 44 S168 14, 200 12 L200 100 L0 100 Z',
}

const Head = ({ title, sub, pick }) => (
  <div className="d-head">
    <div>
      <b className="d-title">{title}</b>
      <span className="d-sub"><i />{sub}</span>
    </div>
    <div className="d-tools">
      <span className="d-pick">{pick}<ChevronDown size={11} /></span>
      <span className="d-ic"><Share2 size={11} /></span>
      <span className="d-ic d-ic--k"><Plus size={12} /></span>
    </div>
  </div>
)

const Kpi = ({ label, note, value, unit }) => (
  <div className="d-card d-kpi">
    <span className="d-lbl">{label}<em>+{(label.length % 7) + 3}%</em></span>
    <small>{note}</small>
    <b className="d-num">{value}<span>{unit}</span></b>
  </div>
)

const Channels = ({ rows }) => (
  <div className="d-card d-src">
    <span className="d-lbl">Сувгууд<em className="k">Q4 2026</em></span>
    <small>Хамрах хүрээ</small>
    <div className="d-seg">
      {rows.map(([, v, c]) => <i key={c} style={{ flex: v, background: c }} />)}
    </div>
    <ul>
      {rows.map(([n, v, c]) => <li key={n}><i style={{ background: c }} />{n}<span>{v}%</span></li>)}
    </ul>
  </div>
)

const CH = [['Facebook', 42, '#7d86c9'], ['Instagram', 28, '#6aa3d8'], ['Google', 18, '#9bc77a'], ['Бусад', 12, '#e3b25c']]

/* 1 · Хэрэглэгчийн зам */
const ScreenJourney = () => (
  <>
    <Head title="Хэрэглэгчийн зам" sub="Бүх шат нэг дор харагдаж байна" pick="Бүх суваг" />
    <div className="d-grid d-grid--4">
      <Kpi label="Lead" note="Шинэ сонирхогч" value={91} unit="%" />
      <Kpi label="Хариу" note="Эхний 24 цаг" value={7.2} unit="цаг" />
      <Kpi label="Хөрвөлт" note="Lead → худалдан авагч" value={88} unit="%" />
      <Kpi label="Retention" note="Үнэнч хэрэглэгч" value={94} unit="%" />
    </div>
    <div className="d-grid d-grid--2">
      <div className="d-card d-big">
        <span className="d-lbl">Шинэ хэрэглэгч<em className="k">+21%</em></span>
        <b className="d-num d-num--l">4,860</b>
        <Line {...LINE_A} />
      </div>
      <div className="d-col">
        <div className="d-grid d-grid--2s">
          <Kpi label="ROAS" note="Зар → борлуулалт" value={4.2} unit="×" />
          <Kpi label="CTR" note="Дундаж" value={89} unit="%" />
        </div>
        <Channels rows={CH} />
      </div>
    </div>
  </>
)

/* 2 · Кампанит ажил */
const MONTHS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
const BARS = [30, 22, 34, 38, 50, 33, 62, 46, 58, 80, 66, 100]
const ScreenCampaign = () => (
  <>
    <Head title="Кампанит ажил" sub="Сүүлийн 12 сарын ахиц" pick="2026 он" />
    <div className="d-card d-bars">
      <span className="d-lbl">Жилийн өсөлт<em className="k">+24%</em></span>
      <div className="d-bar-row">
        {BARS.map((h, i) => <i key={i} style={{ height: `${h}%` }}><u>{MONTHS[i]}</u></i>)}
      </div>
    </div>
    <div className="d-grid d-grid--2">
      <div className="d-card d-big">
        <span className="d-lbl">Орлого<em className="k">+16%</em></span>
        <b className="d-num d-num--l">₮8.5 сая</b>
        <Line {...LINE_B} />
      </div>
      <Channels rows={CH} />
    </div>
  </>
)

/* 3 · Хэрэглэгч хадгалалт */
const ScreenLoyal = () => (
  <>
    <Head title="Хэрэглэгч хадгалалт" sub="Дараагийн 30 хоногийн таамаг" pick="30 хоног" />
    <div className="d-grid d-grid--2 d-grid--wide">
      <div className="d-card d-big">
        <span className="d-lbl">Давтан худалдан авалт<em className="k">+18%</em></span>
        <b className="d-num d-num--l">27,500</b>
        <Line {...LINE_A} />
        <div className="d-foot">
          <span><small>Оргил</small>16:30</span>
          <span><small>Дундаж</small>7,200</span>
          <span><small>Сэргээсэн</small>1,380</span>
        </div>
      </div>
      <div className="d-col">
        <div className="d-grid d-grid--2s">
          <Kpi label="Үнэнч" note="Идэвхтэй гишүүн" value={82} unit="%" />
          <Kpi label="Эргэн ирэлт" note="Бэлэг идэвхжүүлсэн" value={96} unit="%" />
        </div>
        <Channels rows={CH} />
      </div>
    </div>
  </>
)

const SCREENS = [ScreenJourney, ScreenCampaign, ScreenLoyal]
const NAV = [LayoutGrid, Route, Gift]

function Dash({ index = 0, stacked = false }) {
  return (
    <div className="dash" aria-hidden="true">
      <aside className="dash-side">
        <i className="dash-logo" />
        {NAV.map((Ic, i) => (
          <span key={i} className={`dash-n${i === (stacked ? [0, 1, 2][index] : 0) ? ' on' : ''}`}><Ic size={13} /></span>
        ))}
        <span className="dash-set"><Settings2 size={13} /></span>
      </aside>
      <div className="dash-main">
        {stacked ? (
          <div className="dash-rail" style={{ '--n': SCREENS.length, '--k': index }}>
            {SCREENS.map((S, i) => <div className="dash-pane" key={i}><S /></div>)}
          </div>
        ) : (
          <div className="dash-pane"><ScreenJourney /></div>
        )}
      </div>
    </div>
  )
}

/* =========================================================
   1. Нүүр хэсгийн градиент хүрээтэй самбар
   ========================================================= */
export function HeroShowcase() {
  return (
    <figure className="fr fr--hero" role="img" aria-label="Brandify-ийн маркетингийн хяналтын самбарын жишээ">
      <Dash />
    </figure>
  )
}

/* =========================================================
   2. Scroll-д наалдаж, самбарын дэлгэц солигддог хэсэг
   ========================================================= */
const FLOW = [
  ['Хяналт', 'Lead-ээс худалдан авагч хүртэлх бүх шатыг нэг дэлгэцээс харна.'],
  ['Кампанит ажил', 'Аль суваг ямар үр дүн өгснийг сар бүрээр хэмжинэ.'],
  ['Хадгалалт', 'Давтан худалдан авалт, бэлэг, үнэнч гишүүдийг автоматаар арчилна.'],
]

export function FlowSection() {
  const ref = useRef(null)
  const [idx, setIdx] = useState(0)
  const [pinned, setPinned] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const mq = window.matchMedia('(min-width: 901px)')
    let raf = 0
    const upd = () => {
      raf = 0
      const on = mq.matches && !calm()
      setPinned(on)
      if (!on) return
      const r = el.getBoundingClientRect()
      const total = r.height - window.innerHeight
      const p = total > 0 ? Math.min(0.999, Math.max(0, -r.top / total)) : 0
      setIdx(Math.floor(p * FLOW.length))
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(upd) }
    upd()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
    }
  }, [])

  return (
    <section className={`flow${pinned ? ' flow--pin' : ''}`} ref={ref} aria-labelledby="flow-h">
      <div className="flow-stick">
        <div className="container flow-in">
          <div className="flow-copy">
            <Reveal>
              <h2 id="flow-h" className="h-xl">Маркетингийн бүх замыг нэг дор хянаарай.</h2>
            </Reveal>
            <ul className="flow-list">
              {FLOW.map(([t, d], i) => (
                <li key={t} className={i === idx ? 'on' : ''}>
                  <button type="button" onClick={() => setIdx(i)} aria-pressed={i === idx}>
                    <b>{t}</b>
                    <span>{d}</span>
                  </button>
                </li>
              ))}
            </ul>
            <Button href="#contact">Хамтын ажиллагаа</Button>
          </div>

          <figure className="fr fr--flow" role="img" aria-label={`Хяналтын самбар: ${FLOW[idx][0]}`}>
            <Dash index={idx} stacked />
          </figure>
        </div>
      </div>
    </section>
  )
}
