import { useCallback, useEffect, useState } from 'react'
import './admin.css'

import { API_URL, FILES_URL as SERVER_URL } from '../api.js'


const STATUSES = [
  { value: 'Pending', label: 'Хүлээгдэж буй' },
  { value: 'Contacted', label: 'Холбогдсон' },
  { value: 'Done', label: 'Дууссан' },
]



const emptyService = {
  title: '',
  icon: '',
  description: '',
  bullets: '',
  steps: '',
  kpi: '',
}

const emptyPortfolio = {
  title: '',
  category: '',
  description: '',
  image: null,
  challenge: '',
  solution: '',
  timeline: '',
  result: '',
}

function fmt(date) {
  if (!date) return '-'

  return new Date(date).toLocaleString('mn-MN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AdminDashboard({ token, onLogout }) {
  const [activeTab, setActiveTab] = useState('inquiries')

  const [inquiries, setInquiries] = useState([])
  const [services, setServices] = useState([])
  const [portfolio, setPortfolio] = useState([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [serviceForm, setServiceForm] = useState(emptyService)
  const [portfolioForm, setPortfolioForm] = useState(emptyPortfolio)

  const [editingServiceId, setEditingServiceId] = useState(null)
  const [editingPortfolioId, setEditingPortfolioId] = useState(null)

  const [savingService, setSavingService] = useState(false)
  const [savingPortfolio, setSavingPortfolio] = useState(false)

  const auth = useCallback(
    () => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }),
    [token]
  )

  // =========================
  // INQUIRIES
  // =========================

  const loadInquiries = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${API_URL}/admin/inquiries`, {
        headers: auth(),
      })

      if (response.status === 401) {
        onLogout()
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Хүсэлтүүдийг авахад алдаа гарлаа')
      }

      setInquiries(data)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [auth, onLogout])

  const setInquiryStatus = async (id, status) => {
    const previous = [...inquiries]

    setInquiries((current) =>
      current.map((item) =>
        item.inquiry_id === id
          ? { ...item, status }
          : item
      )
    )

    try {
      const response = await fetch(
        `${API_URL}/admin/inquiries/${id}`,
        {
          method: 'PATCH',
          headers: auth(),
          body: JSON.stringify({ status }),
        }
      )

      if (response.status === 401) {
        onLogout()
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Төлөв өөрчлөхөд алдаа гарлаа'
        )
      }
    } catch (err) {
      console.error(err)
      setInquiries(previous)
      setError(err.message)
    }
  }

  const deleteInquiry = async (id) => {
    const ok = window.confirm(
      'Энэ хүсэлтийг устгах уу?'
    )

    if (!ok) return

    try {
      const response = await fetch(
        `${API_URL}/admin/inquiries/${id}`,
        {
          method: 'DELETE',
          headers: auth(),
        }
      )

      if (response.status === 401) {
        onLogout()
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Хүсэлт устгахад алдаа гарлаа'
        )
      }

      setInquiries((current) =>
        current.filter(
          (item) => item.inquiry_id !== id
        )
      )
    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }

  // =========================
  // SERVICES
  // =========================

  const loadServices = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        `${API_URL}/admin/services`,
        {
          headers: auth(),
        }
      )

      if (response.status === 401) {
        onLogout()
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Үйлчилгээнүүдийг авахад алдаа гарлаа'
        )
      }

      setServices(data)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [auth, onLogout])

  const changeService = (e) => {
    setServiceForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }))
  }

  const editService = (service) => {
    setEditingServiceId(service.service_id)

    setServiceForm({
      title: service.title || '',
      icon: service.icon || '',
      description: service.description || '',
      bullets: Array.isArray(service.bullets)
        ? service.bullets.join('\n')
        : service.bullets || '',
      steps: Array.isArray(service.steps)
        ? service.steps.join('\n')
        : service.steps || '',
      kpi: service.kpi || '',
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const cancelServiceEdit = () => {
    setEditingServiceId(null)
    setServiceForm(emptyService)
  }

  const saveService = async (e) => {
    e.preventDefault()

    if (!serviceForm.title.trim()) {
      setError('Үйлчилгээний нэр оруулна уу.')
      return
    }

    try {
      setSavingService(true)
      setError('')

      const payload = {
        title: serviceForm.title.trim(),
        icon: serviceForm.icon.trim(),
        description: serviceForm.description.trim(),

        bullets: serviceForm.bullets
          .split('\n')
          .map((x) => x.trim())
          .filter(Boolean),

        steps: serviceForm.steps
          .split('\n')
          .map((x) => x.trim())
          .filter(Boolean),

        kpi: serviceForm.kpi.trim(),
      }

      const url = editingServiceId
        ? `${API_URL}/admin/services/${editingServiceId}`
        : `${API_URL}/admin/services`

      const method = editingServiceId
        ? 'PUT'
        : 'POST'

      const response = await fetch(url, {
        method,
        headers: auth(),
        body: JSON.stringify(payload),
      })

      if (response.status === 401) {
        onLogout()
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Үйлчилгээ хадгалахад алдаа гарлаа'
        )
      }

      await loadServices()

      setServiceForm(emptyService)
      setEditingServiceId(null)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setSavingService(false)
    }
  }

  const deleteService = async (id) => {
    const ok = window.confirm(
      'Энэ үйлчилгээг устгах уу?'
    )

    if (!ok) return

    try {
      const response = await fetch(
        `${API_URL}/admin/services/${id}`,
        {
          method: 'DELETE',
          headers: auth(),
        }
      )

      if (response.status === 401) {
        onLogout()
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Үйлчилгээ устгахад алдаа гарлаа'
        )
      }

      setServices((current) =>
        current.filter(
          (item) => item.service_id !== id
        )
      )
    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }

  // =========================
  // PORTFOLIO
  // =========================

  const loadPortfolio = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        `${API_URL}/admin/portfolio`,
        {
          headers: auth(),
        }
      )

      if (response.status === 401) {
        onLogout()
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Гүйцэтгэсэн ажлуудыг авахад алдаа гарлаа'
        )
      }

      setPortfolio(data)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [auth, onLogout])

  const changePortfolio = (e) => {
    setPortfolioForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }))
  }

  // =========================
  // PORTFOLIO IMAGE
  // =========================

  const changePortfolioImage = (e) => {
    const file = e.target.files?.[0] || null

    if (!file) {
      return
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/jpg',
    ]

    if (!allowedTypes.includes(file.type)) {
      setError(
        'Зөвхөн JPG, PNG, WEBP зураг оруулна уу.'
      )

      e.target.value = ''
      return
    }

    if (file.size > 4 * 1024 * 1024) {
      setError(
        'Зургийн хэмжээ 4MB-аас их байж болохгүй.'
      )

      e.target.value = ''
      return
    }

    setError('')

    setPortfolioForm((current) => ({
      ...current,
      image: file,
    }))
  }

  const getPortfolioImageUrl = (image) => {
    if (!image) return ''

    if (image instanceof File) {
      return URL.createObjectURL(image)
    }

    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image
    }

    return `${SERVER_URL}${image}`
  }

  const editPortfolio = (item) => {
    setEditingPortfolioId(item.portfolio_id)

    setPortfolioForm({
      title: item.title || '',
      category: item.category || '',
      description: item.description || '',
      image: item.image || null,
      challenge: item.challenge || '',
      solution: item.solution || '',
      timeline: item.timeline || '',
      result: item.result || '',
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const cancelPortfolioEdit = () => {
    setEditingPortfolioId(null)
    setPortfolioForm(emptyPortfolio)
  }

  // =========================
  // SAVE PORTFOLIO
  // =========================

  const savePortfolio = async (e) => {
    e.preventDefault()

    if (!portfolioForm.title.trim()) {
      setError('Ажлын нэр оруулна уу.')
      return
    }

    try {
      setSavingPortfolio(true)
      setError('')

      /*
        Portfolio зурагтай учраас JSON биш
        FormData ашиглана.
      */

      const formData = new FormData()

      formData.append(
        'title',
        portfolioForm.title.trim()
      )

      formData.append(
        'category',
        portfolioForm.category.trim()
      )

      formData.append(
        'description',
        portfolioForm.description.trim()
      )

      formData.append(
        'challenge',
        portfolioForm.challenge.trim()
      )

      formData.append(
        'solution',
        portfolioForm.solution.trim()
      )

      formData.append(
        'timeline',
        portfolioForm.timeline.trim()
      )

      formData.append(
        'result',
        portfolioForm.result.trim()
      )

      /*
        Шинэ зураг сонгосон үед л image илгээнэ.

        Edit хийх үед шинэ зураг сонгоогүй бол
        backend хуучин зургийг хадгална.
      */

      if (portfolioForm.image instanceof File) {
        formData.append(
          'image',
          portfolioForm.image
        )
      }

      const url = editingPortfolioId
        ? `${API_URL}/admin/portfolio/${editingPortfolioId}`
        : `${API_URL}/admin/portfolio`

      const method = editingPortfolioId
        ? 'PUT'
        : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.status === 401) {
        onLogout()
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Гүйцэтгэсэн ажил хадгалахад алдаа гарлаа'
        )
      }

      await loadPortfolio()

      setPortfolioForm(emptyPortfolio)
      setEditingPortfolioId(null)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setSavingPortfolio(false)
    }
  }

  const deletePortfolio = async (id) => {
    const ok = window.confirm(
      'Энэ гүйцэтгэсэн ажлыг устгах уу?'
    )

    if (!ok) return

    try {
      const response = await fetch(
        `${API_URL}/admin/portfolio/${id}`,
        {
          method: 'DELETE',
          headers: auth(),
        }
      )

      if (response.status === 401) {
        onLogout()
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Гүйцэтгэсэн ажил устгахад алдаа гарлаа'
        )
      }

      setPortfolio((current) =>
        current.filter(
          (item) => item.portfolio_id !== id
        )
      )
    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    loadInquiries()
    loadServices()
    loadPortfolio()
  }, [
    loadInquiries,
    loadServices,
    loadPortfolio,
  ])

  return (
    <div className="adm-wrap wide">

      {/* HEADER */}

      <div className="adm-head">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Brandify by Yuna Marketing Agency</p>
        </div>

        <button
          className="adm-btn"
          onClick={onLogout}
        >
          Гарах
        </button>
      </div>

      {/* TABS */}

      <div className="adm-tabs">

        <button
          className={
            activeTab === 'inquiries'
              ? 'active'
              : ''
          }
          onClick={() => setActiveTab('inquiries')}
        >
          Хүсэлтүүд
        </button>

        <button
          className={
            activeTab === 'services'
              ? 'active'
              : ''
          }
          onClick={() => setActiveTab('services')}
        >
          Үйлчилгээнүүд
        </button>

        <button
          className={
            activeTab === 'portfolio'
              ? 'active'
              : ''
          }
          onClick={() => setActiveTab('portfolio')}
        >
          Гүйцэтгэсэн ажил
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="adm-error">
          {error}

          <button
            onClick={() => setError('')}
          >
            ×
          </button>
        </div>
      )}

      {/* =========================
          INQUIRIES
      ========================= */}

      {activeTab === 'inquiries' && (
        <section className="adm-section">

          <div className="adm-section-head">
            <div>
              <h2>Зөвлөгөөний хүсэлтүүд</h2>
              <p>
                Хэрэглэгчдээс ирсэн хүсэлтүүд
              </p>
            </div>

            <button
              className="adm-btn"
              onClick={loadInquiries}
            >
              Шинэчлэх
            </button>
          </div>

          {loading ? (
            <p>Ачааллаж байна...</p>
          ) : inquiries.length === 0 ? (
            <div className="adm-empty">
              Хүсэлт одоогоор алга байна.
            </div>
          ) : (
            <div className="adm-table-wrap">

              <table className="adm-table">

                <thead>
                  <tr>
                    <th>Огноо</th>
                    <th>Нэр</th>
                    <th>Компани</th>
                    <th>Утас</th>
                    <th>Имэйл</th>
                    <th>Үйлчилгээ</th>
                    <th>Төсөв</th>
                    <th>Мессеж</th>
                    <th>Төлөв</th>
                    <th>Үйлдэл</th>
                  </tr>
                </thead>

                <tbody>

                  {inquiries.map((x) => (
                    <tr key={x.inquiry_id}>

                      <td>
                        {fmt(x.inquiry_date)}
                      </td>

                      <td>
                        {x.customer_name}
                      </td>

                      <td>
                        {x.company || '-'}
                      </td>

                      <td>
                        {x.customer_phone}
                      </td>

                      <td>
                        {x.customer_email || '-'}
                      </td>

                      <td>
                        {x.service_title || '-'}
                      </td>

                      <td>
                        {x.budget || '-'}
                      </td>

                      <td>
                        {x.message || '-'}
                      </td>

                      
<td>
  <select
    className="adm-status-select"
    value={x.status || 'Pending'}
    onChange={(e) =>
      setInquiryStatus(
        x.inquiry_id,
        e.target.value
      )
    }
  >
    {STATUSES.map((status) => (
      <option
        key={status.value}
        value={status.value}
      >
        {status.label}
      </option>
    ))}
  </select>
</td>


                      <td>

                        <button
                          className="adm-danger"
                          onClick={() =>
                            deleteInquiry(
                              x.inquiry_id
                            )
                          }
                        >
                          Устгах
                        </button>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </section>
      )}

      {/* =========================
          SERVICES
      ========================= */}

      {activeTab === 'services' && (
        <section className="adm-section">

          <div className="adm-section-head">
            <div>
              <h2>Үйлчилгээнүүд</h2>
              <p>
                /services хуудсан дээр харагдах
                мэдээллийг удирдах
              </p>
            </div>

            <button
              className="adm-btn"
              onClick={loadServices}
            >
              Шинэчлэх
            </button>
          </div>

          {/* SERVICE FORM */}

          <form
            className="adm-form"
            onSubmit={saveService}
          >

            <h3>
              {editingServiceId
                ? 'Үйлчилгээ засах'
                : 'Шинэ үйлчилгээ нэмэх'}
            </h3>

            <div className="adm-form-grid">

              <label>
                Үйлчилгээний нэр
                <input
                  name="title"
                  value={serviceForm.title}
                  onChange={changeService}
                  placeholder="Жишээ: Маркетингийн стратеги"
                  required
                />
              </label>

              <label>
                Icon
                <input
                  name="icon"
                  value={serviceForm.icon}
                  onChange={changeService}
                  placeholder="BarChart3"
                />
              </label>

            </div>

            <label>
              Тайлбар
              <textarea
                name="description"
                value={serviceForm.description}
                onChange={changeService}
                rows="3"
                placeholder="Үйлчилгээний товч тайлбар"
              />
            </label>

            <label>
              Давуу талууд
              <textarea
                name="bullets"
                value={serviceForm.bullets}
                onChange={changeService}
                rows="5"
                placeholder={
                  'Мөр бүрт нэг мэдээлэл бичнэ.\n' +
                  'Зах зээлийн судалгаа\n' +
                  'STP стратеги\n' +
                  'Marketing Audit'
                }
              />
            </label>

            <label>
              Үе шат
              <textarea
                name="steps"
                value={serviceForm.steps}
                onChange={changeService}
                rows="4"
                placeholder={
                  'Судалгаа\n' +
                  'Стратеги боловсруулах\n' +
                  'Хэрэгжүүлэлт\n' +
                  'Анализ'
                }
              />
            </label>

            <label>
              KPI
              <textarea
                name="kpi"
                value={serviceForm.kpi}
                onChange={changeService}
                rows="2"
                placeholder="Үр дүнг хэмжих үзүүлэлт"
              />
            </label>

            <div className="adm-form-actions">

              <button
                type="submit"
                className="adm-primary"
                disabled={savingService}
              >
                {savingService
                  ? 'Хадгалж байна...'
                  : editingServiceId
                  ? 'Өөрчлөлт хадгалах'
                  : 'Үйлчилгээ нэмэх'}
              </button>

              {editingServiceId && (
                <button
                  type="button"
                  className="adm-btn"
                  onClick={cancelServiceEdit}
                >
                  Болих
                </button>
              )}

            </div>

          </form>

          {/* SERVICE LIST */}

          <div className="adm-list">

            <h3>
              Одоогийн үйлчилгээнүүд (
              {services.length})
            </h3>

            {loading ? (
              <p>Ачааллаж байна...</p>
            ) : services.length === 0 ? (
              <div className="adm-empty">
                Үйлчилгээ алга байна.
              </div>
            ) : (
              <div className="adm-cards">

                {services.map((service) => (
                  <div
                    className="adm-card"
                    key={service.service_id}
                  >

                    <div className="adm-card-body">

                      <div className="adm-card-icon">
                        {service.icon || '✦'}
                      </div>

                      <div>
                        <h4>
                          {service.title}
                        </h4>

                        <p>
                          {service.description}
                        </p>

                        {service.kpi && (
                          <small>
                            KPI: {service.kpi}
                          </small>
                        )}

                      </div>

                    </div>

                    <div className="adm-card-actions">

                      <button
                        className="adm-btn"
                        onClick={() =>
                          editService(service)
                        }
                      >
                        Засах
                      </button>

                      <button
                        className="adm-danger"
                        onClick={() =>
                          deleteService(
                            service.service_id
                          )
                        }
                      >
                        Устгах
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

        </section>
      )}

      {/* =========================
          PORTFOLIO
      ========================= */}

      {activeTab === 'portfolio' && (
        <section className="adm-section">

          <div className="adm-section-head">
            <div>
              <h2>Гүйцэтгэсэн ажил</h2>
              <p>
                /portfolio хуудсан дээр харагдах
                мэдээллийг удирдах
              </p>
            </div>

            <button
              className="adm-btn"
              onClick={loadPortfolio}
            >
              Шинэчлэх
            </button>
          </div>

          {/* PORTFOLIO FORM */}

          <form
            className="adm-form"
            onSubmit={savePortfolio}
          >

            <h3>
              {editingPortfolioId
                ? 'Гүйцэтгэсэн ажил засах'
                : 'Шинэ ажил нэмэх'}
            </h3>

            <div className="adm-form-grid">

              <label>
                Гарчиг
                <input
                  name="title"
                  value={portfolioForm.title}
                  onChange={changePortfolio}
                  placeholder="Жишээ: Aura Luxury Skincare"
                  required
                />
              </label>

              <label>
                Ангилал
                <input
                  name="category"
                  value={portfolioForm.category}
                  onChange={changePortfolio}
                  placeholder="Брэндинг & Стратеги"
                />
              </label>

            </div>

            {/* IMAGE UPLOAD */}

            <label>
              Зураг

              <input
                type="file"
                name="image"
                accept="image/jpeg,image/png,image/webp"
                onChange={changePortfolioImage}
              />

              <small>
                JPG, PNG, WEBP · хамгийн ихдээ 4MB
              </small>
            </label>

            {/* IMAGE PREVIEW */}

            {portfolioForm.image && (
              <div className="adm-image-preview">
                <img
                  src={getPortfolioImageUrl(
                    portfolioForm.image
                  )}
                  alt="Сонгосон зураг"
                />

                {editingPortfolioId &&
                  typeof portfolioForm.image ===
                    'string' && (
                    <p>
                      Одоогийн зураг. Шинэ зураг
                      сонговол солигдоно.
                    </p>
                  )}

                {portfolioForm.image instanceof File && (
                  <p>
                    Шинэ зураг сонгогдлоо:{' '}
                    {portfolioForm.image.name}
                  </p>
                )}
              </div>
            )}

            <label>
              Тайлбар
              <textarea
                name="description"
                value={portfolioForm.description}
                onChange={changePortfolio}
                rows="4"
                placeholder="Төслийн ерөнхий тайлбар"
              />
            </label>

            <label>
              Challenge
              <textarea
                name="challenge"
                value={portfolioForm.challenge}
                onChange={changePortfolio}
                rows="3"
                placeholder="Хэрэглэгчийн асуудал / challenge"
              />
            </label>

            <label>
              Solution
              <textarea
                name="solution"
                value={portfolioForm.solution}
                onChange={changePortfolio}
                rows="3"
                placeholder="Бидний шийдэл"
              />
            </label>

            <div className="adm-form-grid">

              <label>
                Timeline
                <input
                  name="timeline"
                  value={portfolioForm.timeline}
                  onChange={changePortfolio}
                  placeholder="3 сар"
                />
              </label>

              <label>
                Result
                <textarea
                  name="result"
                  value={portfolioForm.result}
                  onChange={changePortfolio}
                  rows="2"
                  placeholder="Гарсан үр дүн"
                />
              </label>

            </div>

            <div className="adm-form-actions">

              <button
                type="submit"
                className="adm-primary"
                disabled={savingPortfolio}
              >
                {savingPortfolio
                  ? 'Хадгалж байна...'
                  : editingPortfolioId
                  ? 'Өөрчлөлт хадгалах'
                  : 'Ажил нэмэх'}
              </button>

              {editingPortfolioId && (
                <button
                  type="button"
                  className="adm-btn"
                  onClick={cancelPortfolioEdit}
                >
                  Болих
                </button>
              )}

            </div>

          </form>

          {/* PORTFOLIO LIST */}

          <div className="adm-list">

            <h3>
              Одоогийн ажлууд (
              {portfolio.length})
            </h3>

            {loading ? (
              <p>Ачааллаж байна...</p>
            ) : portfolio.length === 0 ? (
              <div className="adm-empty">
                Гүйцэтгэсэн ажил алга байна.
              </div>
            ) : (
              <div className="adm-cards">

                {portfolio.map((item) => (
                  <div
                    className="adm-card"
                    key={item.portfolio_id}
                  >

                    {item.image && (
                      <img
                        src={getPortfolioImageUrl(item.image)}
                        alt={item.title}
                        className="adm-card-image"
                      />
                    )}

                    <div className="adm-card-body">

                      <div>

                        <span className="adm-category">
                          {item.category || 'Ангилалгүй'}
                        </span>

                        <h4>
                          {item.title}
                        </h4>

                        <p>
                          {item.description}
                        </p>

                      </div>

                    </div>

                    <div className="adm-card-actions">

                      <button
                        className="adm-btn"
                        onClick={() =>
                          editPortfolio(item)
                        }
                      >
                        Засах
                      </button>

                      <button
                        className="adm-danger"
                        onClick={() =>
                          deletePortfolio(
                            item.portfolio_id
                          )
                        }
                      >
                        Устгах
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

        </section>
      )}

    </div>
  )
}

