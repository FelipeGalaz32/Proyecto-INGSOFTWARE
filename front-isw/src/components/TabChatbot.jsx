import { useState } from "react";
import { ELEMENTOS_LABELS, PREGUNTAS_BOT_AVANZADO, PREGUNTAS_BOT_INICIAL } from "../constants";
import { badgeVersion } from "../utils";

export default function TabChatbot({ rol }) {
  const [nivel, setNivel] = useState("Años iniciales");
  const [versiones, setVersiones] = useState([]);
  const [chat, setChat] = useState([]);
  const [respuesta, setRespuesta] = useState("");
  const [preguntaIndex, setPreguntaIndex] = useState(0);
  const [comentarioDocente, setComentarioDocente] = useState("");
  const [claseAutorizada, setClaseAutorizada] = useState(false);
  const [loading, setLoading] = useState(false);

  const preguntas = nivel === "Años iniciales" ? PREGUNTAS_BOT_INICIAL : PREGUNTAS_BOT_AVANZADO;
  const esRevisor = rol !== "Estudiante";
  const versionActual = versiones[versiones.length - 1] || null;

  async function handleArchivo(e) {
    const file = e.target.files[0];
    if (!file) return;

    // --- INICIO CONEXIÓN BACKEND (HU-07) ---
    const formData = new FormData();
    formData.append("archivo", file);

    try {
      // Disparamos la petición al puerto 8080 (Spring Boot)
      const res = await fetch("http://localhost:8080/api/planificaciones/subir", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        alert("❌ Error: No se pudo subir el archivo al servidor.");
        return; // Detenemos el flujo si el backend falla
      }
      console.log("✅ PDF subido con éxito a Spring Boot");
    } catch (error) {
      console.error("Error de red:", error);
      alert("❌ Error de conexión. Verifica que Spring Boot esté corriendo.");
      return;
    }
    // --- FIN CONEXIÓN BACKEND ---

    // A partir de aquí, mantenemos tu lógica visual original para que el chatbot reaccione:
    const elementos = {
      objetivo: true,
      inicio: true,
      desarrollo: true,
      cierre: true,
      recursos: true,
      inclusionDUA: true,
    };
    const faltantes = Object.entries(elementos).filter(([, ok]) => !ok).map(([k]) => ELEMENTOS_LABELS[k]);

    const nuevaVersion = {
      numero: versiones.length + 1,
      archivo: file.name,
      fecha: new Date().toISOString().slice(0, 10),
      elementos,
      faltantes,
      estado: faltantes.length > 0 ? "Rechazada" : "En diálogo reflexivo",
    };

    setVersiones((prev) => [...prev, nuevaVersion]);
    setComentarioDocente("");
    setClaseAutorizada(false);

    if (faltantes.length === 0) {
      setChat([{ from: "bot", texto: preguntas[0] }]);
      setPreguntaIndex(0);
    } else {
      setChat([]);
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

  async function handleReemplazarVersion(index, e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("archivo", file);

    try {
      await fetch("http://localhost:8080/api/planificaciones/subir", {
        method: "POST",
        body: formData,
      });
      console.log("✅ Versión reemplazada y subida al backend con éxito");
    } catch (error) {
      console.error("Error al reemplazar en el servidor:", error);
    }

    setVersiones((prev) => {
      const copia = [...prev];
      copia[index] = {
        ...copia[index],
        archivo: file.name,
        fecha: new Date().toISOString().slice(0, 10),
        estado: "Actualizado / En revisión"
      };
      return copia;
    });
  }

  function handleSolicitarAjustes() {
    if (!comentarioDocente.trim()) return;
    actualizarVersionActual({ estado: "Ajustes solicitados", comentario: comentarioDocente });
  }

  const puedeSubirNuevaVersion =
      !versionActual || ["Rechazada", "Ajustes solicitados"].includes(versionActual.estado);

  return (
      <section className="panel panel--split">
        <div className="card">
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
                    disabled={!puedeSubirNuevaVersion && versiones.length > 0}
                />
              </label>
          )}

          {versionActual?.faltantes.length > 0 && (
              <div className="inline-alert inline-alert--error">
                Documento único rechazado automáticamente: faltan {versionActual.faltantes.join(", ")}. Corrige y sube una nueva versión.
              </div>
          )}

          {versionActual?.estado === "Ajustes solicitados" && (
              <div className="inline-alert inline-alert--warn">
                El profesor solicitó ajustes: "{versionActual.comentario}". Sube una nueva versión cuando estén incorporados.
              </div>
          )}

          {versiones.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h3 style={{ fontSize: "14px", marginBottom: "8px", color: "#334155" }}>Historial de Planificaciones (HU-24)</h3>
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
                      <tr key={v.numero}>
                        <td>v{v.numero}</td>
                        <td style={{ wordBreak: "break-all", maxWidth: "120px" }}>{v.archivo}</td>
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
          )}

          {esRevisor && versionActual && versionActual.estado === "En revisión docente" && (
              <div className="card card--muted">
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
              <div className="card card--muted">
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