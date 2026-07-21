import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const stored = localStorage.getItem('rgbr_auth');
  if (!stored) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
