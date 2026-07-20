import { useState, useEffect } from 'react';
import { get, post } from '../api';
import './Pages.css';

const estadoInicialForm = {
  nombreCliente: '',
  plataforma: '',
  correo: '',
  contrasena: '',
  fechaVencimiento: '',
  precioVenta: '',
};

export default function PedidoStreaming() {
  const [form, setForm] = useState(estadoInicialForm);
  const [pedidos, setPedidos] = useState([]);

  const cargarPedidos = () => {
    get('/pedidos/streaming').then(setPedidos).catch(() => {});
  };

  useEffect(() => { cargarPedidos(); }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombreCliente.trim() || !form.correo.trim()) return;
    try {
      await post('/pedidos/streaming', {
        nombreCliente: form.nombreCliente.trim(),
        plataforma: form.plataforma,
        correo: form.correo.trim(),
        contrasena: form.contrasena,
        fechaVencimiento: form.fechaVencimiento,
        precioVenta: Number(form.precioVenta),
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
        <h1 className="page-title">Nuevo pedido de Streaming</h1>
        <p className="page-subtitle">Registra la venta de una cuenta de streaming</p>
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
              <label htmlFor="contrasena">Contraseña</label>
              <input id="contrasena" name="contrasena" type="password"
                value={form.contrasena} onChange={handleChange} />
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
        <h2 className="panel-title">Pedidos registrados ({pedidos.length})</h2>
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
              <tr key={p.idCompraStreaming}>
                <td>{p.cliente?.nombreDiscord || 'N/D'}</td>
                <td>{p.cuentaComprada?.plataforma || 'N/D'}</td>
                <td>{p.cuentaComprada?.correo || 'N/D'}</td>
                <td>{p.fechaVencimiento || ''}</td>
                <td>${p.precioVenta}</td>
                <td><span className="badge badge-warning">{p.estado?.nombreEstado || 'N/D'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
