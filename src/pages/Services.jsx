import { usePageMeta } from '../hooks.js'
import { services } from '../data.js'
import { Reveal } from '../ui.jsx'
import { BlurWords } from '../aboutfx.jsx'
import { ServiceCards } from '../sections.jsx'

export default function Services() {
  usePageMeta('Үйлчилгээ — Brandify by Yuna', 'Маркетингийн стратеги, брэнд хөгжүүлэлт, контент & social media, дижитал сурталчилгаа & growth.')
  return (
    <>
      <section className="hero hero--light svh" aria-labelledby="svh-h">
        <div className="svh-bg" aria-hidden="true">
          <i className="svh-blob b1" /><i className="svh-blob b2" /><i className="svh-blob b3" />
          <span className="svh-num">{String(services.length).padStart(2, '0')}</span>
        </div>
        <div className="container hero-in svh-in">
          <span className="eyebrow"><i aria-hidden="true" />Үйлчилгээ</span>
          <h1 id="svh-h" className="h-hero svh-h">
            <span className="svh-l"><BlurWords text="Бизнесийн тань өсөлтөд" delay={150} /></span>
            <span className="svh-l svh-acc"><BlurWords text="зориулсан цогц шийдэл." delay={600} /></span>
          </h1>
          <Reveal delay={900}>
            <p className="lead">Стратегиас эхлээд дижитал өсөлт хүртэл — хамгийн чухал {services.length} чиглэлийг мэргэжлийн өндөр түвшинд хүргэнэ.</p>
          </Reveal>
          <ol className="svh-idx" aria-label="Үндсэн үйлчилгээ">
            {services.map((s, i) => (
              <li key={s.id} style={{ '--k': i }}>
                <span>{s.n}</span>{s.label}
              </li>
            ))}
          </ol>
        </div>
        <span className="svh-scroll" aria-hidden="true"><i /></span>
      </section>
      <section className="sec sec--off sec--svc">
        <div className="container">
          <ServiceCards />
        </div>
      </section>
    </>
  )
}
