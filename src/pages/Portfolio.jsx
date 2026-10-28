import { useState } from 'react'
import { categories, projects } from '../data.js'
import { usePageMeta } from '../hooks.js'
import { BlurWords } from '../aboutfx.jsx'
import { ProjectTile, Reveal } from '../ui.jsx'

export default function Portfolio() {
  usePageMeta('Гүйцэтгэсэн ажил — Brandify by Yuna', 'Брэндинг, дижитал маркетинг, контент болон кампанит ажлын гүйцэтгэсэн төслүүд.')
  const [active, setActive] = useState('Бүгд')
  const list = active === 'Бүгд' ? projects : projects.filter((p) => p.category === active)

  return (
    <>
      <section className="hero hero--light svh" aria-labelledby="svh-h">
        <div className="svh-bg" aria-hidden="true">
          <i className="svh-blob b1" /><i className="svh-blob b2" /><i className="svh-blob b3" />
          <span className="svh-num">{String(projects.length).padStart(2, '0')}</span>
        </div>
        <div className="container hero-in svh-in">
          <span className="eyebrow"><i aria-hidden="true" />Төслүүд</span>
          <h1 id="svh-h" className="h-hero svh-h" style={{ maxWidth: '14em' }}>
            <span className="svh-l"><BlurWords text="Гүйцэтгэсэн" delay={150} /></span>
            <span className="svh-l svh-acc"><BlurWords text="амжилттай төслүүд." delay={600} /></span>
          </h1>
          <Reveal delay={900}>
            <p className="lead">Бизнесийн үнэ цэнийг өсгөж, зах зээлд өнгө нэмсэн бүтээлч ажил болон стратегийн шийдлүүдтэй танилцаарай.</p>
          </Reveal>
          <ol className="svh-idx" aria-label="Төслийн ангилал">
            {categories.slice(0, 4).map((c, i) => (
              <li key={c} style={{ '--k': i }}>
                <span>{String(i + 1).padStart(2, '0')}</span>{c}
              </li>
            ))}
          </ol>
        </div>
        <span className="svh-scroll" aria-hidden="true"><i /></span>
      </section>

      <section className="sec sec--tight sec--works">
        <div className="container">
          <div className="tabs" role="group" aria-label="Төслийн ангилал">
            {categories.map((c) => (
              <button key={c} type="button" className="tab" aria-pressed={active === c} onClick={() => setActive(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="wgrid wgrid--3">
          {list.map((p, i) => (
            <ProjectTile key={`${active}-${p.id}`} p={p} i={i} />
          ))}
        </div>
      </section>
    </>
  )
}