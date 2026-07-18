import './Pages.css';

const historial = [
  { id: 1, cliente: 'kaka_gt', montoAnterior: 100.0, montoActual: 110.0, montoGenerado: 10.0, fecha: '2025-06-01' },
  { id: 2, cliente: 'snayder07', montoAnterior: 250.0, montoActual: 270.0, montoGenerado: 20.0, fecha: '2025-06-01' },
];

export default function Historial() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Historial de inversiones</h1>
        <p className="page-subtitle">Pagos y movimientos generados por cada inversión</p>
      </div>

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Monto anterior</th>
              <th>Monto actual</th>
              <th>Monto generado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((h) => (
              <tr key={h.id}>
                <td>{h.cliente}</td>
                <td>${h.montoAnterior.toFixed(2)}</td>
                <td>${h.montoActual.toFixed(2)}</td>
                <td style={{ color: '#3fb950' }}>+${h.montoGenerado.toFixed(2)}</td>
                <td>{h.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
