# PROMPT PARA OPENCODE — Completar frontend React de AplicacionWEB

Copia y pega todo este documento tal cual en OpenCode dentro de la raíz del proyecto `AplicacionWEB`.

---

## 0. Contexto del proyecto

Este repo (`AplicacionWEB`) es la migración a web de una app de escritorio JavaFX (`Aplicacion-Negocio`) para gestionar un negocio de venta de Robux, cuentas de streaming e inversiones de clientes.

Estructura actual:

```
AplicacionWEB/
  backend/   -> Spring Boot (Java), API REST ya funcional en http://localhost:8080/api
  frontend/  -> React 19 + Vite + react-router-dom 7, ya inicializado
```

El **backend YA está completo** (controllers, services, repositories, dtos, modelos) y replica 1:1 la lógica de negocio de la app JavaFX original. **No modifiques el backend**, salvo que detectes que falta un endpoint estrictamente necesario para una funcionalidad que sí existía en la app original (lo indico más abajo si aplica).

El **frontend está a medias**: existen las páginas (`src/pages/*.jsx`) pero toda la lógica (fetch a la API, estado, validaciones) está mezclada directamente dentro de cada componente visual. Necesito que la reestructures en un patrón **Vista + Controlador**, igual que la app JavaFX original tenía un `.fxml` (vista) y un `XxxController.java` (controlador) por cada ventana.

---

## 1. Objetivo

Para **cada pantalla** de la aplicación, crear:

1. Un **hook "controlador"** en `frontend/src/controllers/useXxxController.js` que contenga TODA la lógica: estados (`useState`), efectos (`useEffect`), llamadas a la API, validaciones, formateo de datos y manejadores de eventos (`handleSubmit`, `handleChange`, etc). Debe exponer un objeto claro con los datos y funciones que la vista necesita.
2. Una **vista** en `frontend/src/pages/Xxx.jsx` que sea (casi) puro JSX: usa el hook controlador y solo pinta datos/formularios, sin lógica de negocio ni llamadas directas a `fetch`/`api.js`.

Esto debe hacerse para **todas las pantallas**, desde el Login hasta el Historial, igual que en el proyecto original tenía un controlador por ventana (`LoginController`, `DashboardController`, `ClientesController`, `PedidoRobuxController`, `PedidoStreamingController`, `InversionController`, `VisualizarInversionesController`, `HistorialInversionPopUpController`, `CuentasCompradasController`, `HistorialController`, `MainLayoutController`).

---

## 2. Patrón de arquitectura obligatorio

Crea la carpeta `frontend/src/controllers/`. Cada archivo sigue esta forma:

```js
// src/controllers/useClientesController.js
import { useState, useEffect, useCallback } from 'react';
import { get, post } from '../api';

export function useClientesController() {
  const [clientes, setClientes] = useState([]);
  const [nombreDiscord, setNombreDiscord] = useState('');
  const [idDiscord, setIdDiscord] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const cargarClientes = useCallback(() => {
    setCargando(true);
    get('/clientes')
      .then(setClientes)
      .catch(() => setError('No se pudo cargar la lista de clientes'))
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => { cargarClientes(); }, [cargarClientes]);

  async function handleAgregarCliente(e) {
    e.preventDefault();
    if (!nombreDiscord.trim() || !idDiscord.trim()) {
      setError('Nombre e ID de Discord son obligatorios');
      return;
    }
    try {
      await post('/clientes', {
        nombreDiscord: nombreDiscord.trim(),
        idDiscord: Number(idDiscord.trim()),
      });
      setNombreDiscord('');
      setIdDiscord('');
      setError('');
      cargarClientes();
    } catch (err) {
      setError('Error al crear cliente: ' + err.message);
    }
  }

  return {
    clientes, nombreDiscord, idDiscord, error, cargando,
    setNombreDiscord, setIdDiscord, handleAgregarCliente,
  };
}
```

Y la vista queda así:

```jsx
// src/pages/Clientes.jsx
import { useClientesController } from '../controllers/useClientesController';
import './Pages.css';

export default function Clientes() {
  const c = useClientesController();
  return (
    <div className="page">
      {/* JSX usando c.clientes, c.handleAgregarCliente, etc — sin lógica aquí */}
    </div>
  );
}
```

Mantén el `className`/estilos actuales (`Pages.css`, `Sidebar.css`) para no romper el diseño ya construido. No reescribas el CSS salvo que sea indispensable para el Login o el modal nuevo.

---

## 3. Pantallas a construir/completar

Usa siempre `frontend/src/api.js` (ya existe con `get`, `post`, `del`). Si necesitas `PUT`, agrégalo ahí siguiendo el mismo estilo.

### 3.1 Login (NUEVA — no existe todavía)
- Crear `src/pages/Login.jsx` + `src/controllers/useLoginController.js`.
- Formulario con `usuario` y `contraseña` (campo tipo password).
- Al enviar, `POST /api/auth/login` con `{ usuario, contrasena }`.
- Si la respuesta es `success: true` → guardar sesión (ver sección 4) y redirigir a `/`.
- Si es 401 / `success: false` → mostrar mensaje "Usuario o contraseña incorrectos" (igual que `lblError` del `LoginController.java` original).
- Mientras se resuelve la petición, deshabilitar el botón y mostrar estado "Ingresando...".
- Diseño: pantalla completa centrada, con el tema oscuro del resto de la app (reutiliza variables/colores de `Pages.css`), sin sidebar visible.

### 3.2 Dashboard
- Refactoriza `Dashboard.jsx` actual extrayendo la lógica a `useDashboardController.js`.
- `GET /api/dashboard` → `{ totalClientes, ventasTotalesUsd, pedidosPendientes, pedidosCompletados, pedidosRecientes[] }`.
- Mantén el manejo de error de conexión ya existente.

### 3.3 Clientes
- Refactoriza `Clientes.jsx` → `useClientesController.js` (ver ejemplo arriba).
- `GET /api/clientes` (listar), `GET /api/clientes/con-pedidos` (si se quiere mostrar cuántos pedidos tiene cada cliente, opcional para una vista detallada), `GET /api/clientes/buscar?idDiscord=` (buscador), `POST /api/clientes` (crear con `{ nombreDiscord, idDiscord }`).
- Agrega un campo de búsqueda por ID de Discord que use el endpoint `/clientes/buscar`.

### 3.4 Pedido de Streaming
- Refactoriza `PedidoStreaming.jsx` → `usePedidoStreamingController.js`.
- `GET /api/pedidos/streaming` (listar), `POST /api/pedidos/streaming` con `{ nombreCliente, plataforma, correo, contrasena, fechaVencimiento, precioVenta, codigoMoneda }`.
- `GET /api/monedas` para poblar el select de moneda (actualmente parece estar fijo en "USD"; reemplázalo por un `<select>` cargado desde `/api/monedas`).
- Validar que todos los campos obligatorios estén completos antes de enviar.

### 3.5 Pedido de Robux
- Refactoriza `PedidoRobux.jsx` → `usePedidoRobuxController.js`.
- `GET /api/pedidos/robux`, `POST /api/pedidos/robux` con `{ nombreCliente, usuarioRoblox, cantidadRobux, precio, metodoEntrega, codigoMoneda }`.
- Igual que streaming: cargar monedas desde `/api/monedas` en vez de fijar "USD".

### 3.6 Nueva Inversión
- Refactoriza `NuevaInversion.jsx` → `useNuevaInversionController.js`.
- `POST /api/inversiones` con `{ nombreCliente, montoInvertido, porcentajeMensual, fechaInversionInicial }`.
- Validar montos numéricos positivos y fecha requerida.
- Al crear exitosamente, mostrar confirmación y limpiar el formulario.

### 3.7 Ver Inversiones (requiere agregar funcionalidad que falta)
- Refactoriza `VerInversiones.jsx` → `useVerInversionesController.js`.
- `GET /api/inversiones` (listar todas) y `GET /api/inversiones/buscar?cliente=` (buscador por nombre de cliente) — **agrega el input de búsqueda, hoy no existe en la vista**.
- **Agregar capital**: cada fila de inversión debe tener un botón "Agregar capital" que abra un formulario/modal simple y llame a `POST /api/inversiones/{id}/capital` con `{ monto }`. Esto replica la función que en la app original permitía sumar más capital a una inversión existente.
- **Modal de historial de inversión (falta por completo)**: al hacer clic en una fila/inversión, abrir un modal (`src/components/HistorialInversionModal.jsx`) que llame a `GET /api/historial/inversiones/{idInversion}` y liste los movimientos (fecha, monto agregado, etc). Esto replica `HistorialInversionPopUpController` + `HistorialInversionPopUp.fxml` de la app original. Créale su propio controlador `useHistorialInversionController.js`.

### 3.8 Cuentas de Streaming (administración de cuentas compradas)
- Refactoriza `CuentasStreaming.jsx` → `useCuentasStreamingController.js`.
- `GET /api/cuentas-streaming` (listar), `POST /api/cuentas-streaming` con `{ plataforma, correo, contrasena, precioCompra, codigoMoneda }`, `DELETE /api/cuentas-streaming/{id}` (agrega el botón "Eliminar" en cada fila, hoy no se usa el `del` de `api.js` en esta pantalla).

### 3.9 Historial
- Refactoriza `Historial.jsx` → `useHistorialController.js`.
- `GET /api/historial/pedidos?tipo=` donde `tipo` puede ser `Robux`, `Streaming` o `General` (todos). Agrega un selector de tipo que refresque la consulta.

### 3.10 Layout principal / Sidebar
- Ajusta `App.jsx` para envolver todas las rutas privadas (todo excepto `/login`) en un componente `ProtectedRoute` (ver sección 4).
- Agrega botón "Cerrar sesión" en `Sidebar.jsx` que borre la sesión guardada y redirija a `/login`.

---

## 4. Autenticación en el frontend (no hay backend con JWT, es sesión simple)

El backend solo valida usuario/contraseña y responde `{ success, message }`, no genera token. Implementa una sesión simple en el cliente:

- Crea `src/controllers/useAuth.js` (o `src/context/AuthContext.jsx`) que:
  - Al hacer login exitoso, guarda en `localStorage` una bandera simple, por ejemplo `localStorage.setItem('rgbr_auth', JSON.stringify({ usuario, loggedInAt: Date.now() }))`.
  - Expone `isAuthenticated()`, `login(usuario)`, `logout()`.
- Crea `src/components/ProtectedRoute.jsx`: si no hay sesión válida en `localStorage`, redirige a `/login` con `<Navigate />`.
- En `App.jsx`, agrega la ruta `/login` (sin sidebar) y envuelve el resto de rutas existentes con `ProtectedRoute`.

No uses `sessionStorage`/tokens JWT reales: el backend no los emite. Si en el futuro se agrega JWT, este `useAuth` debe ser el único lugar a modificar.

---

## 5. Reglas generales de código

- Todo el código, comentarios y textos de UI en **español**, igual que el resto del proyecto.
- Reutiliza los estilos existentes (`Pages.css`, `Sidebar.css`, clases `panel`, `card`, `btn btn-primary`, `data-table`, `badge`, etc). Para el Login y el modal nuevo, sigue la misma paleta oscura (fondo `#0b0e14`, acentos ya usados en `Pages.css`).
- Maneja siempre estados de `cargando` y `error` en cada controlador, mostrando feedback claro al usuario (no `alert()` crudos salvo que ya se use así en el archivo original; prefierieelo mensajes en la propia UI).
- No inventes campos que no existan en los DTOs del backend. Los campos exactos por pantalla están detallados en la sección 3; si tienes dudas, revisa `backend/src/main/java/com/example/aplicacionweb/dto/` y los controllers en `backend/src/main/java/com/example/aplicacionweb/controller/` antes de escribir código.
- No toques `backend/` salvo un caso: si decides que hace falta un endpoint `PUT` para editar algo que hoy no se puede editar, dímelo primero antes de crearlo (no lo agregues por tu cuenta).
- Verifica que el proyecto siga corriendo con `npm run dev` en `frontend/` sin errores de consola ni de build al terminar.

---

## 6. Entregable esperado

Al terminar debo tener:

1. `src/controllers/` con un hook por cada pantalla (10 controladores: Login, Dashboard, Clientes, PedidoStreaming, PedidoRobux, NuevaInversion, VerInversiones, HistorialInversion (modal), CuentasStreaming, Historial).
2. `src/pages/Login.jsx` nuevo y funcional.
3. `src/components/HistorialInversionModal.jsx` nuevo y funcional.
4. `src/components/ProtectedRoute.jsx` y lógica de sesión (`useAuth`).
5. Todas las páginas existentes refactorizadas para usar su controlador (sin lógica de negocio dentro del JSX).
6. `App.jsx` actualizado con la ruta `/login` pública y el resto protegidas.
7. `Sidebar.jsx` con botón de cerrar sesión.
8. La app debe verse y comportarse exactamente igual que la versión JavaFX original en cuanto a flujo: login → dashboard con menú lateral → cada ventana con su formulario y su tabla/listado, tal como hacían los `.fxml` + `Controller.java` originales.

Antes de empezar a programar, dame un resumen corto de los 10 controladores que vas a crear y en qué orden los vas a implementar.
