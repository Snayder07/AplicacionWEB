import './Pages.css';

/*
  DASHBOARD
  ---------
  Por ahora estos datos son "mock" (inventados a mano), solo para que veas
  la página funcionando con una forma real. Cuando tu backend tenga un
  endpoint tipo GET /api/dashboard, reemplazamos este arreglo fijo por datos
  que vengan del servidor (usando useState + useEffect + fetch).

  Fíjate que es un arreglo de objetos: cada objeto es una tarjeta.
  Esto nos permite "recorrer" el arreglo con .map() en vez de escribir
  4 tarjetas iguales a mano.
*/
const resumen = [
  { label: 'Clientes totales', value: '128' },
  { label: 'Ventas Robux (mes)', value: '$540' },
  { label: 'Ventas Streaming (mes)', value: '$310' },
  { label: 'Inversiones activas', value: '14' },
];

const actividadReciente = [
  { cliente: 'kaka_gt', tipo: 'Robux', monto: '$12.50', estado: 'Completado' },
  { cliente: 'snayder07', tipo: 'Streaming', monto: '$8.00', estado: 'Pendiente' },
  { cliente: 'user_123', tipo: 'Inversión', monto: '$50.00', estado: 'Completado' },
  { cliente: 'leo_gg', tipo: 'Robux', monto: '$25.00', estado: 'Cancelado' },
];

// Función chiquita que decide qué color de "badge" (etiqueta) usar según el estado.
// La sacamos fuera del componente porque no depende de nada de React, es lógica pura.
function estadoBadgeClass(estado) {
  if (estado === 'Completado') return 'badge badge-success';
  if (estado === 'Pendiente') return 'badge badge-warning';
  return 'badge badge-danger';
}

export default function Dashboard() {
  return (
    // "page" viene de Pages.css. Cada página usa esta misma clase contenedora.
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Resumen general del negocio</p>
      </div>

      {/* ---- Tarjetas de resumen ---- */}
      <div className="cards-grid">
        {/*
          .map() recorre el arreglo "resumen" y por cada elemento devuelve
          un pedazo de JSX (una tarjeta). React necesita una prop "key"
          única en cada elemento repetido de una lista, por eso usamos
          item.label (aquí no se repiten, es un dato seguro para usar de key).
        */}
        {resumen.map((item) => (
          <div className="card" key={item.label}>
            <p className="card-label">{item.label}</p>
            <p className="card-value">{item.value}</p>
          </div>
        ))}
      </div>

      {/* ---- Tabla de actividad reciente ---- */}
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
            {actividadReciente.map((fila, index) => (
              // Aquí no tengo un id único real, así que uso el índice de la
              // lista como key. Está bien para listas que no cambian de orden;
              // cuando conectes datos reales del backend, usa el id de la BD.
              <tr key={index}>
                <td>{fila.cliente}</td>
                <td>{fila.tipo}</td>
                <td>{fila.monto}</td>
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
    </div>
  );
}
