import { useState, useEffect, useRef, useMemo } from 'react';
import { get } from '../api';

export function useHistorialController() {
  const [historial, setHistorial] = useState([]);
  const [tipo, setTipo] = useState('General');
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const inicializado = useRef(false);

  const historialFiltrado = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return historial;
    return historial.filter((item) => {
      const nombre = (item.cliente?.nombreDiscord || '').toLowerCase();
      const id = String(item.cliente?.idDiscord || '');
      return nombre.includes(q) || id.includes(q);
    });
  }, [historial, busqueda]);

  function cargar() {
    setError('');
    setCargando(true);
    get(`/historial/pedidos?tipo=${encodeURIComponent(tipo)}`)
      .then(setHistorial)
      .catch(() => setError('No se pudo cargar el historial'))
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    if (!inicializado.current) {
      inicializado.current = true;
      cargar();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (inicializado.current) {
      cargar();
    }
  }, [tipo]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    historial: historialFiltrado, tipo, busqueda, error, cargando,
    setTipo, setBusqueda,
  };
}
