import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useLoginController } from '../controllers/useLoginController';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const c = useLoginController({
    onLoginSuccess: (usuario) => {
      login(usuario);
      navigate('/', { replace: true });
    },
  });

  return (
    <div className="login-page" data-testid="login-page">
      <div className="login-card">
        <div className="login-brand">
          <h1>RGBR</h1>
          <p>Sistema de gestión</p>
        </div>

        <form onSubmit={c.handleSubmit} data-testid="login-form">
          <div className="login-field">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              type="text"
              placeholder="Ingresa tu usuario"
              value={c.usuario}
              onChange={(e) => c.setUsuario(e.target.value)}
              autoFocus
              data-testid="input-usuario"
            />
          </div>

          <div className="login-field">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              id="contrasena"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={c.contrasena}
              onChange={(e) => c.setContrasena(e.target.value)}
              data-testid="input-contrasena"
            />
          </div>

          {c.error && <p className="login-error" data-testid="login-error">{c.error}</p>}

          <button type="submit" className="btn btn-primary login-btn" disabled={c.cargando} data-testid="btn-ingresar">
            {c.cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
