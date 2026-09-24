import { useState, useEffect, useCallback } from "react";
import { ELEMENTOS_LABELS, PREGUNTAS_BOT_AVANZADO, PREGUNTAS_BOT_INICIAL, ESTUDIANTES_MOCK } from "../constants";
import { badgeVersion } from "../utils";

export default function TabChatbot({ rol }) {
  // 1. Obtener usuario desde localStorage
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

  // Estado para controlar el modal flotante
  // Estructura: { tipo: 'exito' | 'error' | 'advertencia', titulo: '', mensaje: '', detalles: [] }
  const [notificacion, setNotificacion] = useState(null);

  const mostrarModal = (tipo, titulo, mensaje, detalles = []) => {
    setNotificacion({ tipo, titulo, mensaje, detalles });
  };

  const cerrarModal = () => {
    setNotificacion(null);
  };

  // Cerrar también con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") cerrarModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Sincronizar ID si cambia el estudiante en sesión
  useEffect(() => {
    if (esEstudiante && idUsuarioActual) {
      setEstudianteSeleccionadoId(idUsuarioActual);
    }
  }, [esEstudiante, idUsuarioActual]);

  // Cargar historial de planificaciones
  const cargarHistorial = useCallback(async (idEstudiante) => {
    if (!idEstudiante) return;
    try {
      const res = await fetch(`http://localhost:8080/api/planificaciones/estudiante/${idEstudiante}`);
      if (res.ok) {
        const data = await res.json();
        const versionesMapeadas = data.map((item, index) => {
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
      console.error("Error al cargar planificaciones:", err);
      setVersiones([]);
    }
  }, []);

  useEffect(() => {
    cargarHistorial(estudianteSeleccionadoId);
  }, [estudianteSeleccionadoId, cargarHistorial]);

  const preguntas = nivel === "Años iniciales" ? PREGUNTAS_BOT_INICIAL : PREGUNTAS_BOT_AVANZADO;
  const versionActual = versiones[versiones.length - 1] || null;

  // 1. Subida de borrador o nueva versión
  async function handleArchivo(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      mostrarModal(
          "error",
          "Formato incompatible",
          "Solo se admiten documentos en formato PDF (.pdf)."
      );
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
          const nombresLegibles = faltantes.map((f) => ELEMENTOS_LABELS?.[f] || f);
          mostrarModal(
              "advertencia",
              "Planificación incompleta",
              "El archivo fue procesado correctamente, pero no cumple con las siguientes secciones obligatorias:",
              nombresLegibles
          );
        } else {
          mostrarModal(
              "error",
              "Validación fallida",
              data?.mensaje || "El archivo está vacío, dañado o no es una planificación válida."
          );
        }
        e.target.value = "";
        return;
      }

      mostrarModal(
          "exito",
          "¡Planificación aceptada!",
          `El documento "${file.name}" superó la validación pedagógica y fue guardado exitosamente.`
      );
      e.target.value = "";
      await cargarHistorial(estudianteSeleccionadoId);

      setChat([{ from: "bot", texto: preguntas[0] }]);
      setPreguntaIndex(0);
      setComentarioDocente("");
      setClaseAutorizada(false);

    } catch (error) {
      console.error("Error de conexión:", error);
      mostrarModal(
          "error",
          "Error de conexión",
          "No se pudo contactar al servidor backend. Verifica que Spring Boot esté ejecutándose."
      );
      e.target.value = "";
    }
  }

  // 2. Reemplazar versión existente
  async function handleReemplazarVersion(index, e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      mostrarModal(
          "error",
          "Formato incompatible",
          "Solo se admiten documentos en formato PDF (.pdf)."
      );
      e.target.value = "";
      return;
    }

    const versionAfectada = versiones[index];
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
          const nombresLegibles = faltantes.map((f) => ELEMENTOS_LABELS?.[f] || f);
          mostrarModal(
              "advertencia",
              "No se pudo reemplazar",
              "El nuevo archivo carece de las siguientes secciones pedagógicas obligatorias:",
              nombresLegibles
          );
        } else {
          mostrarModal(
              "error",
              "Reemplazo rechazado",
              data?.mensaje || "El archivo no es válido."
          );
        }
        e.target.value = "";
        return;
      }

      // Eliminar registro anterior si la subida fue exitosa
      if (versionAfectada?.id) {
        await fetch(`http://localhost:8080/api/planificaciones/${versionAfectada.id}`, {
          method: "DELETE",
        });
      }

      mostrarModal(
          "exito",
          "Versión reemplazada",
          `La versión v${versionAfectada.numero} ha sido sustituida exitosamente por "${file.name}".`
      );
      e.target.value = "";
      await cargarHistorial(estudianteSeleccionadoId);

    } catch (error) {
      console.error("Error al reemplazar el documento:", error);
      mostrarModal(
          "error",
          "Error de servidor",
          "Ocurrió un inconveniente al comunicarse con el servidor durante el reemplazo."
      );
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

  // Definición de colores y estilos según el tipo de alerta
  const estiloPorTipo = {
    exito: {
      colorIcono: "#16a34a",
      bgIcono: "#dcfce7",
      icono: "✓",
      btnColor: "#16a34a",
    },
    advertencia: {
      colorIcono: "#d97706",
      bgIcono: "#fef3c7",
      icono: "!",
      btnColor: "#25547b",
    },
    error: {
      colorIcono: "#dc2626",
      bgIcono: "#fee2e2",
      icono: "✕",
      btnColor: "#dc2626",
    },
  }[notificacion?.tipo || "advertencia"];

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

        {/* MODAL FLOTANTE MODERNO CON DESENFOQUE DE FONDO */}
        {notificacion && (
            <div
                onClick={cerrarModal}
                style={{
                  position: "fixed",
                  inset: 0,
                  backgroundColor: "rgba(15, 23, 42, 0.45)",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 9999,
                  padding: "20px",
                  animation: "fadeIn 0.15s ease-out",
                }}
            >
              <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "16px",
                    maxWidth: "460px",
                    width: "100%",
                    padding: "28px 24px",
                    boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
              >
                {/* Ícono de estado */}
                <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      backgroundColor: estiloPorTipo.bgIcono,
                      color: estiloPorTipo.colorIcono,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "26px",
                      fontWeight: "700",
                      marginBottom: "16px",
                    }}
                >
                  {estiloPorTipo.icono}
                </div>

                {/* Título */}
                <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", color: "#1e293b", fontWeight: "700" }}>
                  {notificacion.titulo}
                </h3>

                {/* Mensaje explicativo */}
                <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "#64748b", lineHeight: "1.5" }}>
                  {notificacion.mensaje}
                </p>

                {/* Lista de secciones faltantes (si aplica) */}
                {notificacion.detalles && notificacion.detalles.length > 0 && (
                    <div
                        style={{
                          width: "100%",
                          backgroundColor: "#f8fafc",
                          borderRadius: "10px",
                          padding: "12px 16px",
                          marginBottom: "20px",
                          textAlign: "left",
                          border: "1px solid #e2e8f0",
                        }}
                    >
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#475569", textTransform: "uppercase" }}>
                  Secciones requeridas:
                </span>
                      <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px", fontSize: "13px", color: "#334155" }}>
                        {notificacion.detalles.map((item, idx) => (
                            <li key={idx} style={{ marginBottom: "4px" }}>{item}</li>
                        ))}
                      </ul>
                    </div>
                )}

                {/* Botón de cierre */}
                <button
                    onClick={cerrarModal}
                    style={{
                      width: "100%",
                      padding: "11px 16px",
                      backgroundColor: estiloPorTipo.btnColor,
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      fontSize: "14px",
                      cursor: "pointer",
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Aceptar
                </button>
              </div>
            </div>
        )}
      </section>
  );
}