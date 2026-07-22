import { formatMoney } from '../utils/format';
import './VentasChart.css';

const PADDING = { top: 20, right: 20, bottom: 32, left: 64 };
const WIDTH = 760;
const HEIGHT = 300;

/**
 * Calcula un máximo "redondo" para el eje Y (ej: 35.000, 10.000, 5)
 * y el tamaño de cada división, para que la gráfica no corte los picos
 * y las líneas de fondo queden en números fáciles de leer.
 */
function calcularEscala(valorMaximo, cantidadDivisiones = 7) {
  if (!valorMaximo || valorMaximo <= 0) {
    return { max: 10, paso: 2 };
  }
  const pasoBruto = valorMaximo / cantidadDivisiones;
  const magnitud = Math.pow(10, Math.floor(Math.log10(pasoBruto)));
  const residuo = pasoBruto / magnitud;

  let pasoLimpio;
  if (residuo > 5) pasoLimpio = 10;
  else if (residuo > 2) pasoLimpio = 5;
  else if (residuo > 1) pasoLimpio = 2;
  else pasoLimpio = 1;

  const paso = pasoLimpio * magnitud;
  const max = Math.ceil(valorMaximo / paso) * paso;
  return { max, paso };
}

/**
 * Gráfica de línea simple en SVG puro (sin dependencias externas).
 * props.data: [{ label: 'Mar', value: 1200.5 }, ...]
 */
export default function VentasChart({ data }) {
  const puntos = Array.isArray(data) ? data : [];
  const valores = puntos.map((p) => Number(p.value) || 0);
  const valorMaximo = Math.max(0, ...valores);
  const { max, paso } = calcularEscala(valorMaximo);

  const anchoUtil = WIDTH - PADDING.left - PADDING.right;
  const altoUtil = HEIGHT - PADDING.top - PADDING.bottom;

  const x = (i) => {
    if (puntos.length <= 1) return PADDING.left + anchoUtil / 2;
    return PADDING.left + (i / (puntos.length - 1)) * anchoUtil;
  };
  const y = (valor) => PADDING.top + altoUtil - (max === 0 ? 0 : (valor / max) * altoUtil);

  const puntosLinea = puntos.map((p, i) => `${x(i)},${y(Number(p.value) || 0)}`).join(' ');

  const divisiones = [];
  for (let v = 0; v <= max; v += paso) {
    divisiones.push(v);
  }

  if (puntos.length === 0) {
    return (
      <div className="ventas-chart-empty" data-testid="ventas-chart-empty">
        No hay datos de ventas todavía.
      </div>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="ventas-chart-svg"
      data-testid="ventas-chart"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Líneas de fondo horizontales + etiquetas del eje Y */}
      {divisiones.map((v) => (
        <g key={v}>
          <line
            x1={PADDING.left}
            x2={WIDTH - PADDING.right}
            y1={y(v)}
            y2={y(v)}
            className="ventas-chart-grid-line"
          />
          <text x={PADDING.left - 10} y={y(v)} className="ventas-chart-axis-label" textAnchor="end" dy="4">
            {v.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
          </text>
        </g>
      ))}

      {/* Línea de ventas */}
      <polyline points={puntosLinea} className="ventas-chart-line" fill="none" />

      {/* Puntos + etiquetas del eje X */}
      {puntos.map((p, i) => (
        <g key={`${p.label}-${i}`}>
          <circle cx={x(i)} cy={y(Number(p.value) || 0)} r="4" className="ventas-chart-dot" />
          <text x={x(i)} y={HEIGHT - 8} className="ventas-chart-axis-label" textAnchor="middle">
            {p.label}
          </text>
          <title>{`${p.label}: ${formatMoney(p.value)}`}</title>
        </g>
      ))}
    </svg>
  );
}
