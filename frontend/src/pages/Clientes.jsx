import { useState, useEffect } from 'react';
import { get, post } from '../api';
import './Pages.css';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nombreDiscord, setNombreDiscord] = useState('');
  const [idDiscord, setIdDiscord] = useState('');

  const cargarClientes = () => {
    get('/clientes').then(setClientes).catch(() => {});
  };

  useEffect(() => { cargarClientes(); }, []);

  async function handleAgregarCliente(e) {
    e.preventDefault();
    if (!nombreDiscord.trim() || !idDiscord.trim()) return;
    try {
      await post('/clientes', {
        nombreDiscord: nombreDiscord.trim(),
        idDiscord: Number(idDiscord.trim()),
      });
      setNombreDiscord('');
      setIdDiscord('');
      cargarClientes();
    } catch (err) {
      alert('Error al crear cliente: ' + err.message);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Clientes</h1>
        <p className="page-subtitle">Gestiona los clientes registrados</p>
      </div>

      <div className="panel">
        <h2 className="panel-title">Agregar nuevo cliente</h2>
        <form onSubmit={handleAgregarCliente}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="nombreDiscord">Nombre en Discord</label>
              <input id="nombreDiscord" type="text" placeholder="ej. kaka_gt"
                value={nombreDiscord} onChange={(e) => setNombreDiscord(e.target.value)} />
            </div>
            <div className="form-field">
              <label htmlFor="idDiscord">ID de Discord</label>
              <input id="idDiscord" type="text" placeholder="ej. 839201923"
                value={idDiscord} onChange={(e) => setIdDiscord(e.target.value)} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Agregar cliente</button>
        </form>
      </div>

      <div className="panel">
        <h2 className="panel-title">Lista de clientes ({clientes.length})</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre Discord</th>
              <th>ID Discord</th>
              <th>Fecha de creación</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.idCliente}>
                <td>{cliente.idCliente}</td>
                <td>{cliente.nombreDiscord}</td>
                <td>{cliente.idDiscord}</td>
                <td>{cliente.fechaCreacion ? new Date(cliente.fechaCreacion).toLocaleDateString() : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
