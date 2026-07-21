import { useState, useEffect, useRef, useMemo } from 'react';
import { get, post } from '../api';

const estadoInicialForm = {
  nombreCliente: '',
  plataforma: '',
  correo: '',
  fechaVencimiento: '',
  precioVenta: '',
  codigoMoneda: 'USD',
  codigoEstado: '',
};

export function usePedidoStreamingController() {
  const [pedidos, setPedidos] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [form, setForm] = useState(estadoInicialForm);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const inicializado = useRef(false);

  function cargarPedidos() {
    setError('');
    get('/pedidos/streaming')
      .then(setPedidos)
      .catch(() => setError('No se pudieron cargar los pedidos'))
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    if (!inicializado.current) {
      inicializado.current = true;
      cargarPedidos();
      get('/monedas').then(setMonedas).catch(() => {});
      get('/cuentas-streaming').then(setCuentas).catch(() => {});
    }
  }, []);

  const correosPorPlataforma = useMemo(() => {
    if (!form.plataforma) return [];
    return cuentas
      .filter((c) => c.plataforma === form.plataforma)
      .map((c) => c.correo);
  }, [cuentas, form.plataforma]);

  const sinCuentas = form.plataforma !== '' && correosPorPlataforma.length === 0;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'plataforma') {
        next.correo = '';
      }
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.nombreCliente.trim()) {
      setError('Selecciona un cliente válido de la lista');
      return;
    }
    if (!form.correo.trim()) {
      setError('Correo es obligatorio');
      return;
    }
    setGuardando(true);
    try {
      const body = {
        nombreCliente: form.nombreCliente.trim(),
        plataforma: form.plataforma,
        correo: form.correo.trim(),
        fechaVencimiento: form.fechaVencimiento,
        precioVenta: Number(form.precioVenta),
        codigoMoneda: form.codigoMoneda,
      };
      if (form.codigoEstado) {
        body.codigoEstado = form.codigoEstado;
      }
      await post('/pedidos/streaming', body);
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
    correosPorPlataforma, sinCuentas,
    handleChange, handleSubmit,
  };
}
