import { useVerInversionesController } from '../controllers/useVerInversionesController';
import HistorialInversionModal from '../components/HistorialInversionModal';
import { Search } from 'lucide-react';
import './Pages.css';

export default function VerInversiones() {
  const c = useVerInversionesController();

  return (
    <div className="page" data-testid="ver-inversiones-page">
      <div className="page-header">
        <h1 className="page-title" data-testid="ver-inversiones-title">Ver inversiones</h1>
        <p className="page-subtitle">Inversiones registradas por cliente</p>
      </div>

      {c.error && <div className="alert alert-error" data-testid="ver-inversiones-error">{c.error}</div>}

      <div className="panel" data-testid="panel-ver-inversiones">
        <div className="toolbar">
          <h2 className="panel-title" style={{ margin: 0 }}>Inversiones (<span data-testid="inversiones-count">{c.inversiones.length}</span>)</h2>
          <div className="search-input-wrapper">
            <Search size={16} />
            <input
              type="text"
              placeholder="Buscar por cliente..."
              value={c.filtro}
              onChange={(e) => c.setFiltro(e.target.value)}
              data-testid="input-filtro-inversiones"
            />
          </div>
        </div>

        {c.inversiones.length === 0 ? (
          <div className="data-table-empty">
            <div className="data-table-empty-icon">
              <Search size={32} />
            </div>
            <p className="data-table-empty-text">
              {c.filtro ? 'No se encontraron inversiones' : 'No hay inversiones registradas'}
            </p>
            <p className="data-table-empty-subtext">
              {c.filtro ? 'Prueba con otro nombre de cliente' : 'Las inversiones aparecerán aquí una vez registradas'}
            </p>
          </div>
        ) : (
          <table className="data-table" data-testid="tabla-inversiones">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Monto invertido</th>
              <th>% mensual</th>
              <th>Fecha de inicio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {c.inversiones.map((inv) => (
              <tr key={inv.idInversion} style={{ cursor: 'pointer' }} onClick={() => c.abrirModalHistorial(inv)}
                data-testid={`fila-inversion-${inv.idInversion}`}>
                <td>{inv.cliente?.nombreDiscord || 'N/D'}</td>
                <td data-testid={`inversion-monto-${inv.idInversion}`}>${inv.montoInvertido?.toFixed(2)}</td>
                <td>{inv.porcentajeMensual}%</td>
                <td>{inv.fechaInversionInicial}</td>
                <td>
                  <span className={c.estadoBadgeClass(inv.estadoInversion)} data-testid={`inversion-estado-${inv.idInversion}`}>{inv.estadoInversion}</span>
                </td>
                <td>
                  <button className="btn btn-primary btn-sm"
                    onClick={(e) => { e.stopPropagation(); c.abrirModalCapital(inv); }}
                    data-testid={`btn-capital-${inv.idInversion}`}>
                    + Capital
                  </button>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {c.modalCapital && (
        <div className="modal-overlay" onClick={c.cerrarModalCapital} data-testid="modal-capital">
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2>Agregar capital</h2>
              <button className="modal-close" onClick={c.cerrarModalCapital} data-testid="btn-cerrar-modal-capital">&times;</button>
            </div>
            <p style={{ color: '#8b949e', fontSize: '14px', marginBottom: '16px' }}>
              Inversión de <strong>{c.modalCapital.cliente?.nombreDiscord}</strong>
            </p>
            <form onSubmit={c.handleAgregarCapital} data-testid="form-agregar-capital">
              <div className="form-field" style={{ marginBottom: '16px' }}>
                <label htmlFor="montoCapital">Monto a agregar ($)</label>
                <input id="montoCapital" type="number" step="0.01" placeholder="50.00"
                  value={c.montoCapital} onChange={(e) => c.setMontoCapital(e.target.value)} autoFocus
                  data-testid="input-monto-capital" />
              </div>
              <button type="submit" className="btn btn-primary" data-testid="btn-agregar-capital">Agregar</button>
            </form>
          </div>
        </div>
      )}

      {c.modalHistorial && (
        <HistorialInversionModal
          idInversion={c.modalHistorial.idInversion}
          onClose={c.cerrarModalHistorial}
        />
      )}
    </div>
  );
}
