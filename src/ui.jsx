import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowDownRight, Plus } from 'lucide-react'
import { services, journey, palettes } from './data.js'
import { onAnchorClick, useUbTime } from './hooks.js'
import { FILES_URL } from './api.js'

/* Үйлчилгээний картын хулганын дагадаг гэрэлтэлт (spotlight) — бусад картад мөн ашиглана */
export function spot(e) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) return el.classList.add('in')
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.classList.add('in')
        io.disconnect()
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag ref={ref} className={`rv ${className}`.trim()} style={{ '--d': `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  )
}

export function Button({ to, href, light, small, children }) {
  const cls = `btn${light ? ' btn--light' : ''}${small ? ' btn--sm' : ''}`
  if (href) {
    return (
      <a href={href} className={cls} onClick={onAnchorClick}>
        {children}
        <ArrowRight size={16} aria-hidden="true" />
      </a>
    )
  }
  return (
    <Link to={to} className={cls}>
      {children}
      <ArrowRight size={16} aria-hidden="true" />
    </Link>
  )
}

export function TextLink({ to, href, children }) {
  if (href) {
    return (
      <a href={href} className="link u" onClick={onAnchorClick}>
        {children}
        <ArrowRight size={15} aria-hidden="true" />
      </a>
    )
  }
  return (
    <Link to={to} className="link u">
      {children}
      <ArrowRight size={15} aria-hidden="true" />
    </Link>
  )
}

export function Lines({ lines }) {
  return lines.map((l, i) => (
    <span className="ln" key={i}>
      <span style={{ '--i': i }}>{l}</span>
    </span>
  ))
}

export function Field({ label, id, as: Tag = 'input', children, ...p }) {
  return (
    <div className="fld">
      <label htmlFor={id}>{label}</label>
      <Tag id={id} name={id} {...p}>{children}</Tag>
    </div>
  )
}

export function UbTime() {
  const t = useUbTime()
  return (
    <span className="ubt">
      <i aria-hidden="true" />
      Улаанбаатар цаг {t}
    </span>
  )
}

export function ServiceList() {
  const [open, setOpen] = useState(-1)
  return (
    <ol className="svcs">
      {services.map((s, i) => (
        <Reveal as="li" key={s.id} className={`svc${open === i ? ' open' : ''}`}>
          <h3 className="svc-h">
            <button type="button" className="svc-head" aria-expanded={open === i} aria-controls={`svc-${s.id}`} onClick={() => setOpen(open === i ? -1 : i)}>
              <span className="svc-t">
                <span className="svc-l">{s.label}</span>
                <span className="svc-title">{s.title}</span>
              </span>
              <span className="svc-d">{s.desc}</span>
              <Plus className="svc-i" size={22} aria-hidden="true" />
            </button>
          </h3>
          <div className="svc-more" id={`svc-${s.id}`}>
            <div>
              <ul>
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <TextLink href="#contact">{s.cta}</TextLink>
            </div>
          </div>
        </Reveal>
      ))}
    </ol>
  )
}

export function Journey() {
  const last = journey.length - 1
  return (
    <ol className="jny">
      {journey.map((j, i) => (
        <Reveal as="li" key={j.t} delay={i * 70} style={{ '--i': i, '--d': `${i * 70}ms` }}>
          <span className="jm" aria-hidden="true">
            {i === 0 ? <i /> : i === last ? <i className="end" /> : <ArrowDownRight size={20} />}
          </span>
          <span className="jt">{j.t}</span>
          <span className="js">{j.s}</span>
        </Reveal>
      ))}
    </ol>
  )
}

export function ProjectRow({ p, i }) {
  const extra = [['Асуудал', p.challenge], ['Шийдэл', p.solution], ['Үр дүн', p.result]].filter(([, v]) => v)
  return (
    <Reveal as="article" className={`prj${i % 2 ? ' flip' : ''}`}>
      <div className="prj-img" data-cursor="Үзэх">
        <img src={p.image} alt={`${p.title} — ${p.category}`} width="1000" height="750" loading="lazy" decoding="async" />
      </div>
      <div className="prj-txt">
        <p className="label">{p.category}</p>
        <h3 className="h-lg">{p.title}</h3>
        <p className="muted">{p.client}</p>
        <p>{p.desc}</p>
        {extra.length > 0 && (
          <dl className="prj-dl">
            {extra.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        )}
        <TextLink href="#contact">Ийм төсөл эхлүүлэх</TextLink>
      </div>
    </Reveal>
  )
}


function getPortfolioImageUrl(image) {
  if (typeof image !== 'string' || !image.trim()) {
    return ''
  }

  const value = image.trim()
  const match = value.match(/^\[.*?\]\((https?:\/\/[^)]+)\)$/)

  const url = (match ? match[1] : value).replace(/\\&/g, '&')

  if (url.startsWith('/uploads/')) {
    return `${FILES_URL}${url}`
  }

  if (/^https?:\/\//i.test(url)) {
    return url
  }

  return ''
}

/* Гүйцэтгэсэн ажлын карт — Үйлчилгээний картын загвартай ижил */
export function ProjectTile({ p, i = 0 }) {
  const [imageError, setImageError] = useState(false)
  const imageUrl = getPortfolioImageUrl(p.image)
  const [c1, c2] = palettes[i % palettes.length]

  return (
    <Reveal
      as="article"
      className="wk skin"
      onPointerMove={spot}
      style={{ '--d': `${(i % 3) * 90}ms`, '--c1': c1, '--c2': c2 }}
    >
      <a
        href="#contact"
        className="wk-a"
        data-cursor="Холбогдох"
        aria-label={`${p.title} — ${p.category}. Ийм төсөл эхлүүлэх`}
        onClick={onAnchorClick}
      >
        {p.category && <span className="wk-chip">{p.category}</span>}
        <strong className="wk-t">{p.title}</strong>
        {p.desc && <span className="wk-d">{p.desc}</span>}

        <span className="wk-img">
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={p.title || ''}
              width="1000"
              height="750"
              loading="lazy"
              decoding="async"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="wk-ph" role="img" aria-label="Зураг ачааллах боломжгүй">Зураг ачааллах боломжгүй</span>
          )}
        </span>

        <span className="wk-go" aria-hidden="true">
          <ArrowRight size={18} />
        </span>
      </a>
    </Reveal>
  )
}
