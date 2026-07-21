import { useState, useEffect } from 'react';
import { get } from '../api';

const COLORES_ESTADO = {
  'anotada': { bg: 'rgba(248, 81, 73, 0.15)', dot: '#f85149' },
  'tratamiento': { bg: 'rgba(210, 153, 34, 0.15)', dot: '#d29922' },
  'finalizada': { bg: 'rgba(63, 185, 80, 0.15)', dot: '#3fb950' },
  'reintegrada': { bg: 'rgba(255, 165, 0, 0.15)', dot: '#ff8c00' },
};

function colorEstado(nombre) {
  return COLORES_ESTADO[(nombre || '').toLowerCase()] || { bg: 'transparent', dot: '#8b949e' };
}

export default function SelectorEstado({ value, onChange }) {
  const [estados, setEstados] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancel = false;
    get('/estados')
      .then((data) => { if (!cancel) setEstados(data); })
      .catch(() => {})
      .finally(() => { if (!cancel) setCargando(false); });
    return () => { cancel = true; };
  }, []);

  if (cargando) {
    return (
      <div className="form-field">
        <label htmlFor="selectorEstado">Estado del pedido</label>
        <select id="selectorEstado" disabled>
          <option>Cargando estados...</option>
        </select>
      </div>
    );
  }

  return (
    <div className="form-field">
      <label htmlFor="selectorEstado">Estado del pedido</label>
      <select id="selectorEstado" name="codigoEstado" value={value || ''} onChange={onChange}>
        <option value="">Selecciona un estado</option>
        {estados.map((e) => {
          const col = colorEstado(e.nombreEstado);
          return (
            <option key={e.idEstado} value={e.codigo}
              style={{ backgroundColor: col.bg }}>
              {e.nombreEstado}
            </option>
          );
        })}
      </select>
    </div>
  );
}
