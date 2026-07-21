import { useState, useEffect } from 'react';
import { get } from '../api';

export function useDashboardController() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [cargando] = useState(false);

  useEffect(() => {
    get('/dashboard')
      .then(setStats)
      .catch(() => setError('No se pudo conectar con el servidor'));
  }, []);

  function estadoBadgeClass(estado) {
    const e = (estado || '').toLowerCase();
    if (e.includes('complet')) return 'badge badge-success';
    if (e.includes('pend') || e.includes('tratam') || e.includes('anotad')) return 'badge badge-warning';
    return 'badge badge-danger';
  }

  return { stats, error, cargando, estadoBadgeClass };
}
