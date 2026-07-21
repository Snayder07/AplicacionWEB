import { useNuevaInversionController } from '../controllers/useNuevaInversionController';
import SelectorCliente from '../components/SelectorCliente';
import './Pages.css';

export default function NuevaInversion() {
  const c = useNuevaInversionController();

  return (
    <div className="page" data-testid="nueva-inversion-page">
      <div className="page-header">
        <h1 className="page-title" data-testid="nueva-inversion-title">Nueva inversión</h1>
        <p className="page-subtitle">Registra una nueva inversión de un cliente</p>
      </div>

      <div className="panel" data-testid="panel-nueva-inversion">
        {c.error && <div className="alert alert-error" data-testid="nueva-inversion-error">{c.error}</div>}
        {c.mensaje && <div className="alert alert-success" data-testid="inversion-exito">{c.mensaje}</div>}

        <form onSubmit={c.handleSubmit} data-testid="form-nueva-inversion">
          <div className="form-grid">
            <SelectorCliente value={c.form.nombreCliente} onChange={c.handleChange} required />

            <div className="form-field">
              <label htmlFor="montoInvertido">Monto invertido ($)</label>
              <input id="montoInvertido" name="montoInvertido" type="number" step="0.01" placeholder="100.00"
                value={c.form.montoInvertido} onChange={c.handleChange} data-testid="input-inversion-monto" />
            </div>

            <div className="form-field">
              <label htmlFor="porcentajeMensual">Porcentaje mensual (%)</label>
              <input id="porcentajeMensual" name="porcentajeMensual" type="number" step="0.01" placeholder="10"
                value={c.form.porcentajeMensual} onChange={c.handleChange} data-testid="input-inversion-porcentaje" />
            </div>

            <div className="form-field">
              <label htmlFor="fechaInversionInicial">Fecha de inicio</label>
              <input id="fechaInversionInicial" name="fechaInversionInicial" type="date"
                value={c.form.fechaInversionInicial} onChange={c.handleChange} data-testid="input-inversion-fecha" />
            </div>

            <div className="form-field">
              <label htmlFor="estadoInversion">Estado de la inversión</label>
              <select id="estadoInversion" name="estadoInversion" value={c.form.estadoInversion} onChange={c.handleChange} data-testid="select-inversion-estado">
                <option value="activa">Activa</option>
                <option value="pausada">Pausada</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={c.cargando} data-testid="btn-registrar-inversion">
            {c.cargando ? 'Guardando...' : 'Registrar inversión'}
          </button>
        </form>
      </div>
    </div>
  );
}
