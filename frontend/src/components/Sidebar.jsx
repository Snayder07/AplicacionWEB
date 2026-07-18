import { NavLink } from 'react-router-dom';
import './Sidebar.css'; // Estilos que crearemos abajo

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <h2>RGBR</h2>
      </div>

      <nav className="sidebar-menu">
        {/* Sección Principal */}
        <NavLink to="/" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
          Dashboard
        </NavLink>

        <NavLink to="/clientes" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
          Clientes
        </NavLink>

        {/* Sección Nuevo Pedido */}
        <div className="menu-section-title">Nuevo pedido</div>

        <NavLink to="/streaming" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
          Streaming
        </NavLink>

        <NavLink to="/robux" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
          Robux
        </NavLink>

        <NavLink to="/nueva-inversion" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
          Nueva Inversión
        </NavLink>

        <NavLink to="/ver-inversiones" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
          Ver Inversiones
        </NavLink>

        {/* Sección Administración */}
        <div className="menu-section-title">Administración</div>

        <NavLink to="/cuentas-streaming" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
          Cuentas Streaming
        </NavLink>

        {/* Sección Reportes */}
        <div className="menu-section-title">Reportes</div>

        <NavLink to="/historial" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
          Historial
        </NavLink>
      </nav>
    </div>
  );
}