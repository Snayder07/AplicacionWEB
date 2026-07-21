import { useClientesController } from '../controllers/useClientesController';
import { Search, Users } from 'lucide-react';
import './Pages.css';

export default function Clientes() {
  const c = useClientesController();

  return (
    <div className="page" data-testid="clientes-page">
      <div className="page-header">
        <h1 className="page-title" data-testid="clientes-title">Clientes</h1>
        <p className="page-subtitle">Gestiona los clientes registrados</p>
      </div>

      <div className="panel" data-testid="panel-agregar-cliente">
        <h2 className="panel-title">Agregar nuevo cliente</h2>
        {c.error && <div className="alert alert-error" data-testid="clientes-error">{c.error}</div>}
        <form onSubmit={c.handleAgregarCliente} data-testid="form-agregar-cliente">
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="nombreDiscord">Nombre en Discord</label>
              <input id="nombreDiscord" type="text" placeholder="ej. kaka_gt"
                value={c.nombreDiscord} onChange={(e) => c.setNombreDiscord(e.target.value)}
                data-testid="input-nombre-discord" />
            </div>
            <div className="form-field">
              <label htmlFor="idDiscord">ID de Discord</label>
              <input id="idDiscord" type="text" placeholder="ej. 839201923"
                value={c.idDiscord} onChange={(e) => c.setIdDiscord(e.target.value)}
                data-testid="input-id-discord" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" data-testid="btn-agregar-cliente">Agregar cliente</button>
        </form>
      </div>

      <div className="panel" data-testid="panel-lista-clientes">
        <div className="toolbar">
          <h2 className="panel-title" style={{ margin: 0 }}>Lista de clientes (<span data-testid="clientes-count">{c.clientes.length}</span>)</h2>
          <div className="search-input-wrapper">
            <Search size={16} />
            <input
              type="text"
              placeholder="Buscar por ID Discord..."
              value={c.filtro}
              onChange={(e) => c.setFiltro(e.target.value)}
              data-testid="input-filtro-clientes"
            />
          </div>
        </div>

        {c.clientes.length === 0 ? (
          <div className="data-table-empty">
            <div className="data-table-empty-icon">
              <Users size={32} />
            </div>
            <p className="data-table-empty-text">
              {c.filtro ? 'No se encontraron clientes' : 'No hay clientes registrados'}
            </p>
            <p className="data-table-empty-subtext">
              {c.filtro ? 'Prueba con otro ID de Discord' : 'Agrega clientes usando el formulario de arriba'}
            </p>
          </div>
        ) : (
          <table className="data-table" data-testid="tabla-clientes">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre Discord</th>
                <th>ID Discord</th>
                <th>Fecha de creación</th>
              </tr>
            </thead>
            <tbody>
              {c.clientes.map((cliente) => (
                <tr key={cliente.idCliente} data-testid={`fila-cliente-${cliente.idCliente}`}>
                  <td>{cliente.idCliente}</td>
                  <td>{cliente.nombreDiscord}</td>
                  <td>{cliente.idDiscord}</td>
                  <td>{cliente.fechaCreacion ? new Date(cliente.fechaCreacion).toLocaleDateString() : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
