import { useState, useEffect } from 'react';
import { get } from '../api';
import './Pages.css';

function estadoBadgeClass(estado) {
  const e = (estado || '').toLowerCase();
  return e === 'activa' ? 'badge badge-success' : 'badge badge-warning';
}

export default function VerInversiones() {
  const [inversiones, setInversiones] = useState([]);

  useEffect(() => {
    get('/inversiones').then(setInversiones).catch(() => {});
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Ver inversiones</h1>
        <p className="page-subtitle">Inversiones registradas por cliente</p>
      </div>

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Monto invertido</th>
              <th>% mensual</th>
              <th>Fecha de inicio</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {inversiones.map((inv) => (
              <tr key={inv.idInversion}>
                <td>{inv.cliente?.nombreDiscord || 'N/D'}</td>
                <td>${inv.montoInvertido?.toFixed(2)}</td>
                <td>{inv.porcentajeMensual}%</td>
                <td>{inv.fechaInversionInicial}</td>
                <td>
                  <span className={estadoBadgeClass(inv.estadoInversion)}>{inv.estadoInversion}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
