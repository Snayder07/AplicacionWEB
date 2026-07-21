import { useState, useRef, useMemo, useEffect } from 'react';
import { usePedidoStreamingController } from '../controllers/usePedidoStreamingController';
import SelectorCliente from '../components/SelectorCliente';
import SelectorEstado from '../components/SelectorEstado';
import { Search } from 'lucide-react';
import './Pages.css';

function SelectorCorreo({ value, onChange, opciones, plataforma, sinCuentas }) {
  const [texto, setTexto] = useState(value || '');
  const [abierto, setAbierto] = useState(false);
  const [indice, setIndice] = useState(-1);
  const wrapperRef = useRef(null);

  useEffect(() => { setTexto(value || ''); }, [value]);

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
    if (!texto.trim() || sinCuentas) return [];
    const q = texto.trim().toLowerCase();
    return opciones.filter((c) => c.toLowerCase().includes(q)).slice(0, 8);
  }, [opciones, texto, sinCuentas]);

  function handleInputChange(e) {
    const t = e.target.value;
    setTexto(t);
    setAbierto(true);
    setIndice(-1);
    const ev = { target: { name: 'correo', value: t } };
    onChange(ev);
  }

  function seleccionar(correo) {
    setTexto(correo);
    setAbierto(false);
    setIndice(-1);
    const ev = { target: { name: 'correo', value: correo } };
    onChange(ev);
  }

  function handleKeyDown(e) {
    if (!abierto) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setAbierto(true);
        e.preventDefault();
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

  function handleFocus() {
    if (texto.trim() && !sinCuentas) setAbierto(true);
  }

  return (
    <div className="form-field" ref={wrapperRef} style={{ position: 'relative' }}>
      <label htmlFor="correoStreaming">Correo de la cuenta</label>
      <input id="correoStreaming" name="correo" type="text" placeholder="cuenta@correo.com"
        value={texto} onChange={handleInputChange} onKeyDown={handleKeyDown}
        onFocus={handleFocus} autoComplete="off"
        data-testid="input-streaming-correo" />
      {sinCuentas && (
        <p className="form-error-inline" style={{ fontSize: '11px' }}>
          No hay cuentas de {plataforma} registradas. Ve a Cuentas Streaming para agregar una.
        </p>
      )}
      {abierto && sugerencias.length > 0 && (
        <ul style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          backgroundColor: '#161b22', border: '1px solid #30363d',
          borderRadius: '8px', margin: '4px 0 0', padding: '4px',
          listStyle: 'none', zIndex: 100, maxHeight: '240px', overflowY: 'auto',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}>
          {sugerencias.map((correo, i) => (
            <li key={correo}
              onMouseDown={() => seleccionar(correo)}
              style={{
                padding: '8px 10px', cursor: 'pointer', borderRadius: '6px',
                fontSize: '13px', color: '#c9d1d9',
                backgroundColor: i === indice ? '#1f6feb' : 'transparent',
              }}
              onMouseEnter={() => setIndice(i)}
            >
              {correo}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function PedidoStreaming() {
  const c = usePedidoStreamingController();

  return (
    <div className="page" data-testid="streaming-page">
      <div className="page-header">
        <h1 className="page-title" data-testid="streaming-title">Nuevo pedido de Streaming</h1>
        <p className="page-subtitle">Registra la venta de una cuenta de streaming</p>
      </div>

      <div className="panel" data-testid="panel-nuevo-streaming">
        {c.error && <div className="alert alert-error" data-testid="streaming-error">{c.error}</div>}
        <form onSubmit={c.handleSubmit} data-testid="form-streaming">
          <div className="form-grid">
            <SelectorCliente value={c.form.nombreCliente} onChange={c.handleChange} required />

            <div className="form-field">
              <label htmlFor="plataforma">Plataforma</label>
              <select id="plataforma" name="plataforma" value={c.form.plataforma} onChange={c.handleChange} data-testid="select-streaming-plataforma">
                <option value="">Selecciona una plataforma</option>
                <option value="Netflix">Netflix</option>
                <option value="Disney+">Disney+</option>
                <option value="Spotify">Spotify</option>
                <option value="Crunchyroll">Crunchyroll</option>
              </select>
            </div>

            <SelectorCorreo
              value={c.form.correo}
              onChange={c.handleChange}
              opciones={c.correosPorPlataforma}
              plataforma={c.form.plataforma}
              sinCuentas={c.sinCuentas}
            />

            <div className="form-field">
              <label htmlFor="fechaVencimiento">Fecha de vencimiento</label>
              <input id="fechaVencimiento" name="fechaVencimiento" type="date"
                value={c.form.fechaVencimiento} onChange={c.handleChange} data-testid="input-streaming-vencimiento" />
            </div>

            <div className="form-field">
              <label htmlFor="precioVenta">Precio de venta</label>
              <input id="precioVenta" name="precioVenta" type="number" step="0.01" placeholder="8.00"
                value={c.form.precioVenta} onChange={c.handleChange} data-testid="input-streaming-precio" />
            </div>

            <div className="form-field">
              <label htmlFor="codigoMoneda">Moneda</label>
              <select id="codigoMoneda" name="codigoMoneda" value={c.form.codigoMoneda} onChange={c.handleChange} data-testid="select-streaming-moneda">
                {c.monedas.map((m) => (
                  <option key={m.idMoneda} value={m.codigo}>{m.nombreMoneda} ({m.codigo})</option>
                ))}
              </select>
            </div>

            <SelectorEstado value={c.form.codigoEstado} onChange={c.handleChange} />
          </div>

          <button type="submit" className="btn btn-primary" disabled={c.guardando} data-testid="btn-registrar-streaming">
            {c.guardando ? 'Guardando...' : 'Registrar pedido'}
          </button>
        </form>
      </div>

      <div className="panel" data-testid="panel-lista-streaming">
        <h2 className="panel-title">Pedidos registrados (<span data-testid="streaming-count">{c.pedidos.length}</span>)</h2>

        {c.pedidos.length === 0 ? (
          <div className="data-table-empty">
            <div className="data-table-empty-icon">
              <Search size={32} />
            </div>
            <p className="data-table-empty-text">No hay pedidos registrados</p>
            <p className="data-table-empty-subtext">Los pedidos aparecerán aquí una vez registrados</p>
          </div>
        ) : (
          <table className="data-table" data-testid="tabla-streaming">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Plataforma</th>
                <th>Correo</th>
                <th>Vence</th>
                <th>Precio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {c.pedidos.map((p) => (
                <tr key={p.idCompraStreaming} data-testid={`fila-streaming-${p.idCompraStreaming}`}>
                  <td>{p.cliente?.nombreDiscord || 'N/D'}</td>
                  <td>{p.cuentaComprada?.plataforma || 'N/D'}</td>
                  <td>{p.cuentaComprada?.correo || 'N/D'}</td>
                  <td>{p.fechaVencimiento || ''}</td>
                  <td>${p.precioVenta}</td>
                  <td><span className="badge badge-warning">{p.estado?.nombreEstado || 'N/D'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
