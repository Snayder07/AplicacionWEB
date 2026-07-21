import { useState, useEffect, useRef, useMemo } from 'react';
import { get, post, del } from '../api';

const estadoInicialForm = { plataforma: '', correo: '', contrasena: '', precioCompra: '', codigoMoneda: 'USD' };

export function useCuentasStreamingController() {
  const [cuentas, setCuentas] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [form, setForm] = useState(estadoInicialForm);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const inicializado = useRef(false);

  const cuentasFiltradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return cuentas;
    return cuentas.filter((c) =>
      c.plataforma.toLowerCase().includes(q) ||
      c.correo.toLowerCase().includes(q)
    );
  }, [cuentas, busqueda]);

  const correoDuplicado = useMemo(() => {
    const correo = form.correo.trim().toLowerCase();
    if (!correo || !form.plataforma.trim()) return null;
    return cuentas.find(
      (c) => c.correo.toLowerCase() === correo &&
             c.plataforma.toLowerCase() === form.plataforma.trim().toLowerCase()
    ) || null;
  }, [cuentas, form.correo, form.plataforma]);

  function cargar() {
    setError('');
    get('/cuentas-streaming')
      .then(setCuentas)
      .catch(() => setError('No se pudo cargar el inventario'))
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    if (!inicializado.current) {
      inicializado.current = true;
      cargar();
      get('/monedas').then(setMonedas).catch(() => {});
    }
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.plataforma.trim() || !form.correo.trim()) {
      setError('Plataforma y correo son obligatorios');
      return;
    }
    if (correoDuplicado) {
      setError('Ya existe una cuenta con este correo y plataforma');
      return;
    }
    setGuardando(true);
    try {
      await post('/cuentas-streaming', {
        plataforma: form.plataforma.trim(),
        correo: form.correo.trim(),
        contrasena: form.contrasena,
        precioCompra: Number(form.precioCompra),
        codigoMoneda: form.codigoMoneda,
      });
      setForm(estadoInicialForm);
      cargar();
    } catch (err) {
      setError('Error al guardar cuenta: ' + err.message);
    } finally {
      setGuardando(false);
    }
  }

  async function handleEliminar(id) {
    if (!window.confirm('¿Estás seguro de eliminar esta cuenta?')) return;
    try {
      await del(`/cuentas-streaming/${id}`);
      cargar();
    } catch (err) {
      setError('Error al eliminar cuenta: ' + err.message);
    }
  }

  return {
    cuentas: cuentasFiltradas, monedas, form, error, cargando, guardando,
    busqueda, setBusqueda, correoDuplicado,
    handleChange, handleSubmit, handleEliminar,
  };
}
