import { useState, useEffect } from "react";
import { CICLOS, DOCUMENTOS_MOCK, ESTUDIANTES_MOCK } from "../constants";
import { estadoAClase } from "../utils";

export default function TabPortafolio({ usuario: usuarioProp }) {
  // 1. Obtener usuario de props o parsear localStorage
  const obtenerUsuarioInicial = () => {
    if (usuarioProp) return usuarioProp;
    try {
      const raw = localStorage.getItem("usuario") || localStorage.getItem("user") || "{}";
      let parsed = JSON.parse(raw);
      if (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }
      return parsed || {};
    } catch {
      return {};
    }
  };

  const usuario = obtenerUsuarioInicial();

  // 2. Validar rol
  const rolNormalizado = (usuario?.rol || usuario?.role || "").toUpperCase();
  const esEstudiante = rolNormalizado.includes("ESTUDIANTE");

  // 3. ID inicial
  const idUsuarioActual = usuario?.idUsuario || usuario?.id;
  const idEstudianteInicial = esEstudiante
      ? (idUsuarioActual || ESTUDIANTES_MOCK[0]?.id || 1)
      : (ESTUDIANTES_MOCK[0]?.id || 1);

  const [estudianteId, setEstudianteId] = useState(idEstudianteInicial);
  const [datosEstudianteBD, setDatosEstudianteBD] = useState(null);
  const [cicloFiltro, setCicloFiltro] = useState("Todos");
  const [documentosPorEstudiante, setDocumentosPorEstudiante] = useState(DOCUMENTOS_MOCK);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState({ asignatura: "", archivo: null, descripcion: "" });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  // Si entra un estudiante, forzar su propio ID
  useEffect(() => {
    const idReal = usuario?.idUsuario || usuario?.id;
    if (esEstudiante && idReal) {
      setEstudianteId(idReal);
    }
  }, [usuario, esEstudiante]);

  // Consulta a la API ÚNICAMENTE si quien navega es un ESTUDIANTE
  useEffect(() => {
    if (esEstudiante) {
      const idReal = usuario?.idUsuario || usuario?.id;
      if (idReal) {
        fetch(`http://localhost:8080/api/estudiantes/${idReal}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
              if (data) setDatosEstudianteBD(data);
            })
            .catch(() => {});
      }
    } else {
      // Si es docente, anular datos de BD para que mande 100% el desplegable
      setDatosEstudianteBD(null);
    }
  }, [usuario, esEstudiante]);

  // Búsqueda flexible comparando tipos compatibles (evita '1' !== 1)
  const estudianteMock = ESTUDIANTES_MOCK.find(
      (e) => String(e.id) === String(estudianteId)
  );

  // 4. Determinar el nombre visible
  const obtenerNombreCompleto = () => {
    // VISTA DOCENTE: Manda siempre el alumno seleccionado en el select
    if (!esEstudiante) {
      return estudianteMock?.nombre || "Estudiante seleccionado";
    }

    // VISTA ESTUDIANTE:
    if (datosEstudianteBD?.nombre && datosEstudianteBD?.apellido) {
      return `${datosEstudianteBD.nombre} ${datosEstudianteBD.apellido}`;
    }
    if (datosEstudianteBD?.nombre) return datosEstudianteBD.nombre;

    if (usuario?.nombreCompleto) return usuario.nombreCompleto;
    if (usuario?.nombre) return `${usuario.nombre} ${usuario.apellido || ""}`.trim();

    if (usuario?.email) {
      const alias = usuario.email.split("@")[0].replace(/[._-]/g, " ");
      return alias
          .split(" ")
          .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
          .join(" ");
    }

    return "Estudiante";
  };

  const nombreFinal = obtenerNombreCompleto();
  const carreraFinal = !esEstudiante
      ? (estudianteMock?.carrera || "Pedagogía en Educación Parvularia")
      : (datosEstudianteBD?.carrera || usuario?.carrera || "Pedagogía en Educación Parvularia");

  const documentos = (documentosPorEstudiante[estudianteId] || []).filter(
      (d) => cicloFiltro === "Todos" || d.ciclo === cicloFiltro
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.asignatura || !form.archivo) {
      setMensaje({ tipo: "error", texto: "Completa la asignatura y adjunta el archivo PDF." });
      return;
    }
    setLoading(true);
    setMensaje(null);
    try {
      const payload = new FormData();
      payload.append("estudianteId", estudianteId);
      payload.append("asignatura", form.asignatura);
      payload.append("descripcion", form.descripcion);
      payload.append("archivo", form.archivo);

      const res = await fetch("http://localhost:8080/api/estudiantes/informes", {
        method: "POST",
        body: payload,
      });
      if (!res.ok) throw new Error("Respuesta no válida del servidor");

      const nuevo = {
        ciclo: cicloFiltro === "Todos" ? "Inicial" : cicloFiltro,
        tipo: "Informe Final de Práctica",
        asignatura: form.asignatura,
        fecha: new Date().toISOString().slice(0, 10),
        estado: "En revisión",
      };
      setDocumentosPorEstudiante((prev) => ({
        ...prev,
        [estudianteId]: [...(prev[estudianteId] || []), nuevo],
      }));
      setMensaje({ tipo: "ok", texto: "Documento enviado y asociado automáticamente al portafolio del estudiante." });
      setForm({ asignatura: "", archivo: null, descripcion: "" });
      setModalAbierto(false);
    } catch (err) {
      const nuevo = {
        ciclo: cicloFiltro === "Todos" ? "Inicial" : cicloFiltro,
        tipo: "Informe Final de Práctica",
        asignatura: form.asignatura,
        fecha: new Date().toISOString().slice(0, 10),
        estado: "Pendiente de sincronizar",
      };
      setDocumentosPorEstudiante((prev) => ({
        ...prev,
        [estudianteId]: [...(prev[estudianteId] || []), nuevo],
      }));
      setMensaje({ tipo: "warn", texto: `No se pudo contactar la API (${err.message}). Se guardó localmente y se sincronizará luego.` });
      setModalAbierto(false);
    } finally {
      setLoading(false);
    }
  }

  return (
      <section className="panel">
        <div className="panel__toolbar">
          {!esEstudiante && (
              <label className="field">
                <span>Estudiante</span>
                <select
                    value={estudianteId}
                    onChange={(e) => setEstudianteId(e.target.value)}
                >
                  {ESTUDIANTES_MOCK.map((e) => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>
                  ))}
                </select>
              </label>
          )}

          <label className="field">
            <span>Ciclo formativo</span>
            <select value={cicloFiltro} onChange={(e) => setCicloFiltro(e.target.value)}>
              <option>Todos</option>
              {CICLOS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>

          <button className="btn btn--primary" onClick={() => setModalAbierto(true)}>
            + Subir informe / proyecto
          </button>
        </div>

        <div className="card">
          <h2>{nombreFinal}</h2>
          <p className="muted">{carreraFinal} · Portafolio único: planificaciones, evaluaciones e informes en un solo lugar</p>

          {documentos.length === 0 ? (
              <p className="empty-state">Aún no hay documentos cargados para este filtro.</p>
          ) : (
              <table className="table">
                <thead>
                <tr>
                  <th>Ciclo</th>
                  <th>Tipo de documento</th>
                  <th>Asignatura</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
                </thead>
                <tbody>
                {documentos.map((d, i) => (
                    <tr key={i}>
                      <td>{d.ciclo}</td>
                      <td>{d.tipo}</td>
                      <td>{d.asignatura}</td>
                      <td>{d.fecha}</td>
                      <td><span className={`badge badge--${estadoAClase(d.estado)}`}>{d.estado}</span></td>
                    </tr>
                ))}
                </tbody>
              </table>
          )}
        </div>

        {mensaje && <p className={`inline-alert inline-alert--${mensaje.tipo}`}>{mensaje.texto}</p>}

        {modalAbierto && (
            <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Subir documento de práctica</h3>
                <form onSubmit={handleSubmit}>
                  <label className="field">
                    <span>Asignatura de práctica</span>
                    <input
                        type="text"
                        value={form.asignatura}
                        onChange={(e) => setForm({ ...form, asignatura: e.target.value })}
                        placeholder="Ej: Práctica Profesional II"
                    />
                  </label>
                  <label className="field">
                    <span>Archivo (PDF)</span>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setForm({ ...form, archivo: e.target.files[0] })}
                    />
                  </label>
                  <label className="field">
                    <span>Descripción</span>
                    <textarea
                        rows={3}
                        value={form.descripcion}
                        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                        placeholder="Breve resumen del contenido del documento"
                    />
                  </label>
                  <div className="modal__actions">
                    <button type="button" className="btn btn--ghost" onClick={() => setModalAbierto(false)}>Cancelar</button>
                    <button type="submit" className="btn btn--primary" disabled={loading}>
                      {loading ? "Enviando..." : "Enviar documento"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </section>
  );
}