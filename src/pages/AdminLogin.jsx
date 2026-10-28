import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Админ нэвтрэх жишээ шалгалт (Дараа нь backend API-тай холбоно)
    if (credentials.username === 'admin' && credentials.password === '123456') {
      localStorage.setItem('isAdminAuthenticated', 'true')
      navigate('/admin') // Амжилттай бол админ панел руу шилжинэ
    } else {
      setError('Нэвтрэх нэр эсвэл нууц үг буруу байна!')
    }
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ color: '#2A2633', marginTop: 0, marginBottom: '24px', textAlign: 'center' }}>
          Админ Нэвтрэх
        </h2>

        {error && (
          <div style={{
            backgroundColor: '#FFEBEE',
            color: '#C62828',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '6px' }}>
              Нэвтрэх нэр
            </label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="admin"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '6px' }}>
              Нууц үг
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="••••••"
              required
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#615279',
              color: '#FFFFFF',
              border: 'none',
              padding: '12px',
              borderRadius: '24px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '10px',
              transition: 'background-color 0.2s'
            }}
          >
            Нэвтрэх
          </button>
        </form>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid #DDD',
  borderRadius: '10px',
  fontSize: '0.95rem',
  outline: 'none',
  boxSizing: 'border-box'
}