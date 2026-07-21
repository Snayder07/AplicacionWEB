import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Film, Gamepad2, TrendingUp,
  LineChart, Monitor, History, LogOut
} from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({ auth }) {
  const navigate = useNavigate();

  function handleLogout() {
    auth.logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="sidebar" data-testid="sidebar">
      <div className="sidebar-brand">
        <h2>RGBR</h2>
      </div>

      <nav className="sidebar-menu" data-testid="sidebar-menu">
        <NavLink to="/" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'} data-testid="link-dashboard">
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/clientes" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'} data-testid="link-clientes">
          <Users size={18} />
          Clientes
        </NavLink>

        <div className="menu-section-title">Nuevo pedido</div>

        <NavLink to="/streaming" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'} data-testid="link-streaming">
          <Film size={18} />
          Streaming
        </NavLink>

        <NavLink to="/robux" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'} data-testid="link-robux">
          <Gamepad2 size={18} />
          Robux
        </NavLink>

        <NavLink to="/nueva-inversion" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'} data-testid="link-nueva-inversion">
          <TrendingUp size={18} />
          Nueva Inversión
        </NavLink>

        <NavLink to="/ver-inversiones" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'} data-testid="link-ver-inversiones">
          <LineChart size={18} />
          Ver Inversiones
        </NavLink>

        <div className="menu-section-title">Administración</div>

        <NavLink to="/cuentas-streaming" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'} data-testid="link-cuentas-streaming">
          <Monitor size={18} />
          Cuentas Streaming
        </NavLink>

        <div className="menu-section-title">Reportes</div>

        <NavLink to="/historial" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'} data-testid="link-historial">
          <History size={18} />
          Historial
        </NavLink>
      </nav>

      <div className="sidebar-footer" data-testid="sidebar-footer">
        <span className="sidebar-user" data-testid="sidebar-user">{auth.usuario}</span>
        <button className="logout-btn" onClick={handleLogout} data-testid="btn-cerrar-sesion">
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
