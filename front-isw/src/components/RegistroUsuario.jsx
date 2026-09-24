// src/components/RegistroUsuario.jsx

import { useState } from "react";

export default function RegistroUsuario({ onIngresar }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("Estudiante");
  const [colegio, setColegio] = useState("");
  const [esRegistro, setEsRegistro] = useState(true);
  const [error, setError] = useState("");

  const esColaborador =
      rol.toUpperCase().includes("COLABORADOR") ||
      rol.toUpperCase().includes("PROFESOR COLABORADOR");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor completa los campos obligatorios.");
      return;
    }

    if (esRegistro && (!nombre || !apellido || !rut)) {
      setError("Por favor completa todos los campos del registro.");
      return;
    }

    if (esRegistro && esColaborador && !colegio.trim()) {
      setError("El colegio o establecimiento es obligatorio para el Profesor Colaborador.");
      return;
    }

    const endpoint = esRegistro
        ? "http://localhost:8080/api/auth/register"
        : "http://localhost:8080/api/auth/login";

    const payload = esRegistro
        ? {
          nombre,
          apellido,
          rut,
          email,
          password,
          rol,
          colegio: esColaborador ? colegio : null,
        }
        : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.exito) {
        const usuarioSesion = {
          id: data.idUsuario,
          nombre: data.nombre || `${nombre} ${apellido}`.trim() || email.split("@")[0],
          email: data.email || email,
          rol: data.rol || rol,
          colegio: data.colegio || (esColaborador ? colegio : null),
        };

        localStorage.setItem("usuario", JSON.stringify(usuarioSesion));
        onIngresar(usuarioSesion);
      } else {
        setError(data.mensaje || "Ocurrió un error al procesar la solicitud.");
      }
    } catch (err) {
      console.error("Error en la autenticación:", err);
      setError("No se pudo conectar con el servidor.");
    }
  };

  return (
      <div style={styles.container}>
        <div style={styles.card}>
          {/* Cabecera Azul */}
          <div style={styles.header}>
            <div style={styles.brandGroup}>
              <span style={styles.badge}>MD's</span>
              <span style={styles.brandTitle}>MateDocs</span>
            </div>
            <p style={styles.headerSubtitle}>
              {esRegistro
                  ? "Cree su cuenta para comenzar"
                  : "Ingrese sus credenciales para acceder"}
            </p>
          </div>

          {/* Cuerpo del Formulario */}
          <div style={styles.body}>
            {error && <div style={styles.errorBox}>{error}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
              {esRegistro && (
                  <>
                    {/* Fila Nombre y Apellido */}
                    <div style={styles.row}>
                      <div style={styles.group}>
                        <label style={styles.label}>Nombre</label>
                        <input
                            type="text"
                            placeholder="Macarena"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            style={styles.input}
                            required
                        />
                      </div>
                      <div style={styles.group}>
                        <label style={styles.label}>Apellido</label>
                        <input
                            type="text"
                            placeholder="Gatica"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            style={styles.input}
                            required
                        />
                      </div>
                    </div>

                    {/* RUT */}
                    <div style={styles.group}>
                      <label style={styles.label}>RUT</label>
                      <input
                          type="text"
                          placeholder="11111111-1"
                          value={rut}
                          onChange={(e) => setRut(e.target.value)}
                          style={styles.input}
                          required
                      />
                    </div>
                  </>
              )}

              {/* Correo Electrónico */}
              <div style={styles.group}>
                <label style={styles.label}>Correo electrónico</label>
                <input
                    type="email"
                    placeholder="macarena@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    required
                />
              </div>

              {/* Contraseña */}
              <div style={styles.group}>
                <label style={styles.label}>Contraseña</label>
                <input
                    type="password"
                    placeholder="••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    required
                />
              </div>

              {/* Campos condicionales para Registro */}
              {esRegistro && (
                  <>
                    <div style={styles.group}>
                      <label style={styles.label}>Rol de Usuario</label>
                      <select
                          value={rol}
                          onChange={(e) => setRol(e.target.value)}
                          style={styles.select}
                      >
                        <option value="Estudiante">Estudiante</option>
                        <option value="Profesor de Asignatura">Profesor de Asignatura</option>
                        <option value="Tutor Universidad">Tutor Universidad</option>
                        <option value="Coordinador de Práctica">Coordinador de Práctica</option>
                        <option value="Colaborador">Colaborador</option>
                      </select>
                    </div>

                    {/* Campo Colegio sólo si el rol es Colaborador */}
                    {esColaborador && (
                        <div style={styles.group}>
                          <label style={styles.label}>Colegio / Establecimiento</label>
                          <input
                              type="text"
                              placeholder="Ej. Liceo Bicentenario"
                              value={colegio}
                              onChange={(e) => setColegio(e.target.value)}
                              style={styles.input}
                              required
                          />
                        </div>
                    )}
                  </>
              )}

              <button type="submit" style={styles.submitBtn}>
                {esRegistro ? "Registrar Usuario" : "Iniciar Sesión"}
              </button>
            </form>

            {/* Cambio de vista Login / Registro */}
            <div style={styles.footerText}>
              {esRegistro ? "¿Ya tienes una cuenta? " : "¿No tienes una cuenta? "}
              <span
                  onClick={() => {
                    setEsRegistro(!esRegistro);
                    setError("");
                  }}
                  style={styles.link}
              >
              {esRegistro ? "Inicia sesión aquí" : "Regístrate aquí"}
            </span>
            </div>
          </div>
        </div>
      </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#eef2f6",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#1d5278",
    color: "#ffffff",
    padding: "1.5rem 2rem 1.25rem 2rem",
  },
  brandGroup: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.4rem",
  },
  badge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#ffffff",
    padding: "0.2rem 0.5rem",
    borderRadius: "4px",
    fontSize: "0.75rem",
    fontWeight: "bold",
  },
  brandTitle: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    letterSpacing: "-0.02em",
  },
  headerSubtitle: {
    margin: 0,
    fontSize: "0.85rem",
    color: "#cbd5e1",
  },
  body: {
    padding: "1.5rem 2rem 2rem 2rem",
  },
  errorBox: {
    backgroundColor: "#fde8e8",
    color: "#9b1c1c",
    border: "1px solid #f8b4b4",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    fontSize: "0.85rem",
    marginBottom: "1.25rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  row: {
    display: "flex",
    gap: "0.75rem",
  },
  group: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: "0.35rem",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#334155",
  },
  input: {
    width: "100%",
    padding: "0.55rem 0.75rem",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.9rem",
    outline: "none",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "0.55rem 0.75rem",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.9rem",
    backgroundColor: "#ffffff",
    outline: "none",
    boxSizing: "border-box",
  },
  submitBtn: {
    marginTop: "0.5rem",
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#1d5278",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.95rem",
    fontWeight: "bold",
    cursor: "pointer",
  },
  footerText: {
    marginTop: "1.5rem",
    textAlign: "center",
    fontSize: "0.85rem",
    color: "#64748b",
  },
  link: {
    color: "#1d5278",
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "underline",
  },
};