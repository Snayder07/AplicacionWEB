import { useState, useEffect, useRef, useMemo } from 'react';
import { get } from '../api';

export default function SelectorCliente({ value, onChange, required }) {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [texto, setTexto] = useState(value || '');
  const [abierto, setAbierto] = useState(false);
  const [indice, setIndice] = useState(-1);
  const [valido, setValido] = useState(true);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    let cancel = false;
    get('/clientes')
      .then((data) => { if (!cancel) setClientes(data); })
      .catch(() => {})
      .finally(() => { if (!cancel) setCargando(false); });
    return () => { cancel = true; };
  }, []);

  useEffect(() => {
    setTexto(value || '');
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setAbierto(false);
        setIndice(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sugerencias = useMemo(() => {
    if (!texto.trim()) return clientes.slice(0, 8);
    const q = texto.trim().toLowerCase();
    return clientes
      .filter((c) =>
        c.nombreDiscord.toLowerCase().includes(q) ||
        String(c.idDiscord).includes(q)
      )
      .slice(0, 8);
  }, [clientes, texto]);

  function handleInputChange(e) {
    const t = e.target.value;
    setTexto(t);
    setAbierto(true);
    setIndice(-1);
    setValido(true);
    const evento = { target: { name: 'nombreCliente', value: t } };
    onChange(evento);
  }

  function seleccionar(cliente) {
    setTexto(cliente.nombreDiscord);
    setAbierto(false);
    setIndice(-1);
    setValido(true);
    const evento = { target: { name: 'nombreCliente', value: cliente.nombreDiscord } };
    onChange(evento);
  }

  function handleKeyDown(e) {
    if (!abierto) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setAbierto(true);
        e.preventDefault();
        return;
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      setIndice((prev) => Math.min(prev + 1, sugerencias.length - 1));
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setIndice((prev) => Math.max(prev - 1, 0));
      e.preventDefault();
    } else if (e.key === 'Enter' && indice >= 0 && sugerencias[indice]) {
      seleccionar(sugerencias[indice]);
      e.preventDefault();
    } else if (e.key === 'Escape') {
      setAbierto(false);
      setIndice(-1);
    }
  }

  function handleBlur() {
    const coincide = clientes.some((c) => c.nombreDiscord === texto.trim());
    setValido(coincide || texto.trim() === '');
  }

  function handleFocus() {
    if (texto.trim()) setAbierto(true);
  }

  if (cargando) {
    return (
      <div className="form-field">
        <label htmlFor="selectorClienteInput">Cliente (nombre Discord)</label>
        <input id="selectorClienteInput" type="text" disabled placeholder="Cargando clientes..." />
      </div>
    );
  }

  if (clientes.length === 0) {
    return (
      <div className="form-field">
        <label htmlFor="selectorClienteInput">Cliente (nombre Discord)</label>
        <input id="selectorClienteInput" type="text" disabled placeholder="No hay clientes registrados" />
        <p className="form-error-inline" style={{ fontSize: '11px' }}>
          Registra clientes en la sección Clientes primero
        </p>
      </div>
    );
  }

  return (
    <div className="form-field" ref={wrapperRef} style={{ position: 'relative' }}>
      <label htmlFor="selectorClienteInput">Cliente (nombre Discord)</label>
      <input
        ref={inputRef}
        id="selectorClienteInput"
        type="text"
        placeholder="Escribe nombre o ID de Discord..."
        value={texto}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={handleFocus}
        required={required}
        style={!valido ? { borderColor: '#f85149' } : {}}
        data-testid="input-selector-cliente"
      />
      {!valido && (
        <p className="form-error">Selecciona un cliente válido de la lista</p>
      )}
      {abierto && sugerencias.length > 0 && (
        <ul style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          backgroundColor: '#161b22', border: '1px solid #30363d',
          borderRadius: '8px', margin: '4px 0 0', padding: '4px',
          listStyle: 'none', zIndex: 100, maxHeight: '240px', overflowY: 'auto',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}>
          {sugerencias.map((c, i) => (
            <li key={c.idCliente}
              onMouseDown={() => seleccionar(c)}
              style={{
                padding: '8px 10px', cursor: 'pointer', borderRadius: '6px',
                fontSize: '13px', color: '#c9d1d9',
                backgroundColor: i === indice ? '#1f6feb' : 'transparent',
              }}
              onMouseEnter={() => setIndice(i)}
            >
              <span style={{ color: '#ffffff', fontWeight: 500 }}>{c.nombreDiscord}</span>
              <span style={{ color: '#8b949e', marginLeft: '8px' }}>— ID: {c.idDiscord}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
