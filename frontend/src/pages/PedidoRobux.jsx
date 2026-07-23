import { usePedidoRobuxController } from '../controllers/usePedidoRobuxController';
import SelectorCliente from '../components/SelectorCliente';
import SelectorEstado from '../components/SelectorEstado';
import { Search } from 'lucide-react';
import './Pages.css';

export default function PedidoRobux() {
  const c = usePedidoRobuxController();

  return (
    <div className="page" data-testid="robux-page">
      <div className="page-header">
        <h1 className="page-title" data-testid="robux-title">Nuevo pedido de Robux</h1>
        <p className="page-subtitle">Registra la venta de Robux a un cliente</p>
      </div>

      <div className="panel" data-testid="panel-nuevo-robux">
        {c.error && <div className="alert alert-error" data-testid="robux-error">{c.error}</div>}
        <form onSubmit={c.handleSubmit} data-testid="form-robux">
          <div className="form-grid">
            <SelectorCliente value={c.form.nombreCliente} onChange={c.handleChange} required />

            {!c.esGamepass && (
              <div className="form-field">
                <label htmlFor="usuarioRoblox">Usuario de Roblox</label>
                <input id="usuarioRoblox" name="usuarioRoblox" type="text" placeholder="ej. player123"
                  value={c.form.usuarioRoblox} onChange={c.handleChange} data-testid="input-robux-usuario" />
              </div>
            )}

            {c.esGamepass && (
              <div className="form-field">
                <label htmlFor="clave">Link de Gamepass</label>
                <input id="clave" name="clave" type="text" placeholder="https://www.roblox.com/game-pass/..."
                  value={c.form.clave} onChange={c.handleChange} data-testid="input-robux-clave" />
              </div>
            )}

            <div className="form-field">
              <label htmlFor="cantidadRobux">Cantidad de Robux</label>
              <input id="cantidadRobux" name="cantidadRobux" type="number" placeholder="1000"
                value={c.form.cantidadRobux} onChange={c.handleChange} data-testid="input-robux-cantidad" />
            </div>

            <div className="form-field">
              <label htmlFor="precio">Precio</label>
              <input id="precio" name="precio" type="number" step="0.01" placeholder="12.50"
                value={c.form.precio} onChange={c.handleChange} data-testid="input-robux-precio" />
            </div>

            <div className="form-field">
              <label htmlFor="metodoEntrega">Método de entrega</label>
              <select id="metodoEntrega" name="metodoEntrega" value={c.form.metodoEntrega} onChange={c.handleChange} data-testid="select-robux-metodo">
                <option value="">Selecciona un método</option>
                <option value="Gamepass">Gamepass</option>
                <option value="Grupo">Grupo</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="codigoMoneda">Moneda</label>
              <select id="codigoMoneda" name="codigoMoneda" value={c.form.codigoMoneda} onChange={c.handleChange} data-testid="select-robux-moneda">
                {c.monedas.map((m) => (
                  <option key={m.idMoneda} value={m.codigo}>{m.nombreMoneda} ({m.codigo})</option>
                ))}
              </select>
            </div>

            <SelectorEstado value={c.form.codigoEstado} onChange={c.handleChange} />
          </div>

          <button type="submit" className="btn btn-primary" disabled={c.guardando} data-testid="btn-registrar-robux">
            {c.guardando ? 'Guardando...' : 'Registrar pedido'}
          </button>
        </form>
      </div>

      <div className="panel" data-testid="panel-lista-robux">
        <h2 className="panel-title">Pedidos registrados (<span data-testid="robux-count">{c.pedidos.length}</span>)</h2>

        {c.pedidos.length === 0 ? (
          <div className="data-table-empty">
            <div className="data-table-empty-icon">
              <Search size={32} />
            </div>
            <p className="data-table-empty-text">No hay pedidos registrados</p>
            <p className="data-table-empty-subtext">Los pedidos aparecerán aquí una vez registrados</p>
          </div>
        ) : (
          <table className="data-table" data-testid="tabla-robux">
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
              {c.pedidos.map((p) => (
                <tr key={p.idCompraRobux} data-testid={`fila-robux-${p.idCompraRobux}`}>
                  <td>{p.cliente?.nombreDiscord || 'N/D'}</td>
                  <td title={p.metodoEntrega === 'gp' ? p.clave : ''}>
                    {p.metodoEntrega === 'gp' ? (p.clave ? p.clave.substring(0, 40) + (p.clave.length > 40 ? '...' : '') : 'N/D') : p.usuarioRoblox}
                  </td>
                  <td>{p.cantidadRobux}</td>
                  <td>${p.precio}</td>
                  <td>{p.metodoEntrega}</td>
                  <td><span className="badge badge-warning">{p.estado?.nombreEstado || 'N/D'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
