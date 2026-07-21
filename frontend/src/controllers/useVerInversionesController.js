import { useState, useEffect, useRef } from 'react';
import { get, post } from '../api';

export function useVerInversionesController() {
  const [inversiones, setInversiones] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [modalCapital, setModalCapital] = useState(null);
  const [modalHistorial, setModalHistorial] = useState(null);
  const [montoCapital, setMontoCapital] = useState('');
  const inicializado = useRef(false);

  function cargar() {
    setError('');
    const url = filtro.trim() ? `/inversiones/buscar?cliente=${encodeURIComponent(filtro.trim())}` : '/inversiones';
    get(url)
      .then(setInversiones)
      .catch(() => setError('No se pudieron cargar las inversiones'))
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
  }, [filtro]); // eslint-disable-line react-hooks/exhaustive-deps

  function estadoBadgeClass(estado) {
    const e = (estado || '').toLowerCase();
    return e === 'activa' ? 'badge badge-success' : 'badge badge-warning';
  }

  function abrirModalCapital(inversion) {
    setModalCapital(inversion);
    setMontoCapital('');
  }

  function cerrarModalCapital() {
    setModalCapital(null);
    setMontoCapital('');
  }

  async function handleAgregarCapital(e) {
    e.preventDefault();
    if (!modalCapital || !montoCapital || Number(montoCapital) <= 0) return;
    try {
      await post(`/inversiones/${modalCapital.idInversion}/capital`, { monto: Number(montoCapital) });
      cerrarModalCapital();
      cargar();
    } catch (err) {
      setError('Error al agregar capital: ' + err.message);
    }
  }

  function abrirModalHistorial(inversion) {
    setModalHistorial(inversion);
  }

  function cerrarModalHistorial() {
    setModalHistorial(null);
  }

  return {
    inversiones, filtro, error, cargando,
    modalCapital, modalHistorial, montoCapital,
    setFiltro, setMontoCapital,
    estadoBadgeClass,
    abrirModalCapital, cerrarModalCapital, handleAgregarCapital,
    abrirModalHistorial, cerrarModalHistorial,
  };
}
