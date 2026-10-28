import { useEffect, useState } from 'react'
import { ArrowRight, Check, Mail, MapPin, Phone } from 'lucide-react'
import { API_URL } from '../api.js'
import { contact } from '../data.js'
import { Field, Reveal, UbTime, spot } from '../ui.jsx'

const empty = { name: '', company: '', phone: '', email: '', service: '', message: '', website: '' }

/* Нэг хуудасны төгсгөлийн "Холбоо барих" хэсэг: мэдээлэл + хүсэлтийн форм */
export default function ContactSection({ services = [], preset = null }) {
  const [form, setForm] = useState({ ...empty })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  /* Үйлчилгээний картын "Зөвлөгөө авах" товчоор сонгосон үйлчилгээг форм дээр урьдчилан сонгоно */
  useEffect(() => {
    if (preset?.title) setForm((f) => ({ ...f, service: preset.title }))
  }, [preset])

  const service = form.service || services[0]?.title || ''

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    const selected = services.find((s) => s.title === service)
    if (!selected?.service_id) {
      setError('Үйлчилгээний мэдээлэл ачаалагдаагүй байна. Хуудсаа шинэчлээд дахин оролдоно уу.')
      return
    }

    setSending(true)
    try {
      const response = await fetch(`${API_URL}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: Number(selected.service_id),
          customer_name: form.name.trim(),
          customer_phone: form.phone.trim(),
          customer_email: form.email.trim(),
          company: form.company.trim(),
          message: form.message.trim(),
          website: form.website, // honeypot
        }),
      })
      const data = await response.json().catch(() => null)

      if (response.status === 429) throw new Error('Хэт олон хүсэлт илгээлээ. Түр хүлээгээд дахин оролдоно уу.')
      if (!response.ok) throw new Error(data?.error || 'Хүсэлт илгээхэд алдаа гарлаа.')

      setSent(true)
      setForm({ ...empty })
    } catch (err) {
      setError(err instanceof TypeError ? 'Сервертэй холбогдож чадсангүй. Дахин оролдоно уу.' : err.message)
    } finally {
      setSending(false)
    }
  }

  const tel = `tel:${contact.phone.replace(/[^+\d]/g, '')}`

  return (
    <section id="contact" className="anchor ct sec--off" aria-labelledby="ct-h">
      <div className="container ct-in">
        <div className="ct-copy">
          <Reveal>
            <h2 id="ct-h" className="h-xl">Таны маркетинг хаана гацаж байна вэ?</h2>
            <p className="lead">Мэдээллээ үлдээгээрэй — бид тантай холбогдож, дараагийн алхмыг хамт тодорхойлно.</p>
          </Reveal>

          <Reveal delay={120}>
            <ul className="ct-info">
              <li className="skin" onPointerMove={spot} style={{ '--c1': '#f4f5f8', '--c2': '#cdd6ea' }}>
                <span className="ct-ic" aria-hidden="true"><MapPin size={18} /></span>
                <span>
                  <small>Хаяг</small>
                  {contact.address}
                  <UbTime />
                </span>
              </li>
              <li className="skin" onPointerMove={spot} style={{ '--c1': '#f4f5f8', '--c2': '#f3d3cf' }}>
                <span className="ct-ic" aria-hidden="true"><Phone size={18} /></span>
                <span>
                  <small>Утас</small>
                  <a href={tel} className="u">{contact.phone}</a>
                </span>
              </li>
              <li className="skin" onPointerMove={spot} style={{ '--c1': '#d3e4dc', '--c2': '#f6f9f7' }}>
                <span className="ct-ic" aria-hidden="true"><Mail size={18} /></span>
                <span>
                  <small>Имэйл</small>
                  <a href={`mailto:${contact.email}`} className="u">{contact.email}</a>
                </span>
              </li>
            </ul>
          </Reveal>
        </div>

        <Reveal className="ct-card skin" delay={160} onPointerMove={spot} style={{ '--d': '160ms', '--c1': '#e6e0f2', '--c2': '#f8f6fb' }}>
          {sent ? (
            <div className="ct-sent" role="status">
              <span className="ct-ok" aria-hidden="true"><Check size={26} strokeWidth={2.5} /></span>
              <h3>Таны хүсэлтийг амжилттай хүлээн авлаа!</h3>
              <p className="muted">Бид тантай удахгүй холбогдоно.</p>
              <button type="button" className="btn btn--sm" onClick={() => setSent(false)}>
                Шинэ хүсэлт илгээх
              </button>
            </div>
          ) : (
            <form className="ct-form" onSubmit={submit}>
              <div className="row2">
                <Field label="Нэр" id="name" value={form.name} onChange={change} required minLength={2} maxLength={100} autoComplete="name" />
                <Field label="Компани / Брэнд" id="company" value={form.company} onChange={change} maxLength={150} autoComplete="organization" />
              </div>

              <div className="row2">
                <Field label="Утас" id="phone" type="tel" value={form.phone} onChange={change} required minLength={6} maxLength={30} autoComplete="tel" />
                <Field label="Имэйл (заавал биш)" id="email" type="email" value={form.email} onChange={change} maxLength={150} autoComplete="email" />
              </div>

              <Field as="select" label="Танд ямар үйлчилгээ хэрэгтэй вэ?" id="service" value={service} onChange={change} disabled={services.length === 0}>
                {services.length === 0 && <option value="">Ачаалж байна...</option>}
                {services.map((s) => (
                  <option key={s.service_id ?? s.title} value={s.title}>{s.title}</option>
                ))}
              </Field>

              <Field as="textarea" label="Таны зорилго / асуудал" id="message" rows={4} maxLength={2000} value={form.message} onChange={change} />

              {/* Honeypot: хүн харахгүй, бот бөглөнө */}
              <div className="hp" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={change} />
              </div>

              {error && <p className="form-error" role="alert">{error}</p>}

              <button type="submit" className="btn ct-submit" disabled={sending}>
                {sending ? 'Илгээж байна...' : 'Хүсэлт илгээх'}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}
