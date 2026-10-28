import { API_URL } from '../api.js'
import { useState } from 'react'
import AdminDashboard from './Admindashboard'
import './admin.css'

export default function Admin() {
  const [token, setToken] = useState(
    () => sessionStorage.getItem('adm') || ''
  )

  const logout = () => {
    sessionStorage.removeItem('adm')
    setToken('')
  }

  // Нэвтрээгүй үед login
  if (!token) {
    return (
      <div className="adm-wrap">
        <form
          className="adm-card"
          onSubmit={async (e) => {
            e.preventDefault()

            const formData = new FormData(e.currentTarget)

            const username = formData.get('username')
            const password = formData.get('password')

            try {
              const response = await fetch(
                `${API_URL}/admin/login`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    username,
                    password,
                  }),
                }
              )

              const data = await response.json()

              if (!response.ok) {
                alert(
                  data.error ||
                    'Нэвтрэх нэр эсвэл нууц үг буруу'
                )
                return
              }

              sessionStorage.setItem(
                'adm',
                data.token
              )

              setToken(data.token)
            } catch (error) {
              console.error(error)

              alert(
                'Сервертэй холбогдож чадсангүй'
              )
            }
          }}
        >
          <h1>Админ нэвтрэх</h1>

          <label>
            Нэр

            <input
              name="username"
              autoComplete="username"
              required
            />
          </label>

          <label>
            Нууц үг

            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>

          <button type="submit">
            Нэвтрэх
          </button>
        </form>
      </div>
    )
  }

  // Нэвтэрсэн үед шинэ Dashboard
  return (
    <AdminDashboard
      token={token}
      onLogout={logout}
    />
  )
}