import { useState, useEffect } from 'react';
import { get, post } from '../api';
import './Pages.css';

const estadoInicialForm = {
  nombreCliente: '',
  usuarioRoblox: '',
  cantidadRobux: '',
  precio: '',
  metodoEntrega: '',
};

export default function PedidoRobux() {
  const [form, setForm] = useState(estadoInicialForm);
  const [pedidos, setPedidos] = useState([]);

  const cargarPedidos = () => {
    get('/pedidos/robux').then(setPedidos).catch(() => {});
  };

  useEffect(() => { cargarPedidos(); }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombreCliente.trim() || !form.usuarioRoblox.trim()) return;
    try {
      await post('/pedidos/robux', {
        nombreCliente: form.nombreCliente.trim(),
        usuarioRoblox: form.usuarioRoblox.trim(),
        cantidadRobux: Number(form.cantidadRobux),
        precio: Number(form.precio),
        metodoEntrega: form.metodoEntrega,
        codigoMoneda: 'USD',
      });
      setForm(estadoInicialForm);
      cargarPedidos();
    } catch (err) {
      alert('Error al registrar pedido: ' + err.message);
    }
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
              <label htmlFor="nombreCliente">Cliente (nombre Discord)</label>
              <input id="nombreCliente" name="nombreCliente" type="text" placeholder="ej. kaka_gt"
                value={form.nombreCliente} onChange={handleChange} />
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
        <h2 className="panel-title">Pedidos registrados ({pedidos.length})</h2>
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
              <tr key={p.idCompraRobux}>
                <td>{p.cliente?.nombreDiscord || 'N/D'}</td>
                <td>{p.usuarioRoblox}</td>
                <td>{p.cantidadRobux}</td>
                <td>${p.precio}</td>
                <td>{p.metodoEntrega}</td>
                <td><span className="badge badge-warning">{p.estado?.nombreEstado || 'N/D'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
