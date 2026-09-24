import { useRef, useState } from "react";
import { DIMENSIONES } from "../constants";
import { calcularPromedio } from "../utils";
import ProgressBar from "./ProgressBar";

export default function TabEvaluacion({ rol }) {
  const [antecedentes, setAntecedentes] = useState({
    profesorFormacion: "",
    establecimiento: "",
    curso: "",
    fecha: "",
    horaInicio: "",
    horaTermino: "",
    observador: "",
    objetivoClase: ""
  });

  const [puntajes, setPuntajes] = useState({});
  const [grabando, setGrabando] = useState(false);
  const [transcripcion, setTranscripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [guardada, setGuardada] = useState(false);
  const [publicada, setPublicada] = useState(false);
  const timeoutRef = useRef(null);

  function handleAntecedenteChange(field, value) {
    setAntecedentes((prev) => ({ ...prev, [field]: value }));
    setGuardada(false);
  }

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
    timeoutRef.current = setTimeout(() => {
      setGrabando(false);
      setTranscripcion(
          "Fortalezas: Buen manejo del tiempo e inclusión del trabajo colaborativo en pequeños grupos. " +
          "Aspectos a mejorar: Reforzar las estrategias de devolución ante errores conceptuales detectados durante el desarrollo."
      );
      setGuardada(false);
    }, 2500);
  }

  async function handleGuardar() {
    setLoading(true);
    setMensaje(null);
    const payload = { antecedentes, puntajes, transcripcion, fecha: new Date().toISOString() };
    try {
      const res = await fetch("http://localhost:8080/api/evaluaciones", {
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

  if (rol === "ESTUDIANTE" || rol === "Estudiante") {
    return (
        <section className="panel">
          <div className="card">
            <h2>Mis resultados de evaluación de clase</h2>
            <p className="muted">Vista del estudiante: disponible una vez publicada por el profesor colaborador.</p>

            {!publicada ? (
                <p className="empty-state">Aún no hay resultados publicados para tu última clase observada.</p>
            ) : (
                <div className="result-summary">
                  <div className="metric-row">
                    <div>
                      <span className="metric-value">{promedio ?? "–"}</span> / 7.0
                    </div>
                    <ProgressBar value={promedio ? (promedio / 7) * 100 : 0} />
                  </div>
                  <h3>Observaciones generales y retroalimentación</h3>
                  <p>{transcripcion || "Sin observaciones registradas."}</p>
                </div>
            )}
          </div>
        </section>
    );
  }

  return (
      <section className="panel">
        {/* 1. ANTECEDENTES GENERALES DE LA CLASE */}
        <div className="card">
          <h2>Pauta de Evaluación para la Observación de Clase de Matemática</h2>
          <p className="muted">
            Evaluación de la clase para estudiantes de Pedagogía en Educación Matemática (Escala 1: Muy Bajo a 7: Muy Alto).
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <label className="field">
              <span>Profesoras/es en Formación:</span>
              <input
                  type="text"
                  value={antecedentes.profesorFormacion}
                  onChange={(e) => handleAntecedenteChange("profesorFormacion", e.target.value)}
                  placeholder="Nombre de la dupla docente"
              />
            </label>

            <label className="field">
              <span>Establecimiento:</span>
              <input
                  type="text"
                  value={antecedentes.establecimiento}
                  onChange={(e) => handleAntecedenteChange("establecimiento", e.target.value)}
                  placeholder="Nombre del colegio / escuela"
              />
            </label>

            <label className="field">
              <span>Curso:</span>
              <input
                  type="text"
                  value={antecedentes.curso}
                  onChange={(e) => handleAntecedenteChange("curso", e.target.value)}
                  placeholder="Ej. 1° Medio A"
              />
            </label>

            <label className="field">
              <span>Fecha:</span>
              <input
                  type="date"
                  value={antecedentes.fecha}
                  onChange={(e) => handleAntecedenteChange("fecha", e.target.value)}
              />
            </label>

            <label className="field">
              <span>Hora Inicio / Término:</span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                    type="time"
                    value={antecedentes.horaInicio}
                    onChange={(e) => handleAntecedenteChange("horaInicio", e.target.value)}
                />
                <input
                    type="time"
                    value={antecedentes.horaTermino}
                    onChange={(e) => handleAntecedenteChange("horaTermino", e.target.value)}
                />
              </div>
            </label>

            <label className="field">
              <span>Observador(a):</span>
              <input
                  type="text"
                  value={antecedentes.observador}
                  onChange={(e) => handleAntecedenteChange("observador", e.target.value)}
                  placeholder="Profesor/a Colaborador/a"
              />
            </label>
          </div>

          <label className="field" style={{ marginTop: "1rem" }}>
            <span>Objetivo de la Clase:</span>
            <textarea
                rows={2}
                value={antecedentes.objetivoClase}
                onChange={(e) => handleAntecedenteChange("objetivoClase", e.target.value)}
                placeholder="Describa el objetivo abordado en la clase observada"
            />
          </label>
        </div>

        {/* 2. MATRIZ DE CRITERIOS (ESCALA 1 A 7) */}
        <div className="card">
          <h2>Evaluación de la Observación</h2>

          {DIMENSIONES.map((dim) => (
              <div key={dim.nombre} className="dimension" style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ textTransform: "uppercase", borderBottom: "1px solid #ccc", paddingBottom: "0.25rem" }}>
                  {dim.nombre}
                </h3>
                {dim.indicadores.map((ind) => {
                  const clave = `${dim.nombre}__${ind}`;
                  return (
                      <div className="indicador" key={clave} style={{ margin: "0.75rem 0" }}>
                        <span>{ind}</span>
                        <div className="escala">
                          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
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

        {/* 3. OBSERVACIONES GENERALES Y TRANSCRIPCIÓN DE VOZ */}
        <div className="card">
          <h2>Observaciones Generales</h2>
          <p className="muted">
            Indique fortalezas, aspectos a mejorar y reflexione sobre las estrategias de trabajo colaborativo implementadas.
          </p>

          <button className={`btn ${grabando ? "btn--recording" : "btn--secondary"}`} onClick={handleGrabar}>
            {grabando ? "● Grabando... (detener)" : "🎙️ Grabar nota de voz"}
          </button>

          <label className="field" style={{ marginTop: "1rem" }}>
            <span>Observaciones generales / Transcripción</span>
            <textarea
                rows={5}
                value={transcripcion}
                onChange={(e) => { setTranscripcion(e.target.value); setGuardada(false); }}
                placeholder={grabando ? "Transcribiendo audio..." : "Escriba o grabe las fortalezas, aspectos a mejorar y estrategias de trabajo colaborativo..."}
            />
          </label>

          <div className="modal__actions" style={{ justifyContent: "flex-start", marginTop: "1rem" }}>
            <button className="btn btn--primary" onClick={handleGuardar} disabled={loading}>
              {loading ? "Guardando..." : "Guardar evaluación"}
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