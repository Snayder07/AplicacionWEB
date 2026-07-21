import { useState } from 'react';
import { post } from '../api';

const estadoInicialForm = {
  nombreCliente: '',
  montoInvertido: '',
  porcentajeMensual: '',
  fechaInversionInicial: '',
  estadoInversion: 'activa',
};

export function useNuevaInversionController() {
  const [form, setForm] = useState(estadoInicialForm);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensaje('');
    setError('');
    if (!form.nombreCliente.trim() || !form.montoInvertido || Number(form.montoInvertido) <= 0) {
      setError('Cliente y monto positivo son obligatorios');
      return;
    }
    if (!form.fechaInversionInicial) {
      setError('La fecha de inicio es obligatoria');
      return;
    }
    setCargando(true);
    try {
      await post('/inversiones', {
        nombreCliente: form.nombreCliente.trim(),
        montoInvertido: Number(form.montoInvertido),
        porcentajeMensual: Number(form.porcentajeMensual) || 0,
        fechaInversionInicial: form.fechaInversionInicial,
        estadoInversion: form.estadoInversion,
      });
      setMensaje(`Inversión registrada para "${form.nombreCliente}" por $${form.montoInvertido}.`);
      setForm(estadoInicialForm);
    } catch (err) {
      setError('Error al registrar inversión: ' + err.message);
    } finally {
      setCargando(false);
    }
  }

  return {
    form, mensaje, error, cargando,
    handleChange, handleSubmit,
  };
}
