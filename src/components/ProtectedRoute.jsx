import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  // sessionStorage дээрх 'adm' эсвэл localStorage дээрх заалтыг шалгах
  const isAuthenticated =
    sessionStorage.getItem('adm') ||
    localStorage.getItem('isAdminAuthenticated') === 'true'

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  return children
}