import { useState, useEffect, useCallback } from "react";
import { ELEMENTOS_LABELS, PREGUNTAS_BOT_AVANZADO, PREGUNTAS_BOT_INICIAL, ESTUDIANTES_MOCK } from "../constants";
import { badgeVersion } from "../utils";

export default function TabChatbot({ rol }) {
  // 1. Obtener usuario desde localStorage con soporte para strings anidados
  const obtenerUsuario = () => {
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

  const usuario = obtenerUsuario();
  const rolNormalizado = (rol || usuario?.rol || usuario?.role || "").toUpperCase();
  const esEstudiante = rolNormalizado.includes("ESTUDIANTE");
  const esRevisor = !esEstudiante;

  // Si es estudiante, usar su ID real; si es docente, usar el estudiante activo del desplegable
  const idUsuarioActual = usuario?.idUsuario || usuario?.id || 1;
  const [estudianteSeleccionadoId, setEstudianteSeleccionadoId] = useState(
      esEstudiante ? idUsuarioActual : (ESTUDIANTES_MOCK[0]?.id || 1)
  );

  const [nivel, setNivel] = useState("Años iniciales");
  const [versiones, setVersiones] = useState([]);
  const [chat, setChat] = useState([]);
  const [respuesta, setRespuesta] = useState("");
  const [preguntaIndex, setPreguntaIndex] = useState(0);
  const [comentarioDocente, setComentarioDocente] = useState("");
  const [claseAutorizada, setClaseAutorizada] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sincronizar ID si cambia el estudiante en sesión
  useEffect(() => {
    if (esEstudiante && idUsuarioActual) {
      setEstudianteSeleccionadoId(idUsuarioActual);
    }
  }, [esEstudiante, idUsuarioActual]);

  // Cargar historial de planificaciones exclusivo del estudiante seleccionado
  const cargarHistorial = useCallback(async (idEstudiante) => {
    if (!idEstudiante) return;
    try {
      const res = await fetch(`http://localhost:8080/api/planificaciones/estudiante/${idEstudiante}`);
      if (res.ok) {
        const data = await res.json();
        const versionesMapeadas = data.map((item, index) => {
          // Limpiar rutas de directorios para presentar solo el nombre del PDF
          const nombreLimpio = item.rutaDocumento
              ? item.rutaDocumento.split(/[\\/]/).pop()
              : (item.titulo || `Planificacion_v${index + 1}.pdf`);

          return {
            id: item.id,
            numero: index + 1,
            archivo: nombreLimpio,
            fecha: item.fecha || new Date().toISOString().slice(0, 10),
            estado: item.estado || "En revisión",
            elementos: { objetivo: true, inicio: true, desarrollo: true, cierre: true, recursos: true, inclusionDUA: true },
            faltantes: []
          };
        });
        setVersiones(versionesMapeadas);
      } else {
        setVersiones([]);
      }
    } catch (err) {
      console.error("Error al cargar planificaciones del estudiante:", err);
      setVersiones([]);
    }
  }, []);

  useEffect(() => {
    cargarHistorial(estudianteSeleccionadoId);
  }, [estudianteSeleccionadoId, cargarHistorial]);

  const preguntas = nivel === "Años iniciales" ? PREGUNTAS_BOT_INICIAL : PREGUNTAS_BOT_AVANZADO;
  const versionActual = versiones[versiones.length - 1] || null;

  // Subir borrador inicial o nueva versión
  async function handleArchivo(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      alert("❌ Solo se admiten archivos en formato PDF.");
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("archivo", file);

    try {
      const res = await fetch(`http://localhost:8080/api/planificaciones/subir/${estudianteSeleccionadoId}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || (data && !data.exito)) {
        const faltantes = data?.elementosFaltantes || [];
        if (faltantes.length > 0) {
          alert(`❌ Documento rechazado. No se subió a la plataforma porque le faltan las siguientes secciones:\n• ${faltantes.join("\n• ")}`);
        } else {
          alert(`❌ ${data?.mensaje || "El archivo está vacío o no corresponde a una planificación válida."}`);
        }
        e.target.value = "";
        return;
      }

      alert("✅ Planificación validada y subida exitosamente.");
      e.target.value = "";
      await cargarHistorial(estudianteSeleccionadoId);

      setChat([{ from: "bot", texto: preguntas[0] }]);
      setPreguntaIndex(0);
      setComentarioDocente("");
      setClaseAutorizada(false);

    } catch (error) {
      console.error("Error de conexión:", error);
      alert("❌ Error al conectar con el servidor. Verifica que Spring Boot esté en ejecución.");
      e.target.value = "";
    }
  }

  // Reemplazar versión existente: sube el nuevo PDF y elimina la versión sustituida
  async function handleReemplazarVersion(index, e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      alert("❌ Solo se admiten archivos en formato PDF.");
      e.target.value = "";
      return;
    }

    const versionAfectada = versiones[index];
    const formData = new FormData();
    formData.append("archivo", file);

    try {
      // 1. Validar y subir el nuevo documento al backend
      const res = await fetch(`http://localhost:8080/api/planificaciones/subir/${estudianteSeleccionadoId}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || (data && !data.exito)) {
        const faltantes = data?.elementosFaltantes || [];
        if (faltantes.length > 0) {
          alert(`❌ No se pudo reemplazar. El nuevo documento carece de las siguientes secciones obligatorias:\n• ${faltantes.join("\n• ")}`);
        } else {
          alert(`❌ ${data?.mensaje || "El archivo está vacío o no es una planificación válida."}`);
        }
        e.target.value = "";
        return;
      }

      // 2. Tras confirmar la subida, eliminar la versión antigua para evitar duplicados
      if (versionAfectada?.id) {
        await fetch(`http://localhost:8080/api/planificaciones/${versionAfectada.id}`, {
          method: "DELETE",
        });
      }

      alert(`✅ Versión v${versionAfectada.numero} reemplazada correctamente por "${file.name}".`);
      e.target.value = "";
      await cargarHistorial(estudianteSeleccionadoId);

    } catch (error) {
      console.error("Error al reemplazar el documento:", error);
      alert("❌ Error de comunicación con el servidor al reemplazar la versión.");
      e.target.value = "";
    }
  }

  function actualizarVersionActual(cambios) {
    setVersiones((prev) => {
      const copia = [...prev];
      copia[copia.length - 1] = { ...copia[copia.length - 1], ...cambios };
      return copia;
    });
  }

  async function handleEnviarRespuesta(e) {
    e.preventDefault();
    if (!respuesta.trim()) return;
    const nuevoChat = [...chat, { from: "estudiante", texto: respuesta }];
    setChat(nuevoChat);
    setRespuesta("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/chatbot/planificacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nivel, historial: nuevoChat }),
      });
      if (!res.ok) throw new Error("sin conexión");
      const data = await res.json();
      setChat((prev) => [...prev, { from: "bot", texto: data.respuesta }]);
    } catch {
      const siguiente = preguntaIndex + 1;
      if (siguiente < preguntas.length) {
        setChat((prev) => [...prev, { from: "bot", texto: preguntas[siguiente] }]);
        setPreguntaIndex(siguiente);
      } else {
        setChat((prev) => [
          ...prev,
          {
            from: "bot",
            texto:
                "Retroalimentación por momentos: el inicio conecta bien con los saberes previos; el desarrollo " +
                "podría explicitar mejor los criterios de logro; el cierre requiere una síntesis más participativa.",
          },
        ]);
        actualizarVersionActual({ estado: "En revisión docente" });
      }
    } finally {
      setLoading(false);
    }
  }

  function handleAprobar() {
    actualizarVersionActual({ estado: "Aprobada" });
  }

  function handleSolicitarAjustes() {
    if (!comentarioDocente.trim()) return;
    actualizarVersionActual({ estado: "Ajustes solicitados", comentario: comentarioDocente });
  }

  return (
      <section className="panel panel--split">
        <div className="card">
          {esRevisor && (
              <div style={{ marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #e2e8f0" }}>
                <label className="field">
                  <span>Revisando al estudiante:</span>
                  <select
                      value={estudianteSeleccionadoId}
                      onChange={(e) => setEstudianteSeleccionadoId(e.target.value)}
                  >
                    {ESTUDIANTES_MOCK.map((est) => (
                        <option key={est.id} value={est.id}>{est.nombre}</option>
                    ))}
                  </select>
                </label>
              </div>
          )}

          <h2>Configuración de la planificación</h2>
          <label className="field">
            <span>Nivel del estudiante</span>
            <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
              <option>Años iniciales</option>
              <option>Avanzados con DUA/Inclusión</option>
            </select>
          </label>

          {!claseAutorizada && (
              <label className="field">
                <span>{versiones.length === 0 ? "Borrador de planificación (PDF)" : "Subir nueva versión (PDF)"}</span>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleArchivo}
                />
              </label>
          )}

          {versionActual?.estado === "Ajustes solicitados" && (
              <div className="inline-alert inline-alert--warn">
                El profesor solicitó ajustes: "{versionActual.comentario}". Sube una nueva versión cuando estén incorporados.
              </div>
          )}

          {versiones.length > 0 ? (
              <div style={{ marginTop: "20px" }}>
                <h3 style={{ fontSize: "14px", marginBottom: "8px", color: "#334155" }}>Historial de Planificaciones</h3>
                <table className="table">
                  <thead>
                  <tr>
                    <th>Versión</th>
                    <th>Archivo</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                  </thead>
                  <tbody>
                  {versiones.map((v, index) => (
                      <tr key={v.id || index}>
                        <td>v{v.numero}</td>
                        <td style={{ wordBreak: "break-all", maxWidth: "160px" }}>{v.archivo}</td>
                        <td>{v.fecha}</td>
                        <td><span className={`badge badge--${badgeVersion(v.estado)}`}>{v.estado}</span></td>
                        <td>
                          <label className="btn btn--ghost" style={{ padding: "4px 8px", fontSize: "12px", cursor: "pointer", display: "inline-block" }}>
                            Reemplazar
                            <input
                                type="file"
                                accept="application/pdf"
                                style={{ display: "none" }}
                                onChange={(e) => handleReemplazarVersion(index, e)}
                            />
                          </label>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          ) : (
              <p className="empty-state" style={{ marginTop: "20px" }}>No hay planificaciones registradas para este estudiante.</p>
          )}

          {esRevisor && versionActual && versionActual.estado === "En revisión docente" && (
              <div className="card card--muted" style={{ marginTop: "16px" }}>
                <h3>Revisar historial y comparar versiones</h3>
                <p className="muted">Compara qué sugerencias incorporó el estudiante antes de aprobar.</p>
                <label className="field">
                  <span>Comentario (requerido para solicitar ajustes)</span>
                  <textarea rows={2} value={comentarioDocente} onChange={(e) => setComentarioDocente(e.target.value)} />
                </label>
                <div className="modal__actions" style={{ justifyContent: "flex-start" }}>
                  <button className="btn btn--success" onClick={handleAprobar}>Aprobar planificación</button>
                  <button className="btn btn--ghost" onClick={handleSolicitarAjustes} disabled={!comentarioDocente.trim()}>
                    Solicitar ajustes con comentario
                  </button>
                </div>
              </div>
          )}

          {versionActual?.estado === "Aprobada" && !claseAutorizada && (
              <div className="card card--muted" style={{ marginTop: "16px" }}>
                <p className="muted">Planificación aprobada y notificada al estudiante.</p>
                {!esRevisor && (
                    <button className="btn btn--primary" onClick={() => setClaseAutorizada(true)}>
                      Presentar planificación en el establecimiento
                    </button>
                )}
              </div>
          )}

          {claseAutorizada && <p className="success-banner">✔ Clase autorizada</p>}
        </div>

        <div className="card chat-card">
          <h2>Diálogo reflexivo</h2>
          <div className="chat-window">
            {chat.length === 0 && (
                <p className="empty-state">Sube un borrador de planificación con todos los elementos mínimos para iniciar el diálogo guiado.</p>
            )}
            {chat.map((m, i) => (
                <div key={i} className={`chat-bubble chat-bubble--${m.from}`}>
                  {m.texto}
                </div>
            ))}
            {loading && <div className="chat-bubble chat-bubble--bot chat-bubble--typing">Escribiendo...</div>}
          </div>

          <form className="chat-input" onSubmit={handleEnviarRespuesta}>
            <input
                type="text"
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                placeholder="Escribe tu respuesta a la pregunta del asistente"
                disabled={chat.length === 0 || claseAutorizada}
            />
            <button type="submit" className="btn btn--primary" disabled={chat.length === 0 || loading || claseAutorizada}>
              Enviar
            </button>
          </form>
        </div>
      </section>
  );
}