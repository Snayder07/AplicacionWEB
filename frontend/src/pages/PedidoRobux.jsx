import { useState } from 'react';
import './Pages.css';

const estadoInicialForm = {
  cliente: '',
  usuarioRoblox: '',
  cantidadRobux: '',
  precio: '',
  metodoEntrega: '',
};

export default function PedidoRobux() {
  const [form, setForm] = useState(estadoInicialForm);
  const [pedidos, setPedidos] = useState([]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.cliente.trim() || !form.usuarioRoblox.trim()) return;

    setPedidos([...pedidos, { ...form, id: pedidos.length + 1, estado: 'Pendiente' }]);
    setForm(estadoInicialForm);

    // Aquí luego iría el fetch POST a /api/compras-robux
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Nuevo pedido de Robux</h1>
        <p className="page-subtitle">Registra la venta de Robux a un cliente</p>
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
              <label htmlFor="usuarioRoblox">Usuario de Roblox</label>
              <input id="usuarioRoblox" name="usuarioRoblox" type="text" placeholder="ej. player123"
                value={form.usuarioRoblox} onChange={handleChange} />
            </div>

            <div className="form-field">
              <label htmlFor="cantidadRobux">Cantidad de Robux</label>
              <input id="cantidadRobux" name="cantidadRobux" type="number" placeholder="1000"
                value={form.cantidadRobux} onChange={handleChange} />
            </div>

            <div className="form-field">
              <label htmlFor="precio">Precio ($)</label>
              <input id="precio" name="precio" type="number" step="0.01" placeholder="12.50"
                value={form.precio} onChange={handleChange} />
            </div>

            <div className="form-field">
              <label htmlFor="metodoEntrega">Método de entrega</label>
              <select id="metodoEntrega" name="metodoEntrega" value={form.metodoEntrega} onChange={handleChange}>
                <option value="">Selecciona un método</option>
                <option value="Gamepass">Gamepass</option>
                <option value="Grupo">Grupo</option>
              </select>
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
              <th>Usuario Roblox</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Entrega</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id}>
                <td>{p.cliente}</td>
                <td>{p.usuarioRoblox}</td>
                <td>{p.cantidadRobux}</td>
                <td>${p.precio}</td>
                <td>{p.metodoEntrega}</td>
                <td><span className="badge badge-warning">{p.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
