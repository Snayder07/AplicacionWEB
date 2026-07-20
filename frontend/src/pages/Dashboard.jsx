import { useState, useEffect } from 'react';
import { get } from '../api';
import './Pages.css';

function estadoBadgeClass(estado) {
  const e = (estado || '').toLowerCase();
  if (e.includes('complet')) return 'badge badge-success';
  if (e.includes('pend') || e.includes('tratam') || e.includes('anotad')) return 'badge badge-warning';
  return 'badge badge-danger';
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    get('/dashboard')
      .then(setStats)
      .catch(() => setError('No se pudo conectar con el servidor'));
  }, []);

  if (error) {
    return (
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Resumen general del negocio</p>
        </div>
        <div className="panel">
          <p style={{ color: '#f85149' }}>{error}</p>
          <p style={{ color: '#8b949e', fontSize: '14px' }}>Asegúrate de que el backend esté corriendo en http://localhost:8080</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="page">
        <p style={{ color: '#8b949e' }}>Cargando...</p>
      </div>
    );
  }

  const resumen = [
    { label: 'Clientes totales', value: stats.totalClientes },
    { label: 'Ventas Robux (mes)', value: `$${stats.ventasTotalesUsd}` },
    { label: 'Pedidos pendientes', value: stats.pedidosPendientes },
    { label: 'Pedidos completados', value: stats.pedidosCompletados },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Resumen general del negocio</p>
      </div>

      <div className="cards-grid">
        {resumen.map((item) => (
          <div className="card" key={item.label}>
            <p className="card-label">{item.label}</p>
            <p className="card-value">{item.value}</p>
          </div>
        ))}
      </div>

      {stats.pedidosRecientes && stats.pedidosRecientes.length > 0 && (
        <div className="panel">
          <h2 className="panel-title">Actividad reciente</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Monto</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {stats.pedidosRecientes.map((fila, index) => (
                <tr key={index}>
                  <td>{fila.cliente}</td>
                  <td>{fila.tipo}</td>
                  <td>${fila.monto}</td>
                  <td>
                    <span className={estadoBadgeClass(fila.estado)}>
                      {fila.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
