import { useState } from 'react';
import './Pages.css';

/*
  CLIENTES
  --------
  Esta página ya es "interactiva": tiene un formulario para agregar un
  cliente nuevo, y la tabla se actualiza sola cuando agregas uno.

  Para eso usamos useState, el hook más importante de React:

    const [valor, setValor] = useState(valorInicial);

  - "valor" es el dato actual (aquí: la lista de clientes).
  - "setValor" es la ÚNICA forma correcta de cambiar ese dato.
    Nunca hagas clientes.push(...) directamente: React no se entera
    y la pantalla no se actualiza. Siempre usa el "set...".
  - Cuando llamas a setValor(...), React vuelve a dibujar (re-renderiza)
    el componente automáticamente con el nuevo valor.
*/

const clientesIniciales = [
  { id: 1, nombreDiscord: 'kaka_gt', idDiscord: '839201923', fecha: '2025-06-01' },
  { id: 2, nombreDiscord: 'snayder07', idDiscord: '712834991', fecha: '2025-06-03' },
  { id: 3, nombreDiscord: 'leo_gg', idDiscord: '918273645', fecha: '2025-06-10' },
];

export default function Clientes() {
  // Lista de clientes que se muestra en la tabla.
  const [clientes, setClientes] = useState(clientesIniciales);

  // Estos dos guardan lo que el usuario va escribiendo en el formulario.
  const [nombreDiscord, setNombreDiscord] = useState('');
  const [idDiscord, setIdDiscord] = useState('');

  // Esta función se ejecuta cuando el usuario aprieta "Agregar cliente".
  function handleAgregarCliente(e) {
    // e.preventDefault() evita que el <form> recargue la página entera,
    // que es el comportamiento por defecto de un form en HTML puro.
    e.preventDefault();

    // Validación mínima: que no esté vacío.
    if (!nombreDiscord.trim() || !idDiscord.trim()) return;

    const nuevoCliente = {
      id: clientes.length + 1, // cuando venga del backend, el id lo pone la BD
      nombreDiscord,
      idDiscord,
      fecha: new Date().toISOString().slice(0, 10), // "AAAA-MM-DD" de hoy
    };

    // "...clientes" copia todos los clientes que ya había, y le agregamos
    // el nuevo al final. Esto es porque en React NUNCA modificamos el
    // arreglo original directamente, siempre creamos uno nuevo.
    setClientes([...clientes, nuevoCliente]);

    // Limpiamos el formulario para que quede listo para el siguiente cliente.
    setNombreDiscord('');
    setIdDiscord('');

    // NOTA: cuando conectes esto a Spring Boot, aquí en vez de solo hacer
    // setClientes(...) local, harías:
    //   fetch('http://localhost:8080/api/clientes', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ nombreDiscord, idDiscord })
    //   })
    //   luego actualizarías el estado con la respuesta real del servidor.
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Clientes</h1>
        <p className="page-subtitle">Gestiona los clientes registrados</p>
      </div>

      {/* ---- Formulario para agregar un cliente ---- */}
      <div className="panel">
        <h2 className="panel-title">Agregar nuevo cliente</h2>
        <form onSubmit={handleAgregarCliente}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="nombreDiscord">Nombre en Discord</label>
              <input
                id="nombreDiscord"
                type="text"
                placeholder="ej. kaka_gt"
                value={nombreDiscord}
                // Cada vez que el usuario escribe una letra, este evento se
                // dispara y actualizamos el estado con lo que hay en el input.
                onChange={(e) => setNombreDiscord(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="idDiscord">ID de Discord</label>
              <input
                id="idDiscord"
                type="text"
                placeholder="ej. 839201923"
                value={idDiscord}
                onChange={(e) => setIdDiscord(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Agregar cliente
          </button>
        </form>
      </div>

      {/* ---- Tabla de clientes ---- */}
      <div className="panel">
        <h2 className="panel-title">Lista de clientes ({clientes.length})</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre Discord</th>
              <th>ID Discord</th>
              <th>Fecha de creación</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.nombreDiscord}</td>
                <td>{cliente.idDiscord}</td>
                <td>{cliente.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
