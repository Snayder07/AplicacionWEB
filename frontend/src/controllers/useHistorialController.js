import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { get, put } from '../api';

export function useHistorialController() {
  const [historial, setHistorial] = useState([]);
  const [tipo, setTipo] = useState('General');
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [estados, setEstados] = useState([]);
  const [editandoKey, setEditandoKey] = useState(null);
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

  useEffect(() => {
    get('/estados')
      .then(setEstados)
      .catch(() => {});
  }, []);

  const handleCambiarEstado = useCallback(async (key, esRobux, id, codigoEstado) => {
    const basePath = esRobux ? '/pedidos/robux' : '/pedidos/streaming';
    try {
      const updated = await put(`${basePath}/${id}/estado`, { codigoEstado });
      setHistorial(prev => prev.map(item => {
        const itemKey = esRobux ? `r-${item.idCompraRobux}` : `s-${item.idCompraStreaming}`;
        if (itemKey === key) return { ...item, estado: updated.estado };
        return item;
      }));
      setEditandoKey(null);
    } catch {
      setError('Error al actualizar el estado');
    }
  }, []);

  return {
    historial: historialFiltrado, tipo, busqueda, error, cargando,
    estados, editandoKey,
    setTipo, setBusqueda, setEditandoKey, handleCambiarEstado,
  };
}
