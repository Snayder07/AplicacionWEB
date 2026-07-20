import { useState, useEffect } from 'react';
import { get } from '../api';
import './Pages.css';

export default function Historial() {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    get('/historial/pedidos?tipo=General').then(setHistorial).catch(() => {});
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Historial de pedidos</h1>
        <p className="page-subtitle">Todos los pedidos registrados en el sistema</p>
      </div>

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Tipo</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((item) => {
              const esRobux = item.idCompraRobux !== undefined;
              return (
                <tr key={esRobux ? `r-${item.idCompraRobux}` : `s-${item.idCompraStreaming}`}>
                  <td>{item.cliente?.nombreDiscord || 'N/D'}</td>
                  <td>{esRobux ? 'Robux' : 'Streaming'}</td>
                  <td>${(esRobux ? item.precio : item.precioVenta)?.toFixed(2)}</td>
                  <td><span className="badge badge-info">{item.estado?.nombreEstado || 'N/D'}</span></td>
                  <td>{item.fechaCompra ? new Date(item.fechaCompra).toLocaleDateString() : ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
