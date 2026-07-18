import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';

// Cada página vive en su propio archivo dentro de src/pages.
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import PedidoStreaming from './pages/PedidoStreaming';
import PedidoRobux from './pages/PedidoRobux';
import NuevaInversion from './pages/NuevaInversion';
import VerInversiones from './pages/VerInversiones';
import CuentasStreaming from './pages/CuentasStreaming';
import Historial from './pages/Historial';

export default function App() {
  return (
    <BrowserRouter>
      {/* Contenedor principal con la pantalla dividida (Flexbox) */}
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b0e14' }}>

        {/* Tu menú lateral izquierdo fijo */}
        <Sidebar />

        {/* Panel derecho: aquí se dibuja la página según la URL actual */}
        <div style={{ flex: 1, padding: '40px' }}>
          {/*
            <Routes> mira la URL actual y elige el <Route> que coincida.
            Cada "path" tiene que ser IGUAL al "to" que pusiste en el
            NavLink dentro de Sidebar.jsx, si no, el link no mostrará nada.
          */}
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
    </BrowserRouter>
  );
}