import { usePageMeta } from '../hooks.js'
import { Reveal, TextLink } from '../ui.jsx'
import { BlurWords, PillRows, ScrollWords, StackCards } from '../aboutfx.jsx'
import { journey, services } from '../data.js'
import storyImg from '../assets/logo.jpg';
const eq = ['STRATEGY', 'BRAND', 'CONTENT', 'CAMPAIGN', 'ACQUISITION', 'LEAD NURTURING', 'CONVERSION', 'RETENTION']

const values = [
  { label: 'Үнэт зүйл', title: 'Бидний үнэт зүйл', text: 'Бизнесийг дэмжих бүх төрлийн үйлчилгээг хамгийн сайнаар нийгэмд түгээн дэлгэрүүлж, амжилттай өсөлтийг үзүүлэх.', visual: '01', c: ['#a9b8d0', '#f5f6fa'] },
  { label: 'Хэнд', title: 'Ямар хүмүүст хэрэгтэй вэ?', text: 'Цахим нэрийн хуудсаа шинэчлэх хүсэлтэй бизнесүүд болон дижитал маркетингаар борлуулалтаа өсгөх сонирхолтой хүмүүст зориулсан.', visual: '03', c: ['#f4f5f8', '#f3d3cf'] },
  { label: 'Хамтрах', title: 'Хамтран ажиллах', text: 'Манай чадварлаг хамт олонтой нэгдэж, дижитал орчинд амжилттай ажиллаж, бизнесээ өргөжүүлэхийг хүсвэл яг одоо бидэнтэй нэгдээрэй.', visual: '04', c: ['#d3e4dc', '#f6f9f7'] },
]

export default function About() {
  usePageMeta('Бидний тухай — Brandify by Yuna', 'Brandify by Yuna бол стратеги, брэнд, контент, кампанит ажил, lead nurturing, conversion, retention-ийг нэгтгэсэн маркетингийн түнш.')
  return (
    <>
      <section className="hero hero--light abh" aria-label="Hero хэсэг">
        <div className="abh-bg" aria-hidden="true"><i className="svh-blob b1" /><i className="svh-blob b2" /></div>
        <div className="container hero-in">
          <span className="eyebrow"><i aria-hidden="true" />Brandify by Yuna</span>
          <h1 className="h-hero" style={{ maxWidth: '12em' }}>
            <BlurWords text="Бид зүгээр нэг пост хийдэг агентлаг биш." />
          </h1>
          <Reveal delay={900}>
            <p className="lead">Brandify, by Yuna — маркетингийн бүх замыг нэг системээр хардаг стратегийн түнш.</p>
          </Reveal>
          <ul className="abh-stats">
            {[[journey.length, 'алхамтай хэрэглэгчийн зам'], [services.length, 'үндсэн үйлчилгээ'], ['1', 'нэг цогц систем']].map(([n, t], i) => (
              <Reveal as="li" key={t} delay={1000 + i * 120}>
                <b>{n}</b><span>{t}</span>
              </Reveal>
            ))}
          </ul>
        </div>
        <div className="abh-pills"><PillRows top={eq} /></div>
      </section>

      <section className="sec abs" aria-label="Brandify-ийн түүх">
        <div className="container g12">
          <Reveal className="story-img story-fl">
            <img src={storyImg} alt="Brandify by Yuna" width="1600" height="978" loading="lazy" />
            <span className="story-chip"><i aria-hidden="true" />Brandify by Yuna</span>
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
          <StackCards items={values} />
          <Reveal className="cta-row">
            <TextLink to="/services">Үйлчилгээнүүдтэй танилцах</TextLink>
          </Reveal>
        </div>
      </section>
    </>
  )
}
