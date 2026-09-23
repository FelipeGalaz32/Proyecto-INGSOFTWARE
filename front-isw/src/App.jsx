import { useState, useRef } from "react";
import "./App.css";

const ROLES = ["Estudiante", "Profesor Tutor / Asignatura", "Coordinador de Práctica"];
const TABS = [
  { id: "portafolio", label: "Portafolio del Estudiante" },
  { id: "evaluacion", label: "Evaluación de Clase" },
  { id: "chatbot", label: "Planificaciones y Reflexión" },
  { id: "dashboard", label: "Dashboard CNA" },
];

const ESTUDIANTES_MOCK = [
  { id: "e1", nombre: "Javiera Contreras Muñoz", carrera: "Pedagogía en Educación Básica" },
  { id: "e2", nombre: "Matías Fuentes Rojas", carrera: "Pedagogía en Educación Parvularia" },
  { id: "e3", nombre: "Camila Soto Herrera", carrera: "Pedagogía en Ed. Diferencial" },
];

const CICLOS = ["Inicial", "Intermedio", "Final"];
const ASIGNATURAS_CNA = [
  "Práctica I", "Práctica II", "Práctica III", "Práctica IV", "Práctica V", "Práctica Profesional",
];

const DOCUMENTOS_MOCK = {
  e1: [
    { ciclo: "Inicial", tipo: "Proyecto de Intervención", asignatura: "Práctica I", fecha: "2026-04-12", estado: "Aprobado" },
    { ciclo: "Intermedio", tipo: "Informe Final de Práctica", asignatura: "Práctica II", fecha: "2026-07-03", estado: "En revisión" },
  ],
  e2: [
    { ciclo: "Inicial", tipo: "Informe Final de Práctica", asignatura: "Práctica I", fecha: "2026-05-20", estado: "Aprobado" },
  ],
  e3: [],
};

const DIMENSIONES = [
  {
    nombre: "Estrategia de Enseñanza",
    indicadores: [
      "Claridad de los objetivos de aprendizaje",
      "Variedad y pertinencia de las estrategias didácticas",
      "Uso de recursos y materiales de apoyo",
    ],
  },
  {
    nombre: "Gestión del Aula",
    indicadores: [
      "Organización del tiempo y transiciones",
      "Manejo de normas y convivencia",
      "Ambiente propicio para el aprendizaje",
    ],
  },
  {
    nombre: "Orientación al Estudiante",
    indicadores: [
      "Retroalimentación oportuna durante la clase",
      "Atención a la diversidad e inclusión",
      "Vínculo pedagógico con el curso",
    ],
  },
];

const ELEMENTOS_LABELS = {
  objetivo: "Objetivo de aprendizaje",
  inicio: "Inicio",
  desarrollo: "Desarrollo",
  cierre: "Cierre",
  recursos: "Recursos",
  inclusionDUA: "Inclusión / DUA",
};

const PREGUNTAS_BOT_INICIAL = [
  "¿Qué aprendizaje esperas que tus estudiantes logren al finalizar la clase?",
  "¿Cómo se conecta el inicio de tu clase con los conocimientos previos del curso?",
  "¿Qué evidencia recogerás durante el desarrollo para saber si se está logrando el objetivo?",
  "¿Cómo cerrarás la clase para verificar que el aprendizaje ocurrió?",
];

const PREGUNTAS_BOT_AVANZADO = [
  "¿Qué barreras de aprendizaje anticipas en este grupo y cómo las abordas desde el DUA?",
  "¿Qué formas alternativas de representación, expresión o participación ofreces?",
  "¿Cómo se ajusta el cierre de la clase a los distintos ritmos de tus estudiantes?",
  "¿Qué recursos de apoyo tienes previstos para estudiantes con necesidades específicas?",
  "¿Cómo evaluarás el logro considerando las adecuaciones realizadas?",
];

function ProgressBar({ value }) {
  return (
    <div className="progress-track" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress-fill" style={{ width: `${value}%` }} />
    </div>
  );
}

export default function App() {
  const [rol, setRol] = useState(ROLES[0]);
  const [tabActiva, setTabActiva] = useState(TABS[0].id);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__title">
          <span className="app-header__badge">SGPP</span>
          <div>
            <h1>Sistema Integrado de Gestión de Prácticas Pedagógicas</h1>
            <p>Portafolio único, evaluación digital y planificaciones con retroalimentación</p>
          </div>
        </div>

        <label className="role-select">
          <span>Rol activo</span>
          <select value={rol} onChange={(e) => setRol(e.target.value)}>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>
      </header>

      <nav className="tab-nav">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab-nav__item ${tabActiva === t.id ? "is-active" : ""}`}
            onClick={() => setTabActiva(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="app-content">
        {tabActiva === "portafolio" && <TabPortafolio />}
        {tabActiva === "evaluacion" && <TabEvaluacion rol={rol} />}
        {tabActiva === "chatbot" && <TabChatbot rol={rol} />}
        {tabActiva === "dashboard" && <TabDashboard rol={rol} />}
      </main>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* PESTAÑA 1 — Portafolio y Expediente del Estudiante                */
/* ---------------------------------------------------------------- */
function TabPortafolio() {
  const [estudianteId, setEstudianteId] = useState(ESTUDIANTES_MOCK[0].id);
  const [cicloFiltro, setCicloFiltro] = useState("Todos");
  const [documentosPorEstudiante, setDocumentosPorEstudiante] = useState(DOCUMENTOS_MOCK);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState({ asignatura: "", archivo: null, descripcion: "" });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const estudiante = ESTUDIANTES_MOCK.find((e) => e.id === estudianteId);
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
        <label className="field">
          <span>Estudiante</span>
          <select value={estudianteId} onChange={(e) => setEstudianteId(e.target.value)}>
            {ESTUDIANTES_MOCK.map((e) => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>
        </label>

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

function estadoAClase(estado) {
  if (estado === "Aprobado") return "success";
  if (estado === "En revisión") return "warning";
  return "neutral";
}

/* ---------------------------------------------------------------- */
/* PESTAÑA 2 — Evaluación Digital de Clase y Notas de Voz            */
/*   ToBe: registro desde tablet/móvil, nota de voz opcional,        */
/*   transcripción, publicación de resultados y vista del estudiante */
/* ---------------------------------------------------------------- */
function TabEvaluacion({ rol }) {
  const [puntajes, setPuntajes] = useState({});
  const [grabando, setGrabando] = useState(false);
  const [transcripcion, setTranscripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [guardada, setGuardada] = useState(false);
  const [publicada, setPublicada] = useState(false);
  const timeoutRef = useRef(null);

  function setPuntaje(clave, valor) {
    setPuntajes((prev) => ({ ...prev, [clave]: valor }));
    setGuardada(false);
  }

  function handleGrabar() {
    if (grabando) {
      clearTimeout(timeoutRef.current);
      setGrabando(false);
      return;
    }
    setGrabando(true);
    setTranscripcion("");
    // Simula: funciona aun con conexión inestable (guarda local y transcribe al reconectar)
    timeoutRef.current = setTimeout(() => {
      setGrabando(false);
      setTranscripcion(
        "El tutor destaca el manejo de tiempos durante el desarrollo de la clase y sugiere reforzar " +
          "las preguntas de cierre para verificar comprensión en todo el curso. Se observa buen vínculo " +
          "con los estudiantes con mayor dificultad."
      );
      setGuardada(false);
    }, 2500);
  }

  async function handleGuardar() {
    setLoading(true);
    setMensaje(null);
    const payload = { puntajes, transcripcion, fecha: new Date().toISOString() };
    try {
      const res = await fetch("http://localhost:3000/api/evaluaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Respuesta no válida del servidor");
      setMensaje({ tipo: "ok", texto: "Pauta y transcripción guardadas en el portafolio del estudiante." });
      setGuardada(true);
    } catch (err) {
      setMensaje({ tipo: "warn", texto: `Sin conexión (${err.message}). Se guardó localmente y se sincronizará automáticamente.` });
      setGuardada(true);
    } finally {
      setLoading(false);
    }
  }

  function handlePublicar() {
    setPublicada(true);
    setMensaje({ tipo: "ok", texto: "Resultados publicados: el estudiante ya puede visualizarlos." });
  }

  const promedio = calcularPromedio(puntajes);

  if (rol === "Estudiante") {
    return (
      <section className="panel">
        <div className="card">
          <h2>Mis resultados de evaluación</h2>
          <p className="muted">Vista del estudiante: solo disponible una vez publicada por el tutor.</p>

          {!publicada ? (
            <p className="empty-state">Aún no hay resultados publicados para tu última clase observada.</p>
          ) : (
            <div className="result-summary">
              <div className="metric-row">
                <span className="metric-value">{promedio ?? "–"}</span>
                <ProgressBar value={promedio ? (promedio / 5) * 100 : 0} />
              </div>
              <h3>Observaciones del tutor</h3>
              <p>{transcripcion || "Sin observaciones registradas."}</p>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="card">
        <h2>Evaluación observacional en aula</h2>
        <p className="muted">
          Abre la pauta desde tablet o móvil y califica cada indicador de 1 (inicial) a 5 (destacado).
        </p>

        {DIMENSIONES.map((dim) => (
          <div key={dim.nombre} className="dimension">
            <h3>{dim.nombre}</h3>
            {dim.indicadores.map((ind) => {
              const clave = `${dim.nombre}__${ind}`;
              return (
                <div className="indicador" key={clave}>
                  <span>{ind}</span>
                  <div className="escala">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={`escala__punto ${puntajes[clave] === n ? "is-selected" : ""}`}
                        onClick={() => setPuntaje(clave, n)}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Retroalimentación cualitativa</h2>
        <p className="muted">Registra una nota de voz al finalizar la clase; el sistema la transcribe automáticamente.</p>

        <button className={`btn ${grabando ? "btn--recording" : "btn--secondary"}`} onClick={handleGrabar}>
          {grabando ? "● Grabando... (detener)" : "🎙️ Grabar nota de voz"}
        </button>
        <p className="info-note">Funciona incluso con conexión inestable: se guarda localmente y se sincroniza al recuperar señal.</p>

        <label className="field" style={{ marginTop: "1rem" }}>
          <span>Transcripción automática</span>
          <textarea
            rows={5}
            value={transcripcion}
            onChange={(e) => { setTranscripcion(e.target.value); setGuardada(false); }}
            placeholder={grabando ? "Transcribiendo audio..." : "Aquí aparecerá la transcripción de la nota de voz"}
          />
        </label>

        <div className="modal__actions" style={{ justifyContent: "flex-start" }}>
          <button className="btn btn--primary" onClick={handleGuardar} disabled={loading}>
            {loading ? "Guardando..." : "Guardar evaluación y transcripción"}
          </button>
          <button className="btn btn--success" onClick={handlePublicar} disabled={!guardada || publicada}>
            {publicada ? "✔ Resultados publicados" : "Publicar resultados al estudiante"}
          </button>
        </div>

        {mensaje && <p className={`inline-alert inline-alert--${mensaje.tipo}`}>{mensaje.texto}</p>}
      </div>
    </section>
  );
}

function calcularPromedio(puntajes) {
  const valores = Object.values(puntajes);
  if (valores.length === 0) return null;
  const suma = valores.reduce((a, b) => a + b, 0);
  return Math.round((suma / valores.length) * 10) / 10;
}

/* ---------------------------------------------------------------- */
/* PESTAÑA 3 — Planificaciones con validación, versiones y           */
/*   aprobación docente (según flujo SGIP propuesto)                 */
/* ---------------------------------------------------------------- */
function TabChatbot({ rol }) {
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

  function handleArchivo(e) {
    const file = e.target.files[0];
    if (!file) return;

    const elementos = {
      objetivo: true,
      inicio: true,
      desarrollo: true,
      cierre: Math.random() > 0.3,
      recursos: true,
      inclusionDUA: nivel === "Avanzados con DUA/Inclusión" ? Math.random() > 0.4 : true,
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
            <input type="file" accept="application/pdf" onChange={handleArchivo} disabled={!puedeSubirNuevaVersion && versiones.length > 0} />
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

        {versions_length_guard(versiones) && (
          <table className="table">
            <thead>
              <tr><th>Versión</th><th>Archivo</th><th>Fecha</th><th>Estado</th></tr>
            </thead>
            <tbody>
              {versiones.map((v) => (
                <tr key={v.numero}>
                  <td>v{v.numero}</td>
                  <td>{v.archivo}</td>
                  <td>{v.fecha}</td>
                  <td><span className={`badge badge--${badgeVersion(v.estado)}`}>{v.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
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

function versions_length_guard(versiones) {
  return versiones.length > 0;
}

function badgeVersion(estado) {
  if (estado === "Aprobada") return "success";
  if (estado === "Rechazada") return "danger";
  if (estado === "Ajustes solicitados") return "warning";
  return "neutral";
}

/* ---------------------------------------------------------------- */
/* PESTAÑA 4 — Dashboard CNA + flujo del Coordinador                 */
/*   (consultar portafolio, exigir pendientes, exportar evidencia)   */
/* ---------------------------------------------------------------- */
function TabDashboard({ rol }) {
  const [reporte, setReporte] = useState({
    cumplimiento: 78,
    ciclos: [
      { nombre: "Inicial", evidencias: 42, meta: 45 },
      { nombre: "Intermedio", evidencias: 30, meta: 45 },
      { nombre: "Final", evidencias: 18, meta: 45 },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const [asignaturaFiltro, setAsignaturaFiltro] = useState(ASIGNATURAS_CNA[0]);
  const [cicloFiltro, setCicloFiltro] = useState(CICLOS[0]);
  const [estadoPortafolios, setEstadoPortafolios] = useState(
    ESTUDIANTES_MOCK.map((e, i) => ({
      ...e,
      completitud: [90, 60, 35][i] ?? 50,
      pendienteSolicitado: false,
    }))
  );

  async function handleGenerarReporte() {
    setLoading(true);
    setMensaje(null);
    try {
      const res = await fetch("http://localhost:3000/api/reportes/cna");
      if (!res.ok) throw new Error("Respuesta no válida del servidor");
      const data = await res.json();
      setReporte(data);
      setMensaje({ tipo: "ok", texto: "Reporte consolidado generado y listo para exportar a la CNA." });
    } catch (err) {
      setMensaje({ tipo: "warn", texto: `No se pudo consultar la API (${err.message}). Mostrando último reporte disponible.` });
    } finally {
      setLoading(false);
    }
  }

  function handleSolicitarPendientes(id) {
    setEstadoPortafolios((prev) =>
      prev.map((e) => (e.id === id ? { ...e, pendienteSolicitado: true } : e))
    );
  }

  const todosCompletos = estadoPortafolios.every((e) => e.completitud >= 100);

  return (
    <section className="panel">
      <div className="card">
        <h2>Estándar Nivel 3 — Formación Práctica (CNA)</h2>
        <p className="muted">Cumplimiento general del estándar de acreditación.</p>
        <div className="metric-row">
          <span className="metric-value">{reporte.cumplimiento}%</span>
          <ProgressBar value={reporte.cumplimiento} />
        </div>
      </div>

      <div className="cards-grid">
        {reporte.ciclos.map((c) => (
          <div className="card stat-card" key={c.nombre}>
            <h3>Ciclo {c.nombre}</h3>
            <p className="stat-card__number">{c.evidencias}/{c.meta}</p>
            <p className="muted">Evidencias recolectadas</p>
            <ProgressBar value={Math.round((c.evidencias / c.meta) * 100)} />
          </div>
        ))}
      </div>

      {rol === "Coordinador de Práctica" && (
        <div className="card">
          <h2>Consultar portafolio y estado de avance por estudiante</h2>
          <div className="panel__toolbar">
            <label className="field">
              <span>Asignatura</span>
              <select value={asignaturaFiltro} onChange={(e) => setAsignaturaFiltro(e.target.value)}>
                {ASIGNATURAS_CNA.map((a) => <option key={a}>{a}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Ciclo / período</span>
              <select value={cicloFiltro} onChange={(e) => setCicloFiltro(e.target.value)}>
                {CICLOS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
          </div>

          <table className="table">
            <thead>
              <tr><th>Estudiante</th><th>Completitud portafolio</th><th>Estado</th><th>Acción</th></tr>
            </thead>
            <tbody>
              {estadoPortafolios.map((e) => (
                <tr key={e.id}>
                  <td>{e.nombre}</td>
                  <td style={{ minWidth: 160 }}><ProgressBar value={e.completitud} /></td>
                  <td>
                    <span className={`badge badge--${e.completitud >= 100 ? "success" : "warning"}`}>
                      {e.completitud >= 100 ? "Completo" : "Información incompleta"}
                    </span>
                  </td>
                  <td>
                    {e.completitud >= 100 ? (
                      <span className="muted">—</span>
                    ) : (
                      <button className="btn btn--ghost" disabled={e.pendienteSolicitado} onClick={() => handleSolicitarPendientes(e.id)}>
                        {e.pendienteSolicitado ? "✔ Solicitado" : "Solicitar documentos pendientes"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!todosCompletos && (
            <p className="info-note">
              Filtros por asignatura, ciclo o generación se aplican al informe exportable una vez que la información esté completa.
            </p>
          )}
        </div>
      )}

      <div className="card">
        <button className="btn btn--primary" onClick={handleGenerarReporte} disabled={loading}>
          {loading ? "Generando..." : "Revisar y exportar informe consolidado para la CNA"}
        </button>
        {mensaje && <p className={`inline-alert inline-alert--${mensaje.tipo}`}>{mensaje.texto}</p>}
      </div>
    </section>
  );
}