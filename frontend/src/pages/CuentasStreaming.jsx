import { useCuentasStreamingController } from '../controllers/useCuentasStreamingController';
import { Search } from 'lucide-react';
import './Pages.css';

export default function CuentasStreaming() {
  const c = useCuentasStreamingController();

  return (
    <div className="page" data-testid="cuentas-streaming-page">
      <div className="page-header">
        <h1 className="page-title" data-testid="cuentas-streaming-title">Cuentas Streaming</h1>
        <p className="page-subtitle">Administra el inventario de cuentas compradas</p>
      </div>

      <div className="panel" data-testid="panel-agregar-cuenta">
        <h2 className="panel-title">Agregar cuenta comprada</h2>
        {c.error && <div className="alert alert-error" data-testid="cuentas-streaming-error">{c.error}</div>}
        <form onSubmit={c.handleSubmit} data-testid="form-agregar-cuenta">
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="plataforma">Plataforma</label>
              <select id="plataforma" name="plataforma" value={c.form.plataforma} onChange={c.handleChange} data-testid="select-cuenta-plataforma">
                <option value="">Selecciona una plataforma</option>
                <option value="Netflix">Netflix</option>
                <option value="Disney+">Disney+</option>
                <option value="Spotify">Spotify</option>
                <option value="Crunchyroll">Crunchyroll</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="correo">Correo</label>
              <input id="correo" name="correo" type="email" placeholder="cuenta@correo.com"
                value={c.form.correo} onChange={c.handleChange} data-testid="input-cuenta-correo" />
              {c.correoDuplicado && (
                <p className="form-error-inline">Ya existe una cuenta con este correo y plataforma</p>
              )}
            </div>
            <div className="form-field">
              <label htmlFor="contrasena">Contraseña</label>
              <input id="contrasena" name="contrasena" type="password"
                value={c.form.contrasena} onChange={c.handleChange} data-testid="input-cuenta-contrasena" />
            </div>
            <div className="form-field">
              <label htmlFor="precioCompra">Precio de compra</label>
              <input id="precioCompra" name="precioCompra" type="number" step="0.01" placeholder="5.00"
                value={c.form.precioCompra} onChange={c.handleChange} data-testid="input-cuenta-precio" />
            </div>
            <div className="form-field">
              <label htmlFor="codigoMoneda">Moneda</label>
              <select id="codigoMoneda" name="codigoMoneda" value={c.form.codigoMoneda} onChange={c.handleChange} data-testid="select-cuenta-moneda">
                {c.monedas.map((m) => (
                  <option key={m.idMoneda} value={m.codigo}>{m.nombreMoneda} ({m.codigo})</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={c.guardando} data-testid="btn-guardar-cuenta">
            {c.guardando ? 'Guardando...' : 'Guardar cuenta'}
          </button>
        </form>
      </div>

      <div className="panel" data-testid="panel-inventario">
        <div className="toolbar">
          <h2 className="panel-title" style={{ margin: 0 }}>Cuentas del sistema (<span data-testid="cuentas-count">{c.cuentas.length}</span>)</h2>
          <div className="search-input-wrapper">
            <Search size={16} />
            <input
              type="text"
              placeholder="Buscar por plataforma o correo..."
              value={c.busqueda}
              onChange={(e) => c.setBusqueda(e.target.value)}
              data-testid="input-buscar-cuenta"
            />
          </div>
        </div>

        {c.cuentas.length === 0 ? (
          <div className="data-table-empty">
            <div className="data-table-empty-icon">
              <Search size={32} />
            </div>
            <p className="data-table-empty-text">
              {c.busqueda ? 'No se encontraron cuentas' : 'No hay cuentas registradas'}
            </p>
            <p className="data-table-empty-subtext">
              {c.busqueda ? 'Prueba con otros términos de búsqueda' : 'Agrega cuentas usando el formulario de arriba'}
            </p>
          </div>
        ) : (
          <table className="data-table" data-testid="tabla-cuentas">
            <thead>
              <tr>
                <th>Plataforma</th>
                <th>Correo</th>
                <th>Precio de compra</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {c.cuentas.map((cuenta) => (
                <tr key={cuenta.idCuentas} data-testid={`fila-cuenta-${cuenta.idCuentas}`}>
                  <td>{cuenta.plataforma}</td>
                  <td>{cuenta.correo}</td>
                  <td>${Number(cuenta.precioCompra).toFixed(2)}</td>
                  <td>
                    <button className="btn btn-danger btn-sm"
                      onClick={() => c.handleEliminar(cuenta.idCuentas)}
                      data-testid={`btn-eliminar-cuenta-${cuenta.idCuentas}`}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
