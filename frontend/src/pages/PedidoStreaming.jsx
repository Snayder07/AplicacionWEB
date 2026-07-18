import { useState } from 'react';
import './Pages.css';

/*
  PEDIDO STREAMING
  ----------------
  Mismo patrón que Clientes.jsx: un formulario controlado por useState.
  La diferencia es que aquí en vez de un solo objeto con 2 campos, tenemos
  varios campos, así que guardamos TODO el formulario en un solo objeto
  de estado en vez de una variable de estado por campo. Es más cómodo
  cuando el formulario crece.
*/

const estadoInicialForm = {
  cliente: '',
  plataforma: '',
  correo: '',
  fechaVencimiento: '',
  precioVenta: '',
};

export default function PedidoStreaming() {
  const [form, setForm] = useState(estadoInicialForm);
  const [pedidos, setPedidos] = useState([]);

  // Un solo manejador para TODOS los inputs: usamos el atributo "name" del
  // input para saber qué campo del objeto "form" hay que actualizar.
  // "...form" copia los demás campos tal cual y solo pisamos el que cambió.
  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.cliente.trim() || !form.correo.trim()) return;

    setPedidos([...pedidos, { ...form, id: pedidos.length + 1, estado: 'Pendiente' }]);
    setForm(estadoInicialForm); // limpiamos el formulario

    // Aquí luego iría el fetch POST a /api/compras-streaming
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Nuevo pedido de Streaming</h1>
        <p className="page-subtitle">Registra la venta de una cuenta de streaming</p>
      </div>

      <div className="panel">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="cliente">Cliente (nombre Discord)</label>
              <input id="cliente" name="cliente" type="text" placeholder="ej. kaka_gt"
                value={form.cliente} onChange={handleChange} />
            </div>

            <div className="form-field">
              <label htmlFor="plataforma">Plataforma</label>
              <select id="plataforma" name="plataforma" value={form.plataforma} onChange={handleChange}>
                <option value="">Selecciona una plataforma</option>
                <option value="Netflix">Netflix</option>
                <option value="Disney+">Disney+</option>
                <option value="Spotify">Spotify</option>
                <option value="Crunchyroll">Crunchyroll</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="correo">Correo de la cuenta</label>
              <input id="correo" name="correo" type="email" placeholder="cuenta@correo.com"
                value={form.correo} onChange={handleChange} />
            </div>

            <div className="form-field">
              <label htmlFor="fechaVencimiento">Fecha de vencimiento</label>
              <input id="fechaVencimiento" name="fechaVencimiento" type="date"
                value={form.fechaVencimiento} onChange={handleChange} />
            </div>

            <div className="form-field">
              <label htmlFor="precioVenta">Precio de venta ($)</label>
              <input id="precioVenta" name="precioVenta" type="number" step="0.01" placeholder="8.00"
                value={form.precioVenta} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">Registrar pedido</button>
        </form>
      </div>

      <div className="panel">
        <h2 className="panel-title">Pedidos registrados en esta sesión ({pedidos.length})</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Plataforma</th>
              <th>Correo</th>
              <th>Vence</th>
              <th>Precio</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id}>
                <td>{p.cliente}</td>
                <td>{p.plataforma}</td>
                <td>{p.correo}</td>
                <td>{p.fechaVencimiento}</td>
                <td>${p.precioVenta}</td>
                <td><span className="badge badge-warning">{p.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
