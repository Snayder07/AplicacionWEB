import './Pages.css';

/*
  VER INVERSIONES
  ---------------
  Esta página no tiene formulario, solo muestra datos (por ahora mock).
  Es el ejemplo más simple: una tabla que recorre un arreglo con .map().
  Cuando conectes el backend, esto se vuelve una página con useState +
  useEffect que carga los datos con fetch al montar el componente, en vez
  de tener el arreglo escrito a mano.
*/

const inversiones = [
  { id: 1, cliente: 'kaka_gt', monto: 100.0, porcentaje: 10, inicio: '2025-05-01', estado: 'Activa' },
  { id: 2, cliente: 'snayder07', monto: 250.0, porcentaje: 8, inicio: '2025-04-15', estado: 'Activa' },
  { id: 3, cliente: 'leo_gg', monto: 50.0, porcentaje: 12, inicio: '2025-03-20', estado: 'Finalizada' },
];

function estadoBadgeClass(estado) {
  return estado === 'Activa' ? 'badge badge-success' : 'badge badge-warning';
}

export default function VerInversiones() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Ver inversiones</h1>
        <p className="page-subtitle">Inversiones registradas por cliente</p>
      </div>

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Monto invertido</th>
              <th>% mensual</th>
              <th>Fecha de inicio</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {inversiones.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.cliente}</td>
                <td>${inv.monto.toFixed(2)}</td>
                <td>{inv.porcentaje}%</td>
                <td>{inv.inicio}</td>
                <td>
                  <span className={estadoBadgeClass(inv.estado)}>{inv.estado}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
