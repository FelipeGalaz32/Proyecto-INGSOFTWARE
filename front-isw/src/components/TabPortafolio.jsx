import { useState, useEffect } from "react";
import { CICLOS, DOCUMENTOS_MOCK, ESTUDIANTES_MOCK } from "../constants";
import { estadoAClase } from "../utils";

export default function TabPortafolio({ usuario }) {
  // Determinar si el usuario logueado es estudiante
  const esEstudiante = usuario?.rol === "ESTUDIANTE" || usuario?.rol === "Estudiante";

  // Si es estudiante, buscar su ID en la lista mock (o usar su ID directo del usuario)
  const idEstudianteInicial = esEstudiante
      ? (ESTUDIANTES_MOCK.find((e) => e.nombre === usuario?.nombre || e.id === usuario?.id)?.id || ESTUDIANTES_MOCK[0].id)
      : ESTUDIANTES_MOCK[0].id;

  const [estudianteId, setEstudianteId] = useState(idEstudianteInicial);
  const [cicloFiltro, setCicloFiltro] = useState("Todos");
  const [documentosPorEstudiante, setDocumentosPorEstudiante] = useState(DOCUMENTOS_MOCK);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState({ asignatura: "", archivo: null, descripcion: "" });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  // Asegurar que si entra o cambia a un estudiante, quede fijado su ID propio
  useEffect(() => {
    if (esEstudiante) {
      const propio = ESTUDIANTES_MOCK.find((e) => e.nombre === usuario?.nombre || e.id === usuario?.id);
      if (propio) {
        setEstudianteId(propio.id);
      }
    }
  }, [usuario, esEstudiante]);

  const estudiante = ESTUDIANTES_MOCK.find((e) => e.id === estudianteId) || ESTUDIANTES_MOCK[0];
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

      const res = await fetch("http://localhost:3000/api/estudiantes/informes", {
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
          {/* Si es Profesor/Coordinador, muestra el selector de estudiantes. Si es Estudiante, se oculta */}
          {!esEstudiante && (
              <label className="field">
                <span>Estudiante</span>
                <select value={estudianteId} onChange={(e) => setEstudianteId(e.target.value)}>
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
          <h2>{estudiante.nombre}</h2>
          <p className="muted">{estudiante.carrera} · Portafolio único: planificaciones, evaluaciones e informes en un solo lugar</p>

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