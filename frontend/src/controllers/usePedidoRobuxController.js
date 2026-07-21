import { useState, useEffect, useRef } from 'react';
import { get, post } from '../api';

const estadoInicialForm = {
  nombreCliente: '',
  usuarioRoblox: '',
  cantidadRobux: '',
  precio: '',
  metodoEntrega: '',
  codigoMoneda: 'USD',
  codigoEstado: '',
};

export function usePedidoRobuxController() {
  const [pedidos, setPedidos] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [form, setForm] = useState(estadoInicialForm);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const inicializado = useRef(false);

  function cargarPedidos() {
    setError('');
    get('/pedidos/robux')
      .then(setPedidos)
      .catch(() => setError('No se pudieron cargar los pedidos'))
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    if (!inicializado.current) {
      inicializado.current = true;
      cargarPedidos();
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
    if (!form.nombreCliente.trim()) {
      setError('Selecciona un cliente válido de la lista');
      return;
    }
    if (!form.usuarioRoblox.trim()) {
      setError('Usuario de Roblox es obligatorio');
      return;
    }
    setGuardando(true);
    try {
      const body = {
        nombreCliente: form.nombreCliente.trim(),
        usuarioRoblox: form.usuarioRoblox.trim(),
        cantidadRobux: Number(form.cantidadRobux),
        precio: Number(form.precio),
        metodoEntrega: form.metodoEntrega,
        codigoMoneda: form.codigoMoneda,
      };
      if (form.codigoEstado) {
        body.codigoEstado = form.codigoEstado;
      }
      await post('/pedidos/robux', body);
      setForm(estadoInicialForm);
      cargarPedidos();
    } catch (err) {
      setError('Error al registrar pedido: ' + err.message);
    } finally {
      setGuardando(false);
    }
  }

  return {
    pedidos, monedas, form, error, cargando, guardando,
    handleChange, handleSubmit,
  };
}
