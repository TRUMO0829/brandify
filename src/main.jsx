import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Admin from './pages/Admin.jsx'
import Home from './pages/Home.jsx'
import LegacyRedirect from './components/LegacyRedirect.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Нийтийн сайт: бүх агуулга нэг хуудсан дээр */}
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
        </Route>

        <Route path="/admin" element={<Admin />} />

        {/* /about, /services, /portfolio, /contact, /proposal → нэг хуудасны хэсэг рүү */}
        <Route path="*" element={<LegacyRedirect />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
