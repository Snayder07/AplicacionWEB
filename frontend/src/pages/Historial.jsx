import { useHistorialController } from '../controllers/useHistorialController';
import { Search, Pencil } from 'lucide-react';
import './Pages.css';

const COLORES_ESTADO_PEDIDO = {
  'anotada': { bg: 'rgba(248, 81, 73, 0.15)', color: '#f85149' },
  'tratamiento': { bg: 'rgba(210, 153, 34, 0.15)', color: '#d29922' },
  'finalizada': { bg: 'rgba(63, 185, 80, 0.15)', color: '#3fb950' },
  'reintegrada': { bg: 'rgba(255, 165, 0, 0.15)', color: '#ff8c00' },
};

function colorEstadoPedido(nombre) {
  return COLORES_ESTADO_PEDIDO[(nombre || '').toLowerCase()] || { bg: 'rgba(31, 111, 235, 0.15)', color: '#58a6ff' };
}

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
                <th>Plataforma/Método</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th style={{ width: 60 }}></th>
              </tr>
            </thead>
            <tbody>
              {c.historial.map((item) => {
                const key = item.idCompraRobux !== undefined
                  ? `r-${item.idCompraRobux}`
                  : `s-${item.idCompraStreaming}`;
                const esRobux = item.idCompraRobux !== undefined;
                const plataformaOMetodo = esRobux
                  ? item.metodoEntrega
                  : item.cuentaComprada?.plataforma || '—';
                const id = esRobux ? item.idCompraRobux : item.idCompraStreaming;
                return (
                  <tr key={key}>
                    <td>{item.cliente?.nombreDiscord || 'N/D'}</td>
                    <td>{esRobux ? 'Robux' : 'Streaming'}</td>
                    <td>{plataformaOMetodo}</td>
                    <td>${(esRobux ? item.precio : item.precioVenta)?.toFixed(2)}</td>
                    <td>
                      {c.editandoKey === key ? (
                        <select
                          value={item.estado?.codigo || ''}
                          onChange={(e) => c.handleCambiarEstado(key, esRobux, id, e.target.value)}
                          autoFocus
                          style={{ backgroundColor: '#0d1117', border: '1px solid #21262d', borderRadius: '4px', padding: '4px 8px', color: '#fff', fontSize: '12px' }}
                        >
                          {c.estados.map(est => (
                            <option key={est.idEstado} value={est.codigo}>{est.nombreEstado}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="badge" style={colorEstadoPedido(item.estado?.nombreEstado)}>
                          {item.estado?.nombreEstado || 'N/D'}
                        </span>
                      )}
                    </td>
                    <td>{item.fechaCompra ? new Date(item.fechaCompra).toLocaleDateString() : ''}</td>
                    <td>
                      <button onClick={() => c.setEditandoKey(c.editandoKey === key ? null : key)}
                        title="Editar estado" data-testid={`btn-editar-estado-${id}`}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#8b949e' }}>
                        <Pencil size={14} />
                      </button>
                    </td>
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
