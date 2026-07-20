# AplicacionWEB — RGBR Business Dashboard

## Descripción General

Sistema de gestión administrativa para un negocio digital que vende **Robux** (moneda de Roblox), **cuentas de streaming** (Netflix, Disney+, Spotify, Crunchyroll) y ofrece **planes de inversión** con rendimientos mensuales para clientes.

---

## Arquitectura

```
AplicacionWEB/
├── backend/          # Spring Boot 4.1 + Java 25 + PostgreSQL
├── frontend/         # React 19 + Vite 8 + React Router v7
├── spec/             # Documentación del proyecto
└── pom.xml           # POM raíz (Maven multi-módulo)
```

---

## Backend (`backend/`)

### Stack
| Componente | Tecnología |
|---|---|
| Framework | Spring Boot 4.1.0 |
| Java | 25 |
| ORM | Spring Data JPA (Hibernate) |
| BD | PostgreSQL |
| Build | Maven |
| Utilidades | Lombok, DevTools |

### Entidades (8)

| Entidad | Tabla | Propósito |
|---|---|---|
| `Admin` | `Admin` | Autenticación de administradores |
| `Clientes` | `Clientes` | Clientes del negocio (Discord) |
| `Compra_robux` | `Compra_robux` | Ventas de Robux |
| `Compra_streaming` | `Compra_streaming` | Ventas de cuentas streaming |
| `Cuentas_compradas` | `Cuentas_compradas` | Inventario de cuentas compradas a proveedores |
| `Estado` | `Estado` | Catálogo de estados de pedido |
| `Moneda` | `Moneda` | Catálogo de monedas (COP, USD, EUR, etc.) |
| `Inversion` | `inversiones` | Inversiones de clientes |
| `Historial_inversion` | `Historial_inversion` | Historial de movimientos de inversiones |

### Servicios (10)

| Servicio | Función |
|---|---|
| `DashboardService` | Estadísticas centrales del dashboard (totales, ventas por día, gráficas, conversión a USD con tasas de cambio reales) |
| `ExchangeRateService` | Obtención y caché de tasas de cambio desde open.er-api.com |
| `LoginService` | Autenticación de admin |
| `PedidoRobuxService` | Guardar compra de Robux |
| `PedidoStreamingService` | Guardar compra de streaming |
| `CuentasCompradasService` | CRUD de cuentas compradas |
| `InversionService` | Gestión de inversiones y cálculo de rendimientos compuestos |
| `HistorialService` | Historial combinado de pedidos |
| `ClientesService` | Placeholder (vacío) |

### Pendiente
- No hay controladores REST (`@RestController`) — el backend no expone endpoints HTTP aún.
- Falta configurar conexión a BD en `application.properties`.

---

## Frontend (`frontend/`)

### Stack
| Componente | Tecnología |
|---|---|
| Framework | React 19 |
| Build | Vite 8 |
| Routing | React Router DOM v7 |
| Idioma | JavaScript (JSX) |
| Estilos | CSS plano (tema oscuro estilo GitHub) |

### Páginas (8 rutas)

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `Dashboard` | Tarjetas de resumen, tabla de actividad reciente |
| `/clientes` | `Clientes` | Gestión de clientes (alta + listado) |
| `/streaming` | `PedidoStreaming` | Registrar venta de streaming |
| `/robux` | `PedidoRobux` | Registrar venta de Robux |
| `/nueva-inversion` | `NuevaInversion` | Registrar nueva inversión |
| `/ver-inversiones` | `VerInversiones` | Ver inversiones activas/finalizadas |
| `/cuentas-streaming` | `CuentasStreaming` | Inventario de cuentas compradas |
| `/historial` | `Historial` | Historial de inversiones |

### Estado actual
- Todos los datos son mock o se guardan en estado local de React (`useState`).
- No persiste datos al recargar la página.
- Código preparado con comentarios `// TODO` indicando dónde conectar al backend (`fetch` a `http://localhost:8080/api/...`).

---

## Entidades — Diagrama de Relaciones

```
Clientes ──┬── Compra_robux ──── Moneda
           │                    Estado
           ├── Compra_streaming ── Cuentas_compradas
           │                      Moneda
           │                      Estado
           └── Inversion ──── Historial_inversion
```

---

## Convenciones del Proyecto

- **Backend:** Java con Lombok (`@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`). Nombres de tablas y columnas en español.
- **Frontend:** Componentes funcionales con hooks. Nombres de archivos PascalCase. CSS por componente.
- **API (planeada):** Prefijo `/api/`, respuestas JSON.

---

## Cómo ejecutar

```bash
# Backend
cd backend
./mvnw spring-boot:run

# Frontend
cd frontend
npm run dev
```
