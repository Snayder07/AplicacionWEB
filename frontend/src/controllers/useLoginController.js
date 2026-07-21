import { useState } from 'react';
import { post } from '../api';

export function useLoginController({ onLoginSuccess }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!usuario.trim() || !contrasena.trim()) {
      setError('Usuario y contraseña son obligatorios');
      return;
    }
    setCargando(true);
    try {
      const res = await post('/auth/login', { usuario: usuario.trim(), contrasena });
      if (res.success) {
        if (onLoginSuccess) onLoginSuccess(usuario.trim());
      } else {
        setError(res.message || 'Usuario o contraseña incorrectos');
      }
    } catch {
      setError('Error de conexión con el servidor');
    } finally {
      setCargando(false);
    }
  }

  return {
    usuario, setUsuario,
    contrasena, setContrasena,
    error, cargando, handleSubmit,
  };
}
