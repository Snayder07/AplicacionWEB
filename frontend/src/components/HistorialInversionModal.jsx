import { useHistorialInversionController } from '../controllers/useHistorialInversionController';

export default function HistorialInversionModal({ idInversion, onClose }) {
  const { movimientos, cargando, error } = useHistorialInversionController(idInversion);

  return (
    <div className="modal-overlay" onClick={onClose} data-testid="modal-historial">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Historial de inversión</h2>
          <button className="modal-close" onClick={onClose} data-testid="btn-cerrar-historial">&times;</button>
        </div>

        {cargando && <p style={{ color: '#8b949e' }}>Cargando historial...</p>}
        {error && <p style={{ color: '#f85149' }} data-testid="historial-modal-error">{error}</p>}

        {!cargando && !error && movimientos.length === 0 && (
          <p style={{ color: '#8b949e' }}>No hay movimientos registrados.</p>
        )}

        {movimientos.length > 0 && (
          <table className="data-table" data-testid="tabla-historial-modal">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Monto anterior</th>
                <th>Monto actual</th>
                <th>Monto generado</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((m) => (
                <tr key={m.idHistorialInv}>
                  <td>{m.fechaCumplida ? new Date(m.fechaCumplida).toLocaleDateString() : ''}</td>
                  <td>${m.montoAnterior?.toFixed(2)}</td>
                  <td>${m.montoActual?.toFixed(2)}</td>
                  <td style={{ color: m.montoGenerado > 0 ? '#3fb950' : '#8b949e' }}>
                    {m.montoGenerado > 0 ? '+' : ''}${m.montoGenerado?.toFixed(2)}
                  </td>
                  <td>{m.agregado === 'S' ? 'Capital adicional' : 'Rendimiento'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
