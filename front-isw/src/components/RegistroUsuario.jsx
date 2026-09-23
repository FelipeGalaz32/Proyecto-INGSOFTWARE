import { useMemo, useState } from "react";
import { ROLES } from "../constants";
import { detectarTipoCuenta } from "../utils";

export default function RegistroUsuario({ onIngresar }) {
  const [modo, setModo] = useState("registro"); // "registro" | "login"
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [rolManual, setRolManual] = useState("");
  const [error, setError] = useState(null);

  const tipoDetectado = useMemo(() => detectarTipoCuenta(correo), [correo]);

  function handleCorreoChange(valor) {
    setCorreo(valor);
    setRolManual("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (modo === "registro" && !nombre.trim()) {
      setError("Ingresa tu nombre completo.");
      return;
    }
    if (!correo.trim() || !contrasena.trim()) {
      setError("Completa correo y contraseña.");
      return;
    }
    if (contrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (modo === "registro" && contrasena !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    let rolFinal;
    if (tipoDetectado === "estudiante") {
      rolFinal = "Estudiante";
    } else if (tipoDetectado === "profesor") {
      rolFinal = rolManual || "Profesor Tutor / Asignatura";
    } else {
      if (!rolManual) {
        setError("No pudimos determinar el tipo de cuenta a partir de tu correo: selecciona tu rol.");
        return;
      }
      rolFinal = rolManual;
    }

    onIngresar({
      nombre: nombre.trim() || correo.split("@")[0],
      correo: correo.trim(),
      rol: rolFinal,
    });
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <span className="app-header__badge">SGPP</span>
        <h1>Sistema Integrado de Gestión de Prácticas Pedagógicas</h1>
        <p className="muted">
          El tipo de cuenta (estudiante o profesor) se determina automáticamente a partir de tu correo institucional.
        </p>

        <div className="auth-tabs">
          <button type="button" className={modo === "registro" ? "is-active" : ""} onClick={() => setModo("registro")}>
            Crear cuenta
          </button>
          <button type="button" className={modo === "login" ? "is-active" : ""} onClick={() => setModo("login")}>
            Iniciar sesión
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {modo === "registro" && (
            <label className="field">
              <span>Nombre completo</span>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Javiera Contreras" />
            </label>
          )}

          <label className="field">
            <span>Correo institucional</span>
            <input
              type="email"
              value={correo}
              onChange={(e) => handleCorreoChange(e.target.value)}
              placeholder="nombre@alumnos.universidad.cl"
            />
          </label>

          {correo && (
            <p className="info-note">
              {tipoDetectado === "estudiante" && "Detectamos una cuenta de estudiante."}
              {tipoDetectado === "profesor" && "Detectamos una cuenta docente. Confirma tu perfil:"}
              {tipoDetectado === "desconocido" && "No pudimos determinar el tipo de cuenta por el dominio del correo. Selecciona tu rol:"}
            </p>
          )}

          {tipoDetectado === "profesor" && (
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="rol"
                  value="Profesor Tutor / Asignatura"
                  checked={rolManual === "Profesor Tutor / Asignatura" || !rolManual}
                  onChange={(e) => setRolManual(e.target.value)}
                />
                Profesor Tutor / Asignatura
              </label>
              <label>
                <input
                  type="radio"
                  name="rol"
                  value="Coordinador de Práctica"
                  checked={rolManual === "Coordinador de Práctica"}
                  onChange={(e) => setRolManual(e.target.value)}
                />
                Coordinador de Práctica
              </label>
            </div>
          )}

          {tipoDetectado === "desconocido" && (
            <div className="radio-group">
              {ROLES.map((r) => (
                <label key={r}>
                  <input type="radio" name="rol" value={r} checked={rolManual === r} onChange={(e) => setRolManual(e.target.value)} />
                  {r}
                </label>
              ))}
            </div>
          )}

          <label className="field">
            <span>Contraseña</span>
            <input type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} placeholder="Mínimo 6 caracteres" />
          </label>

          {modo === "registro" && (
            <label className="field">
              <span>Confirmar contraseña</span>
              <input type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} />
            </label>
          )}

          {error && <p className="inline-alert inline-alert--error">{error}</p>}

          <button type="submit" className="btn btn--primary" style={{ width: "100%" }}>
            {modo === "registro" ? "Crear cuenta" : "Iniciar sesión"}
          </button>
        </form>

        <p className="info-note">
          Ejemplos para probar: nombre@alumnos.uni.cl (estudiante) · nombre@profesores.uni.cl (docente/coordinador).
        </p>
      </div>
    </div>
  );
}
