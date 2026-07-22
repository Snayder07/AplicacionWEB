import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/useAuth';
import Sidebar from './components/Sidebar';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import PedidoStreaming from './pages/PedidoStreaming';
import PedidoRobux from './pages/PedidoRobux';
import NuevaInversion from './pages/NuevaInversion';
import VerInversiones from './pages/VerInversiones';
import CuentasStreaming from './pages/CuentasStreaming';
import Historial from './pages/Historial';

function AppLayout() {
  const auth = useAuth();

  return (
    <div className="app-layout">
      <Sidebar auth={auth} />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/streaming" element={<PedidoStreaming />} />
          <Route path="/robux" element={<PedidoRobux />} />
          <Route path="/nueva-inversion" element={<NuevaInversion />} />
          <Route path="/ver-inversiones" element={<VerInversiones />} />
          <Route path="/cuentas-streaming" element={<CuentasStreaming />} />
          <Route path="/historial" element={<Historial />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
