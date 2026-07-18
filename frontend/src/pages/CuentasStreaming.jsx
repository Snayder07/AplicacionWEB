import { useState } from 'react';
import './Pages.css';

const estadoInicialForm = { plataforma: '', correo: '', contrasena: '', precioCompra: '' };

const cuentasIniciales = [
  { id: 1, plataforma: 'Netflix', correo: 'cuenta1@correo.com', precioCompra: 5.0 },
  { id: 2, plataforma: 'Disney+', correo: 'cuenta2@correo.com', precioCompra: 4.0 },
];

export default function CuentasStreaming() {
  const [cuentas, setCuentas] = useState(cuentasIniciales);
  const [form, setForm] = useState(estadoInicialForm);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.plataforma.trim() || !form.correo.trim()) return;

    setCuentas([...cuentas, { ...form, id: cuentas.length + 1 }]);
    setForm(estadoInicialForm);
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
              <tr key={c.id}>
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
