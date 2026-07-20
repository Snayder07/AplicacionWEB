import { useState, useEffect } from 'react';
import { get, post } from '../api';
import './Pages.css';

const estadoInicialForm = { plataforma: '', correo: '', contrasena: '', precioCompra: '' };

export default function CuentasStreaming() {
  const [cuentas, setCuentas] = useState([]);
  const [form, setForm] = useState(estadoInicialForm);

  const cargarCuentas = () => {
    get('/cuentas-streaming').then(setCuentas).catch(() => {});
  };

  useEffect(() => { cargarCuentas(); }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.plataforma.trim() || !form.correo.trim()) return;
    try {
      await post('/cuentas-streaming', {
        plataforma: form.plataforma.trim(),
        correo: form.correo.trim(),
        contrasena: form.contrasena,
        precioCompra: Number(form.precioCompra),
        codigoMoneda: 'USD',
      });
      setForm(estadoInicialForm);
      cargarCuentas();
    } catch (err) {
      alert('Error al guardar cuenta: ' + err.message);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Cuentas Streaming</h1>
        <p className="page-subtitle">Administra el inventario de cuentas compradas</p>
      </div>

      <div className="panel">
        <h2 className="panel-title">Agregar cuenta comprada</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="plataforma">Plataforma</label>
              <input id="plataforma" name="plataforma" type="text" placeholder="ej. Netflix"
                value={form.plataforma} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="correo">Correo</label>
              <input id="correo" name="correo" type="email" placeholder="cuenta@correo.com"
                value={form.correo} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="contrasena">Contraseña</label>
              <input id="contrasena" name="contrasena" type="password"
                value={form.contrasena} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="precioCompra">Precio de compra ($)</label>
              <input id="precioCompra" name="precioCompra" type="number" step="0.01" placeholder="5.00"
                value={form.precioCompra} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Guardar cuenta</button>
        </form>
      </div>

      <div className="panel">
        <h2 className="panel-title">Inventario ({cuentas.length})</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Plataforma</th>
              <th>Correo</th>
              <th>Precio de compra</th>
            </tr>
          </thead>
          <tbody>
            {cuentas.map((c) => (
              <tr key={c.idCuentas}>
                <td>{c.plataforma}</td>
                <td>{c.correo}</td>
                <td>${Number(c.precioCompra).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
