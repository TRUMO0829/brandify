import { useEffect, useMemo, useState } from 'react'
import { API_URL } from '../api.js'
import { services as staticServices } from '../data.js'
import { goTo, usePageMeta } from '../hooks.js'
import { Button, Lines, ProjectTile, Reveal, TextLink } from '../ui.jsx'
import { AboutOverlay, ServiceCards } from '../sections.jsx'
import { FlowSection } from '../showcase.jsx'
import { ScrollWords, StackCards } from '../aboutfx.jsx'
import ContactSection from '../components/ContactSection.jsx'
import storyImg from '../assets/logo.jpg'

const values = [
  {
    title: 'Бидний үнэт зүйл',
    text: 'Бизнесийг дэмжих бүх төрлийн үйлчилгээг хамгийн сайнаар нийгэмд түгээн дэлгэрүүлж, амжилттай өсөлтийг үзүүлэх.',
    c: ['#a9b8d0', '#f5f6fa'],
  },
  {
    title: 'Ямар хүмүүст хэрэгтэй вэ?',
    text: 'Цахим нэрийн хуудсаа шинэчлэх хүсэлтэй бизнесүүд болон дижитал маркетингаар борлуулалтаа өсгөх сонирхолтой хүмүүст зориулсан.',
    c: ['#f4f5f8', '#f3d3cf'],
  },
  {
    title: 'Хамтран ажиллах',
    text: 'Манай чадварлаг хамт олонтой нэгдэж, дижитал орчинд амжилттай ажиллаж, бизнесээ өргөжүүлэхийг хүсвэл яг одоо бидэнтэй нэгдээрэй.',
    c: ['#d3e4dc', '#f6f9f7'],
  },
]

/* API унавал data.js доторх үйлчилгээний тайлбарыг үзүүлнэ (service_id байхгүй тул форм илгээгдэхгүй). */
const fallbackServices = staticServices.map((s) => ({
  title: s.title,
  description: s.desc,
  bullets: s.points,
  cta: s.cta,
}))

async function getJson(path) {
  const response = await fetch(`${API_URL}${path}`)
  if (!response.ok) throw new Error(`${path}: ${response.status}`)
  return response.json()
}

export default function Home() {
  usePageMeta(
    'Brandify by Yuna — Маркетингийн стратегийн түнш',
    'Танихгүй хүнийг үнэнч хэрэглэгч болгох маркетингийн систем: стратеги, брэнд, контент, кампанит ажил, lead nurturing, retention.',
  )

  /* ---------- Мэдээлэл ачаалах ---------- */
  const [services, setServices] = useState(null) // null = ачаалж байна
  const [projects, setProjects] = useState(null)
  const [projectsError, setProjectsError] = useState(false)
  const [active, setActive] = useState('Бүгд')
  const [picked, setPicked] = useState(null)

  useEffect(() => {
    let alive = true
    getJson('/services')
      .then((d) => alive && setServices(Array.isArray(d) && d.length ? d : fallbackServices))
      .catch(() => alive && setServices(fallbackServices))
    getJson('/portfolio')
      .then((d) => alive && setProjects(Array.isArray(d) ? d : []))
      .catch(() => {
        if (!alive) return
        setProjects([])
        setProjectsError(true)
      })
    return () => { alive = false }
  }, [])

  /* Холбоосоор (/#services) орж ирсэн бол тухайн хэсэг рүү шилжинэ */
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id) return
    const t = setTimeout(() => goTo(id, { hash: false, instant: true }), 250)
    return () => clearTimeout(t)
  }, [])

  const categories = useMemo(
    () => ['Бүгд', ...new Set((projects || []).map((p) => p.category).filter(Boolean))],
    [projects],
  )
  const list = useMemo(
    () => (active === 'Бүгд' ? projects || [] : (projects || []).filter((p) => p.category === active)),
    [projects, active],
  )

  return (
    <>
      {/* ───────── 1. НҮҮР ───────── */}
      <section id="home" className="anchor hero hero--light hero--home hero--v2" aria-labelledby="home-h">
        <div className="container hero-in">
          <h1 id="home-h" className="h-hero">
            <Lines lines={['Танихгүй хүнийг', 'үнэнч хэрэглэгч болгоё.']} />
          </h1>
          <Reveal delay={450}>
            <p className="lead">Стратеги, брэнд, өсөлт — нэг системээр.</p>
            <div className="hero-cta">
              <Button href="#contact">Хамтын ажиллагаа</Button>
              <TextLink href="#services">Үйлчилгээ үзэх</TextLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── 1б. МАРКЕТИНГИЙН ЗАМ (scroll-д солигдох самбар) ───────── */}
      <FlowSection />

      {/* ───────── 2. БИДНИЙ ТУХАЙ ───────── */}
      <div id="about" className="anchor">
        <AboutOverlay />

        <section className="sec abs" aria-label="Brandify-ийн түүх">
          <div className="container g12">
            <Reveal className="story-img story-fl">
              <img src={storyImg} alt="Brandify by Yuna" width="1600" height="978" loading="lazy" />
            </Reveal>
            <div className="story-txt">
              <ScrollWords className="big" text="HEY, Brandify by Yuna байна." />
              <ScrollWords text="Бид бизнесийг зүгээр нэг сурталчлах биш, танихгүй хүнийг сонирхогч, сонирхогчийг хэрэглэгч, хэрэглэгчийг үнэнч хэрэглэгч болгох маркетингийн систем бүтээдэг." />
              <ScrollWords text="Стратеги, брэндинг, контент, дижитал маркетинг, борлуулалтын funnel болон хэрэглэгчийн сэжмийн арчилгааг нэгтгэн, таны бизнесийн өсөлтөд бодитойгоор ажиллана." />
              <ScrollWords className="big" text="Таны брэндийн дараагийн өсөлт эндээс эхэлнэ." />
            </div>
          </div>
        </section>

        <section className="sec" aria-label="Үнэт зүйл ба хамтын ажиллагаа">
          <div className="container">
            <Reveal className="cta-row mb-8">
              <TextLink href="#services">Үйлчилгээнүүдтэй танилцах</TextLink>
            </Reveal>
            <StackCards items={values} />
          </div>
        </section>
      </div>

      {/* ───────── 3. ҮЙЛЧИЛГЭЭ ───────── */}
      <section id="services" className="anchor sec sec--off sec--svc-home" aria-labelledby="svc-h">
        <div className="container">
          <Reveal className="shead">
            <div>
              <h2 id="svc-h" className="h-xl">Бизнесийн тань өсөлтөд зориулсан цогц шийдэл.</h2>
              <p className="lead">Стратегиас эхлээд дижитал өсөлт хүртэл — хамгийн чухал чиглэлүүдийг мэргэжлийн өндөр түвшинд хүргэнэ.</p>
            </div>
          </Reveal>

          {services === null ? (
            <p className="lead" role="status">Үйлчилгээний мэдээлэл ачааллаж байна...</p>
          ) : (
            <ServiceCards services={services} onPick={(title) => setPicked({ title, at: Date.now() })} />
          )}
        </div>
      </section>

      {/* ───────── 4. ГҮЙЦЭТГЭСЭН АЖИЛ (төслүүд) ───────── */}
      <section id="portfolio" className="anchor sec sec--works" aria-labelledby="work-h">
        <div className="container">
          <Reveal className="shead">
            <div>
              <h2 id="work-h" className="h-xl">Гүйцэтгэсэн амжилттай төслүүд.</h2>
              <p className="lead">Бизнесийн үнэ цэнийг өсгөж, зах зээлд өнгө нэмсэн бүтээлч ажил болон стратегийн шийдлүүдтэй танилцаарай.</p>
            </div>
          </Reveal>

          {projects === null && <p className="lead" role="status">Гүйцэтгэсэн ажлуудыг ачааллаж байна...</p>}
          {projectsError && <p className="lead" role="alert">Гүйцэтгэсэн ажлын мэдээлэл ачааллахад алдаа гарлаа.</p>}

          {projects !== null && projects.length > 0 && (
            <div className="tabs" role="group" aria-label="Төслийн ангилал">
              {categories.map((c) => (
                <button key={c} type="button" className="tab" aria-pressed={active === c} onClick={() => setActive(c)}>
                  {c}
                </button>
              ))}
            </div>
          )}

          {projects !== null && !projectsError && projects.length === 0 && (
            <p className="lead">Одоогоор төсөл нэмэгдээгүй байна.</p>
          )}

          {list.length > 0 && (
            <ol className="wk-grid">
              {list.map((p, i) => (
                <li key={`${active}-${p.portfolio_id ?? i}`}>
                  <ProjectTile p={{ ...p, id: p.portfolio_id, desc: p.description }} i={i} />
                </li>
              ))}
            </ol>
          )}
        </div>

      </section>

      {/* ───────── 5. ХОЛБОО БАРИХ ───────── */}
      <ContactSection services={services || []} preset={picked} />
    </>
  )
}
