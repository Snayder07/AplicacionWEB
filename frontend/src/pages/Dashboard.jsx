import { useDashboardController } from '../controllers/useDashboardController';
import VentasChart from '../components/VentasChart';
import { formatMoney } from '../utils/format';
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

  // Colores de acento por código de moneda (igual estilo que la referencia:
  // azul, verde, naranja, morado...). Si aparece una moneda nueva que no está
  // en la lista, se le asigna un color siguiendo el mismo ciclo.
  const coloresMoneda = ['#58a6ff', '#3fb950', '#d29922', '#a371f7', '#f85149', '#39c5cf'];
  const colorPorMoneda = (codigo, index) => coloresMoneda[index % coloresMoneda.length];

  const ventasChartData = Object.entries(c.stats.ventasUltimos7Dias || {}).map(([label, value]) => ({
    label,
    value,
  }));

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

      {c.stats.resumenPorMoneda?.length > 0 && (
        <div className="panel" data-testid="dashboard-monedas">
          <h2 className="panel-title">Dinero recibido por tipo de moneda</h2>
          <div className="currency-grid">
            {c.stats.resumenPorMoneda.map((moneda, index) => {
              const color = colorPorMoneda(moneda.codigo, index);
              return (
                <div
                  key={moneda.codigo}
                  className="currency-card"
                  style={{ borderLeftColor: color }}
                  data-testid={`currency-card-${moneda.codigo}`}
                >
                  <p className="currency-card-code" style={{ color }}>{moneda.codigo}</p>
                  <p className="currency-card-value">{formatMoney(moneda.total)}</p>
                  <p className="currency-card-sub">
                    {moneda.nombre} &middot; {moneda.cantidadPedidos} pedido{moneda.cantidadPedidos === 1 ? '' : 's'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="panel" data-testid="dashboard-ventas-chart">
        <h2 className="panel-title">Ventas &middot; últimos 7 días</h2>
        <VentasChart data={ventasChartData} />
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
