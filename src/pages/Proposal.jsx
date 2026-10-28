import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { AUDIT_OPTION, contact, serviceOptions } from '../data.js'
import { usePageMeta } from '../hooks.js'
import { Field, Lines, Reveal, UbTime } from '../ui.jsx'

const budgets = ['Тохиролцоно', '5,000,000₮-өөс доош', '5,000,000₮ - 10,000,000₮', '10,000,000₮-өөс дээш']

export default function Proposal() {
  usePageMeta('Хамтран ажиллах хүсэлт — Brandify by Yuna', 'Үнэгүй зөвлөгөө эсвэл маркетингийн аудит авахын тулд хүсэлтээ илгээнэ үү.')
  const [params] = useSearchParams()
  const q = params.get('service')
  const initial = q === 'audit' ? AUDIT_OPTION : serviceOptions.includes(q) ? q : serviceOptions[1]
  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '', service: initial, budget: budgets[0], description: '' })
  const [sent, setSent] = useState(false)
  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  const submit = (e) => {
    e.preventDefault()
    console.log('Илгээсэн хүсэлт:', form)
    setSent(true)
  }
  return (
    <section className="hero">
      <div className="container g12 split">
        <div>
          <h1 className="h-hero" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)' }}>
            <Lines lines={['Хамтран ажиллах', 'хүсэлт.']} />
          </h1>
          <Reveal delay={300}>
            <dl className="info">
              <div><dt>Хаяг</dt><dd>{contact.address}</dd><UbTime /></div>
              <div><dt>Утас</dt><dd><a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`} className="u">{contact.phone}</a></dd></div>
              <div><dt>Имэйл</dt><dd><a href={`mailto:${contact.email}`} className="u">{contact.email}</a></dd></div>
            </dl>
          </Reveal>
        </div>
        <Reveal delay={200}>
          {sent ? (
            <div className="sent" role="status">
              <h2>Хүсэлтийг амжилттай илгээлээ!</h2>
              <p className="muted">Бид тантай удахгүй холбогдоно.</p>
            </div>
          ) : (
            <form className="form" onSubmit={submit}>
              <div className="row2">
                <Field label="Нэр" id="name" value={form.name} onChange={change} required autoComplete="name" />
                <Field label="Компани / Брэнд" id="company" value={form.company} onChange={change} autoComplete="organization" />
              </div>
              <div className="row2">
                <Field label="Утас" id="phone" type="tel" value={form.phone} onChange={change} required autoComplete="tel" />
                <Field label="Имэйл" id="email" type="email" value={form.email} onChange={change} required autoComplete="email" />
              </div>
              <div className="row2">
                <Field as="select" label="Үйлчилгээ" id="service" value={form.service} onChange={change}>
                  {serviceOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </Field>
                <Field as="select" label="Төсөв" id="budget" value={form.budget} onChange={change}>
                  {budgets.map((o) => <option key={o} value={o}>{o}</option>)}
                </Field>
              </div>
              <Field as="textarea" label="Төслийн тухай" id="description" rows={3} placeholder="Зорилго, хугацаа, хүлээж буй үр дүнгээ товч бичнэ үү" value={form.description} onChange={change} />
              <button type="submit" className="btn">Хүсэлт илгээх <ArrowRight size={16} aria-hidden="true" /></button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}
