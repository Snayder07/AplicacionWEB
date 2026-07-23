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

### Servicios (9)

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

| Endpoint | Controller | Descripción |
|---|---|---|
| `POST /api/auth/login` | `AuthController` | Autenticación de admin |
| `GET /api/clientes` | `ClientesController` | Listar todos los clientes |
| `GET /api/clientes/con-pedidos` | `ClientesController` | Listar clientes con sus pedidos |
| `GET /api/clientes/{id}` | `ClientesController` | Obtener cliente por ID |
| `GET /api/clientes/buscar` | `ClientesController` | Buscar cliente por ID Discord |
| `POST /api/clientes` | `ClientesController` | Crear nuevo cliente |
| `GET /api/pedidos/robux` | `PedidoRobuxController` | Listar pedidos de Robux |
| `GET /api/pedidos/robux/{id}` | `PedidoRobuxController` | Obtener pedido Robux por ID |
| `POST /api/pedidos/robux` | `PedidoRobuxController` | Crear pedido de Robux |
| `PUT /api/pedidos/robux/{id}/estado` | `PedidoRobuxController` | Actualizar estado de pedido Robux |
| `GET /api/pedidos/streaming` | `PedidoStreamingController` | Listar pedidos de streaming |
| `GET /api/pedidos/streaming/{id}` | `PedidoStreamingController` | Obtener pedido streaming por ID |
| `POST /api/pedidos/streaming` | `PedidoStreamingController` | Crear pedido de streaming |
| `PUT /api/pedidos/streaming/{id}/estado` | `PedidoStreamingController` | Actualizar estado de pedido streaming |
| `GET /api/cuentas-streaming` | `CuentasCompradasController` | Listar inventario de cuentas |
| `GET /api/cuentas-streaming/{id}` | `CuentasCompradasController` | Obtener cuenta por ID |
| `POST /api/cuentas-streaming` | `CuentasCompradasController` | Agregar cuenta comprada |
| `DELETE /api/cuentas-streaming/{id}` | `CuentasCompradasController` | Eliminar cuenta |
| `GET /api/inversiones` | `InversionController` | Listar todas las inversiones |
| `GET /api/inversiones/buscar` | `InversionController` | Buscar inversiones por cliente |
| `GET /api/inversiones/{id}` | `InversionController` | Obtener inversión por ID |
| `POST /api/inversiones` | `InversionController` | Crear nueva inversión |
| `PUT /api/inversiones/{id}/estado` | `InversionController` | Actualizar estado de inversión |
| `POST /api/inversiones/{id}/capital` | `InversionController` | Agregar capital a inversión |
| `GET /api/historial/pedidos` | `HistorialController` | Historial de pedidos (filtro por tipo) |
| `GET /api/historial/inversiones/{id}` | `HistorialController` | Historial de movimientos de inversión |
| `GET /api/monedas` | `MonedaController` | Listar monedas disponibles |
| `GET /api/estados` | `EstadoController` | Listar estados de pedido |
| `GET /api/dashboard` | `DashboardController` | Estadísticas del dashboard |

### DTOs (11)

| DTO | Campos clave |
|---|---|
| `LoginRequest` | `usuario`, `contrasena` |
| `ClienteRequest` | `nombreDiscord`, `idDiscord` |
| `InversionRequest` | `nombreCliente`, `montoInvertido`, `porcentajeMensual`, `fechaInversionInicial`, `estadoInversion` |
| `PedidoStreamingRequest` | `nombreCliente`, `plataforma`, `correo`, `contrasena`, `fechaVencimiento`, `precioVenta`, `codigoMoneda`, `codigoEstado` |
| `PedidoRobuxRequest` | `nombreCliente`, `usuarioRoblox`, `cantidadRobux`, `precio`, `metodoEntrega`, `codigoMoneda`, `codigoEstado`, `clave` |
| `CuentaStreamingRequest` | `plataforma`, `correo`, `contrasena`, `precioCompra`, `codigoMoneda` |
| `CapitalRequest` | `monto` |
| `EstadoPedidoRequest` | `codigoEstado` |
| `EstadoInversionRequest` | `estadoInversion` |

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
| Gráficos | SVG puro (VentasChart) |
| Estilos | CSS plano (tema oscuro estilo GitHub, ~14KB) |

### Páginas (9 rutas)

| Ruta | Componente | Descripción |
|---|---|---|
| `/login` | `Login` | Pantalla de inicio de sesión |
| `/` | `Dashboard` | Tarjetas de resumen, desglose por moneda, gráfico de ventas 7 días, actividad reciente |
| `/clientes` | `Clientes` | Alta y listado de clientes con buscador por ID |
| `/streaming` | `PedidoStreaming` | Registrar venta de streaming con autocompletado de cliente y filtro de correo por plataforma |
| `/robux` | `PedidoRobux` | Registrar venta de Robux con campos condicionales según método de entrega (Gamepass/Grupo) |
| `/nueva-inversion` | `NuevaInversion` | Registrar inversión con estado seleccionable |
| `/ver-inversiones` | `VerInversiones` | Ver inversiones con buscador, edición inline de estado, modales de capital e historial |
| `/cuentas-streaming` | `CuentasStreaming` | Inventario de cuentas compradas con buscador y detección de duplicados |
| `/historial` | `Historial` | Historial de pedidos con filtro por tipo, búsqueda por texto, columna plataforma/método y edición inline de estado |

### Componentes reutilizables

| Componente | Props | Descripción |
|---|---|---|
| `Sidebar` | `{ auth }` | Menú lateral con íconos lucide-react, indicador activo con borde izquierdo |
| `ProtectedRoute` | `{ children }` | Redirige a `/login` si no hay sesión |
| `SelectorCliente` | `{ value, onChange, required }` | Autocompletado de cliente: input + dropdown con filtro por nombre o ID de Discord |
| `SelectorEstado` | `{ value, onChange }` | Select de estado del pedido con colores (carga opciones desde `GET /api/estados`) |
| `VentasChart` | `{ data }` (array `{label, value}`) | Gráfico SVG de líneas para ventas de últimos 7 días |
| `HistorialInversionModal` | `{ idInversion, onClose }` | Modal con movimientos de una inversión |

### Custom Hooks (controladores)

| Hook | Carga inicial | Expone |
|---|---|---|
| `useLoginController` | — | `usuario`, `contrasena`, `error`, `cargando`, `handleSubmit` |
| `useDashboardController` | `GET /api/dashboard` | `stats`, `error`, `cargando`, `estadoBadgeClass` |
| `useClientesController` | `GET /api/clientes` | `clientes`, `filtro`, `handleAgregarCliente` |
| `usePedidoRobuxController` | `GET /api/pedidos/robux`, `/monedas` | `form`, `pedidos`, `esGamepass`, `handleChange`, `handleSubmit` |
| `usePedidoStreamingController` | `GET /api/pedidos/streaming`, `/monedas`, `/cuentas-streaming` | `form`, `pedidos`, `correosPorPlataforma`, `sinCuentas`, `handleChange`, `handleSubmit` |
| `useCuentasStreamingController` | `GET /api/cuentas-streaming`, `/monedas` | `cuentas` (filtradas), `busqueda`, `correoDuplicado`, CRUD |
| `useNuevaInversionController` | — (solo POST) | `form`, `mensaje`, `handleChange`, `handleSubmit` |
| `useVerInversionesController` | `GET /api/inversiones` | `inversiones`, `filtro`, `editandoId`, modales, `estadoBadgeClass`, `handleAgregarCapital`, `handleCambiarEstado` |
| `useHistorialController` | `GET /api/historial/pedidos` (según tipo), `GET /api/estados` | `historial` (filtrado), `tipo`, `busqueda`, `estados`, `editandoKey`, `handleCambiarEstado` |
| `useHistorialInversionController` | `GET /api/historial/inversiones/{id}` | `movimientos`, `cargando`, `error` |

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
- Método de entrega con lógica condicional:
  - **Gamepass**: oculta "Usuario de Roblox", muestra campo "Link de Gamepass", envía `metodoEntrega: "gp"` y guarda link en campo `clave`
  - **Grupo**: muestra campo "Usuario de Roblox", envía `metodoEntrega: "Grupo"`
  - Al cambiar de método se limpia el campo del método anterior
- Cantidad de Robux, precio, moneda
- Selector de estado del pedido
- Tabla de pedidos registrados: si es Gamepass muestra el link (truncado) en vez del usuario de Roblox

### Inversiones
- Registro con monto, porcentaje mensual, fecha de inicio y estado (Activa/Pausada)
- Edición inline de estado desde la tabla (Activa, Finalizada, Pausada)
- Posibilidad de agregar capital adicional a una inversión existente
- Historial de movimientos por inversión en modal
- Badge de estado con color (verde=activa, azul=finalizada, amarillo=pausada)

### Cuentas Streaming (inventario)
- CRUD completo: agregar, listar, eliminar cuentas compradas
- Buscador en frontend que filtra por plataforma o correo
- Detección de duplicados inline (correo+plataforma) antes de enviar
- Título "Cuentas del sistema (N)"

### Historial
- Filtro por tipo de pedido (General/Robux/Streaming) que consulta al backend
- Búsqueda en frontend por nombre o ID de Discord del cliente
- Combinación de ambos filtros
- Columna "Plataforma/Método" que muestra método de entrega (Robux) o plataforma de la cuenta (Streaming)
- Edición inline de estado del pedido con selector con colores, persistencia vía PUT

### Dashboard
- 4 tarjetas de resumen: clientes totales, ventas totales (USD), pedidos pendientes, pedidos completados
- Desglose de dinero recibido por tipo de moneda con tarjetas de colores
- Gráfico de ventas de los últimos 7 días (SVG puro)
- Tabla de actividad reciente con estado coloreado

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
