# AplicacionWEB — RGBR Business Dashboard

## Descripción General

Sistema de gestión administrativa para un negocio digital que vende **Robux** (moneda de Roblox), **cuentas de streaming** (Netflix, Disney+, Spotify, Crunchyroll) y ofrece **planes de inversión** con rendimientos mensuales para clientes.

---

## Arquitectura

```
AplicacionWEB/
├── backend/          # Spring Boot 4.1 + Java 25 + PostgreSQL
├── frontend/         # React 19 + Vite 8 + React Router v7 + lucide-react
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

### Entidades (9)

| Entidad | Tabla | Propósito |
|---|---|---|
| `Admin` | `Admin` | Autenticación de administradores |
| `Clientes` | `Clientes` | Clientes del negocio (Discord) |
| `Compra_robux` | `Compra_robux` | Ventas de Robux |
| `Compra_streaming` | `Compra_streaming` | Ventas de cuentas streaming |
| `Cuentas_compradas` | `Cuentas_compradas` | Inventario de cuentas compradas a proveedores |
| `Estado` | `Estado` | Catálogo de estados de pedido (`ANOT`, `TRAT`, `FIN`, `REIN`) |
| `Moneda` | `Moneda` | Catálogo de monedas (COP, USD, EUR, etc.) |
| `Inversion` | `inversiones` | Inversiones de clientes |
| `Historial_inversion` | `Historial_inversion` | Historial de movimientos de inversiones |

### Servicios (10)

| Servicio | Función |
|---|---|
| `DashboardService` | Estadísticas centrales del dashboard |
| `ExchangeRateService` | Obtención y caché de tasas de cambio desde open.er-api.com |
| `LoginService` | Autenticación de admin |
| `PedidoRobuxService` | Guardar compra de Robux |
| `PedidoStreamingService` | Guardar compra de streaming |
| `CuentasCompradasService` | CRUD de cuentas compradas |
| `InversionService` | Gestión de inversiones y cálculo de rendimientos compuestos |
| `HistorialService` | Historial combinado de pedidos |
| `ClientesService` | Placeholder (vacío) |

### Controladores REST (10)

| Endpoint | Método | Descripción |
|---|---|---|
| `POST /api/auth/login` | `AuthController` | Autenticación de admin |
| `GET /api/clientes` | `ClientesController` | Listar todos los clientes |
| `GET /api/clientes/buscar` | `ClientesController` | Buscar cliente por ID Discord |
| `POST /api/clientes` | `ClientesController` | Crear nuevo cliente |
| `GET /api/pedidos/streaming` | `PedidoStreamingController` | Listar pedidos de streaming |
| `POST /api/pedidos/streaming` | `PedidoStreamingController` | Crear pedido de streaming |
| `GET /api/pedidos/robux` | `PedidoRobuxController` | Listar pedidos de Robux |
| `POST /api/pedidos/robux` | `PedidoRobuxController` | Crear pedido de Robux |
| `GET /api/cuentas-streaming` | `CuentasCompradasController` | Listar inventario de cuentas |
| `POST /api/cuentas-streaming` | `CuentasCompradasController` | Agregar cuenta comprada |
| `DELETE /api/cuentas-streaming/{id}` | `CuentasCompradasController` | Eliminar cuenta |
| `GET /api/inversiones` | `InversionController` | Listar todas las inversiones |
| `GET /api/inversiones/buscar` | `InversionController` | Buscar inversiones por cliente |
| `POST /api/inversiones` | `InversionController` | Crear nueva inversión (con estado) |
| `POST /api/inversiones/{id}/capital` | `InversionController` | Agregar capital a inversión |
| `GET /api/historial/pedidos` | `HistorialController` | Historial de pedidos (filtro por tipo) |
| `GET /api/historial/inversiones/{id}` | `HistorialController` | Historial de movimientos de inversión |
| `GET /api/monedas` | `MonedaController` | Listar monedas disponibles |
| `GET /api/estados` | `EstadoController` | Listar estados de pedido |
| `GET /api/dashboard` | `DashboardController` | Estadísticas del dashboard |

### DTOs

| DTO | Campos clave |
|---|---|
| `InversionRequest` | `nombreCliente`, `montoInvertido`, `porcentajeMensual`, `fechaInversionInicial`, `estadoInversion` |
| `PedidoStreamingRequest` | `nombreCliente`, `plataforma`, `correo`, `fechaVencimiento`, `precioVenta`, `codigoMoneda`, `codigoEstado` |
| `PedidoRobuxRequest` | `nombreCliente`, `usuarioRoblox`, `cantidadRobux`, `precio`, `metodoEntrega`, `codigoMoneda`, `codigoEstado` |
| `CuentaStreamingRequest` | `plataforma`, `correo`, `contrasena`, `precioCompra`, `codigoMoneda` |
| `CapitalRequest` | `monto` |

---

## Frontend (`frontend/`)

### Stack
| Componente | Tecnología |
|---|---|
| Framework | React 19 |
| Build | Vite 8 |
| Routing | React Router DOM v7 |
| Idioma | JavaScript (JSX) |
| Íconos | lucide-react |
| Estilos | CSS plano (tema oscuro estilo GitHub, ~9.7KB) |

### Páginas (8 rutas)

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `Dashboard` | Tarjetas de resumen + tabla de actividad reciente |
| `/clientes` | `Clientes` | Alta y listado de clientes con buscador por ID |
| `/streaming` | `PedidoStreaming` | Registrar venta de streaming con autocompletado de cliente y correo |
| `/robux` | `PedidoRobux` | Registrar venta de Robux con autocompletado de cliente |
| `/nueva-inversion` | `NuevaInversion` | Registrar inversión con estado seleccionable |
| `/ver-inversiones` | `VerInversiones` | Ver inversiones con buscador y modales (capital + historial) |
| `/cuentas-streaming` | `CuentasStreaming` | Inventario de cuentas compradas con buscador |
| `/historial` | `Historial` | Historial de pedidos con filtro por tipo y búsqueda por texto |

### Componentes reutilizables

| Componente | Props | Descripción |
|---|---|---|
| `Sidebar` | `{ auth }` | Menú lateral con íconos lucide-react, indicador activo con borde izquierdo |
| `ProtectedRoute` | `{ children }` | Redirige a `/login` si no hay sesión |
| `HistorialInversionModal` | `{ idInversion, onClose }` | Modal con movimientos de una inversión |
| `SelectorCliente` | `{ value, onChange, required }` | Autocompletado de cliente: input + dropdown con filtro por nombre o ID de Discord |
| `SelectorEstado` | `{ value, onChange }` | Select de estado del pedido con colores (Anotada=rojo, Tratamiento=amarillo, Finalizada=verde, Reintegrada=naranja) |

### Custom Hooks (controladores)

| Hook | Carga inicial | Expone |
|---|---|---|
| `useDashboardController` | `GET /api/dashboard` | `stats`, `estadoBadgeClass` |
| `useClientesController` | `GET /api/clientes` | `clientes`, `filtro`, `handleAgregarCliente` |
| `usePedidoStreamingController` | `GET /api/pedidos/streaming`, `/monedas`, `/cuentas-streaming` | `form`, `pedidos`, `correosPorPlataforma`, `sinCuentas`, `handleChange`, `handleSubmit` |
| `usePedidoRobuxController` | `GET /api/pedidos/robux`, `/monedas` | `form`, `pedidos`, `handleChange`, `handleSubmit` |
| `useNuevaInversionController` | — (solo POST) | `form`, `mensaje`, `handleChange`, `handleSubmit` |
| `useVerInversionesController` | `GET /api/inversiones` | `inversiones`, `filtro`, modales, `handleAgregarCapital` |
| `useCuentasStreamingController` | `GET /api/cuentas-streaming`, `/monedas` | `cuentas` (filtradas), `busqueda`, `correoDuplicado`, CRUD |
| `useHistorialController` | `GET /api/historial/pedidos` (según tipo) | `historial` (filtrado), `tipo`, `busqueda` |
| `useLoginController` | — | `usuario`, `contrasena`, `handleSubmit` con callback |

---

## Funcionalidades implementadas

### Rediseño visual completo
- Jerarquía tipográfica real con pesos y tracking
- Sombras sutiles en cards, paneles y modales
- Transiciones suaves (150-200ms) en hover de botones, filas de tabla y links
- Botones con variantes: `btn-primary`, `btn-secondary`, `btn-danger`, `btn-sm`
- Tablas con hover, sticky headers, estados vacíos con ícono y mensaje
- Formularios con labels en uppercase, inputs focus ring, selects personalizados con flecha SVG
- Sidebar con íconos lucide-react y borde lateral en ítem activo
- Animación fadeIn al cargar cada página
- Eliminación global de flechas de incremento/decremento en inputs numéricos

### Gestión de clientes
- Autocompletado al escribir nombre o ID de Discord en Streaming, Robux y Nueva Inversión
- Validación: no permite enviar un nombre que no exista en la lista de clientes
- Indicación visual de error si el cliente no es válido

### Pedidos de Streaming
- Selector de plataforma (Netflix, Disney+, Spotify, Crunchyroll)
- Autocompletado de correo filtrado por la plataforma seleccionada (consulta inventario de cuentas)
- Si no hay cuentas para la plataforma, muestra aviso y permite escribir libremente
- Cambiar plataforma limpia el campo correo automáticamente
- Selector de estado del pedido (Anotada, Tratamiento, Finalizada, Reintegrada)
- Fecha de vencimiento, precio de venta, moneda

### Pedidos de Robux
- Usuario de Roblox, cantidad de Robux, precio, método de entrega (Gamepass/Grupo)
- Selector de estado del pedido

### Inversiones
- Registro con monto, porcentaje mensual, fecha de inicio y estado (Activa/Pausada)
- Posibilidad de agregar capital adicional a una inversión existente
- Historial de movimientos por inversión en modal
- Badge de estado con color (verde=activa, amarillo=pausada)

### Cuentas Streaming (inventario)
- CRUD completo: agregar, listar, eliminar cuentas compradas
- Buscador en frontend que filtra por plataforma o correo
- Detección de duplicados inline (correo+plataforma) antes de enviar
- Título "Cuentas del sistema (N)"

### Historial
- Filtro por tipo de pedido (General/Robux/Streaming) que consulta al backend
- Búsqueda en frontend por nombre o ID de Discord del cliente
- Combinación de ambos filtros

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

- **Backend:** Java con Lombok. Nombres de tablas y columnas en español. Controladores REST con prefijo `/api/`.
- **Frontend:** Componentes funcionales con hooks. Nombres de archivos PascalCase. Patrón de controladores como custom hooks en `controllers/`. Componentes reutilizables en `components/`.
- **API:** Respuestas JSON. Endpoints CRUD estándar.

---

## Cómo ejecutar

```bash
# Backend
cd backend
.\mvnw.cmd spring-boot:run

# Frontend
cd frontend
npm run dev
```

El frontend corre en `http://localhost:5173` y el backend en `http://localhost:8080`.
