import { useState } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { contact, serviceOptions } from '../data.js'
import { usePageMeta } from '../hooks.js'
import { Field, Lines, Reveal, UbTime } from '../ui.jsx'

const empty = { name: '', company: '', contact: '', service: serviceOptions[1], message: '' }

export default function Contact() {
  usePageMeta('Холбоо барих — Brandify by Yuna', 'Маркетингийн зөвлөгөө авахыг хүсвэл Brandify by Yuna-тай холбогдоорой.')
  const [form, setForm] = useState(empty)
  const [sent, setSent] = useState(false)
  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  const submit = (e) => {
    e.preventDefault()
    console.log('Илгээсэн мессеж:', form)
    setSent(true)
    setForm(empty)
  }

  return (
    <section className="sec">
      <div className="container g12 split">
        {/* Зүүн талын гарчиг болон мэдээлэл */}
        <div>
          <span className="label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
            <Sparkles size={14} aria-hidden="true" style={{ color: 'var(--accent)' }} />
            Хамтран ажиллах
          </span>

          <h1 className="h-xl" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)' }}>
            <Lines lines={['Ярилцаж', 'үзье.']} />
          </h1>

          <Reveal delay={300}>
            <p className="lead" style={{ marginTop: '24px' }}>
              Шинэ санаа, төслийн хамтын ажиллагааны талаар ярилцахад бид үргэлж нээлттэй байна.
            </p>
            <dl className="info">
              <div>
                <dt>Хаяг</dt>
                <dd>{contact.address}</dd>
                <div className="ubt">
                  <i></i>
                  <UbTime />
                </div>
              </div>
              <div>
                <dt>Утас</dt>
                <dd>
                  <a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`} className="u">{contact.phone}</a>
                </dd>
              </div>
              <div>
                <dt>Имэйл</dt>
                <dd>
                  <a href={`mailto:${contact.email}`} className="u">{contact.email}</a>
                </dd>
              </div>
              <div>
                <dt>Сошиал сувгууд</dt>
                <dd className="soc">
                  {contact.social.map((s) => (
                    <a key={s.label} href={s.href} className="u">{s.label}</a>
                  ))}
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>

        {/* Баруун талын форм хэсэг */}
        <Reveal delay={200}>
          <div className="sec--off" style={{ padding: 'clamp(28px, 4vw, 40px)', borderRadius: '16px', border: '1px solid var(--line)' }}>
            {sent ? (
              <div className="sent" role="status">
                <h2>Таны зурвасыг амжилттай хүлээн авлаа!</h2>
                <p className="muted">Бид тантай удахгүй холбогдоно.</p>
              </div>
            ) : (
              <form className="form" onSubmit={submit}>
                <div className="row2">
                  <div className="fld">
                    <Field label="Нэр" id="name" value={form.name} onChange={change} required autoComplete="name" />
                  </div>
                  <div className="fld">
                    <Field label="Компанийн нэр" id="company" value={form.company} onChange={change} autoComplete="organization" />
                  </div>
                </div>
                <div className="fld">
                  <Field label="Утас / Email" id="contact" value={form.contact} onChange={change} required autoComplete="email" />
                </div>
                <div className="fld">
                  <Field as="select" label="Танд ямар үйлчилгээ хэрэгтэй вэ?" id="service" value={form.service} onChange={change}>
                    {(serviceOptions.options || serviceOptions).map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </Field>
                </div>
                <div className="fld">
                  <Field as="textarea" label="Таны зорилго / асуудал" id="message" rows={4} value={form.message} onChange={change} />
                </div>
                <button type="submit" className="btn">
                  Зөвлөгөө авах <ArrowRight size={16} aria-hidden="true" />
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}