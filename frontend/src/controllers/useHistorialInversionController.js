import { useState, useEffect, useRef } from 'react';
import { get } from '../api';

export function useHistorialInversionController(idInversion) {
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const inicializado = useRef(false);

  useEffect(() => {
    if (!idInversion || inicializado.current) return;
    inicializado.current = true;
    setError('');
    get(`/historial/inversiones/${idInversion}`)
      .then(setMovimientos)
      .catch(() => setError('No se pudo cargar el historial'))
      .finally(() => setCargando(false));
  }, [idInversion]);

  return { movimientos, cargando, error };
}
