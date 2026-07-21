import { useDashboardController } from '../controllers/useDashboardController';
import './Pages.css';

export default function Dashboard() {
  const c = useDashboardController();

  if (c.error) {
    return (
      <div className="page" data-testid="dashboard-page">
        <div className="page-header">
          <h1 className="page-title" data-testid="dashboard-title">Dashboard</h1>
          <p className="page-subtitle">Resumen general del negocio</p>
        </div>
        <div className="alert alert-error" data-testid="dashboard-error">
          {c.error} &mdash; Asegúrate de que el backend esté corriendo en http://localhost:8080
        </div>
      </div>
    );
  }

  if (!c.stats) {
    return (
      <div className="page" data-testid="dashboard-page">
        <p style={{ color: '#8b949e' }}>Cargando...</p>
      </div>
    );
  }

  const resumen = [
    { label: 'Clientes totales', value: c.stats.totalClientes, testId: 'card-clientes' },
    { label: 'Ventas totales (USD)', value: `$${c.stats.ventasTotalesUsd}`, testId: 'card-ventas' },
    { label: 'Pedidos pendientes', value: c.stats.pedidosPendientes, testId: 'card-pendientes' },
    { label: 'Pedidos completados', value: c.stats.pedidosCompletados, testId: 'card-completados' },
  ];

  return (
    <div className="page" data-testid="dashboard-page">
      <div className="page-header">
        <h1 className="page-title" data-testid="dashboard-title">Dashboard</h1>
        <p className="page-subtitle">Resumen general del negocio</p>
      </div>

      <div className="cards-grid" data-testid="dashboard-cards">
        {resumen.map((item) => (
          <div className="card" key={item.label} data-testid={item.testId}>
            <p className="card-label">{item.label}</p>
            <p className="card-value">{item.value}</p>
          </div>
        ))}
      </div>

      {c.stats.pedidosRecientes?.length > 0 && (
        <div className="panel" data-testid="dashboard-recientes">
          <h2 className="panel-title">Actividad reciente</h2>
          <table className="data-table" data-testid="tabla-recientes">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Monto</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {c.stats.pedidosRecientes.map((fila, index) => (
                <tr key={index}>
                  <td>{fila.cliente}</td>
                  <td>{fila.tipo}</td>
                  <td>${fila.monto}</td>
                  <td>
                    <span className={c.estadoBadgeClass(fila.estado)}>
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
