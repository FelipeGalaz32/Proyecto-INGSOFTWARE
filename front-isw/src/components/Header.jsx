export default function Header({ usuario, onCerrarSesion }) {
  return (
    <header className="app-header">
      <div className="app-header__title">
        <span className="app-header__badge">MD's</span>
        <div>
          <h1>MateDocs</h1>
          <p>Portafolio único, evaluación digital y planificaciones con retroalimentación</p>
        </div>
      </div>

      <div className="user-badge">
        <div>
          <strong>{usuario.nombre}</strong>
          <span className="user-badge__rol">{usuario.rol}</span>
        </div>
        <button className="btn btn--ghost" onClick={onCerrarSesion}>Cerrar sesión</button>
      </div>
    </header>
  );
}
