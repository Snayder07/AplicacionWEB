import { useState } from 'react';
import { post } from '../api';
import './Pages.css';

const estadoInicialForm = {
  nombreCliente: '',
  montoInvertido: '',
  porcentajeMensual: '',
  fechaInversionInicial: '',
};

export default function NuevaInversion() {
  const [form, setForm] = useState(estadoInicialForm);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombreCliente.trim() || !form.montoInvertido) return;
    setMensaje('');
    setError('');
    try {
      await post('/inversiones', {
        nombreCliente: form.nombreCliente.trim(),
        montoInvertido: Number(form.montoInvertido),
        porcentajeMensual: Number(form.porcentajeMensual),
        fechaInversionInicial: form.fechaInversionInicial,
      });
      setMensaje(`Inversión registrada para "${form.nombreCliente}" por $${form.montoInvertido}.`);
      setForm(estadoInicialForm);
    } catch (err) {
      setError('Error al registrar inversión: ' + err.message);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Nueva inversión</h1>
        <p className="page-subtitle">Registra una nueva inversión de un cliente</p>
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
              <label htmlFor="montoInvertido">Monto invertido ($)</label>
              <input id="montoInvertido" name="montoInvertido" type="number" step="0.01" placeholder="100.00"
                value={form.montoInvertido} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="porcentajeMensual">Porcentaje mensual (%)</label>
              <input id="porcentajeMensual" name="porcentajeMensual" type="number" step="0.01" placeholder="10"
                value={form.porcentajeMensual} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="fechaInversionInicial">Fecha de inicio</label>
              <input id="fechaInversionInicial" name="fechaInversionInicial" type="date"
                value={form.fechaInversionInicial} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Registrar inversión</button>
        </form>

        {mensaje && (
          <p style={{ color: '#3fb950', marginTop: '16px', fontSize: '14px' }}>{mensaje}</p>
        )}
        {error && (
          <p style={{ color: '#f85149', marginTop: '16px', fontSize: '14px' }}>{error}</p>
        )}
      </div>
    </div>
  );
}
