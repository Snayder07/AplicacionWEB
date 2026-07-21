import { useHistorialController } from '../controllers/useHistorialController';
import { Search } from 'lucide-react';
import './Pages.css';

export default function Historial() {
  const c = useHistorialController();

  return (
    <div className="page" data-testid="historial-page">
      <div className="page-header">
        <h1 className="page-title" data-testid="historial-title">Historial de pedidos</h1>
        <p className="page-subtitle">Todos los pedidos registrados en el sistema</p>
      </div>

      {c.error && <div className="alert alert-error" data-testid="historial-error">{c.error}</div>}

      <div className="panel" data-testid="panel-historial">
        <div className="toolbar">
          <div className="toolbar-left">
            <h2 className="panel-title" style={{ margin: 0 }}>Pedidos (<span data-testid="historial-count">{c.historial.length}</span>)</h2>
            <select value={c.tipo} onChange={(e) => c.setTipo(e.target.value)}
              data-testid="select-filtro-historial"
              style={{ backgroundColor: '#0d1117', border: '1px solid #21262d', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '13px' }}>
              <option value="General">General</option>
              <option value="Robux">Robux</option>
              <option value="Streaming">Streaming</option>
            </select>
          </div>
          <div className="search-input-wrapper">
            <Search size={16} />
            <input
              type="text"
              placeholder="Buscar por nombre o ID de Discord..."
              value={c.busqueda}
              onChange={(e) => c.setBusqueda(e.target.value)}
              data-testid="input-buscar-historial"
            />
          </div>
        </div>

        {c.historial.length === 0 ? (
          <div className="data-table-empty">
            <div className="data-table-empty-icon">
              <Search size={32} />
            </div>
            <p className="data-table-empty-text">
              {c.busqueda ? 'No se encontraron pedidos' : 'No hay pedidos registrados'}
            </p>
            <p className="data-table-empty-subtext">
              {c.busqueda ? 'Prueba con otros términos de búsqueda' : 'Los pedidos aparecerán aquí una vez registrados'}
            </p>
          </div>
        ) : (
          <table className="data-table" data-testid="tabla-historial">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {c.historial.map((item) => {
                const esRobux = item.idCompraRobux !== undefined;
                return (
                  <tr key={esRobux ? `r-${item.idCompraRobux}` : `s-${item.idCompraStreaming}`}>
                    <td>{item.cliente?.nombreDiscord || 'N/D'}</td>
                    <td>{esRobux ? 'Robux' : 'Streaming'}</td>
                    <td>${(esRobux ? item.precio : item.precioVenta)?.toFixed(2)}</td>
                    <td><span className="badge badge-info">{item.estado?.nombreEstado || 'N/D'}</span></td>
                    <td>{item.fechaCompra ? new Date(item.fechaCompra).toLocaleDateString() : ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
