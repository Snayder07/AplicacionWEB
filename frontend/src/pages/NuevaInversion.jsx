import { useState } from 'react';
import './Pages.css';

const estadoInicialForm = {
  cliente: '',
  montoInvertido: '',
  porcentajeMensual: '',
  fechaInversionInicial: '',
};

export default function NuevaInversion() {
  const [form, setForm] = useState(estadoInicialForm);
  const [mensaje, setMensaje] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.cliente.trim() || !form.montoInvertido) return;

    // Por ahora solo mostramos un mensaje de confirmación en pantalla.
    // Cuando conectes el backend, aquí harías el fetch POST a /api/inversiones
    // y este mensaje reflejaría la respuesta real (éxito o error).
    setMensaje(`Inversión registrada para "${form.cliente}" por $${form.montoInvertido}.`);
    setForm(estadoInicialForm);
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
              <label htmlFor="cliente">Cliente (nombre Discord)</label>
              <input id="cliente" name="cliente" type="text" placeholder="ej. kaka_gt"
                value={form.cliente} onChange={handleChange} />
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

        {/* Este mensaje solo aparece si "mensaje" no está vacío (renderizado condicional) */}
        {mensaje && (
          <p style={{ color: '#3fb950', marginTop: '16px', fontSize: '14px' }}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
}
