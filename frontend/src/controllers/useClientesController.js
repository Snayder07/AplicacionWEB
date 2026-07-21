import { useState, useEffect, useRef } from 'react';
import { get, post } from '../api';

export function useClientesController() {
  const [clientes, setClientes] = useState([]);
  const [nombreDiscord, setNombreDiscord] = useState('');
  const [idDiscord, setIdDiscord] = useState('');
  const [filtro, setFiltro] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const inicializado = useRef(false);

  function cargarClientes() {
    setError('');
    const url = filtro.trim() ? `/clientes/buscar?idDiscord=${encodeURIComponent(filtro.trim())}` : '/clientes';
    get(url)
      .then(setClientes)
      .catch(() => setError('No se pudo cargar la lista de clientes'))
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    if (!inicializado.current) {
      inicializado.current = true;
      cargarClientes();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (inicializado.current) {
      cargarClientes();
    }
  }, [filtro]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleAgregarCliente(e) {
    e.preventDefault();
    setError('');
    if (!nombreDiscord.trim() || !idDiscord.trim()) {
      setError('Nombre e ID de Discord son obligatorios');
      return;
    }
    try {
      await post('/clientes', {
        nombreDiscord: nombreDiscord.trim(),
        idDiscord: Number(idDiscord.trim()),
      });
      setNombreDiscord('');
      setIdDiscord('');
      cargarClientes();
    } catch (err) {
      setError('Error al crear cliente: ' + err.message);
    }
  }

  return {
    clientes, nombreDiscord, idDiscord, filtro, error, cargando,
    setNombreDiscord, setIdDiscord, setFiltro, handleAgregarCliente,
  };
}
