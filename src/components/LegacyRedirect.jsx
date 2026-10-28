import { Navigate, useLocation } from 'react-router-dom'

/* Хуучин хуудаснуудын холбоос (/about, /services …) нэг хуудасны тухайн хэсэг рүү шилжинэ. */
const map = { about: 'about', services: 'services', portfolio: 'portfolio', contact: 'contact', proposal: 'contact' }

export default function LegacyRedirect() {
  const { pathname } = useLocation()
  const key = pathname.replace(/^\/|\/$/g, '')
  return <Navigate to={{ pathname: '/', hash: map[key] ? `#${map[key]}` : '' }} replace />
}
