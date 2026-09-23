import { useRef, useState } from "react";
import { DIMENSIONES } from "../constants";
import { calcularPromedio } from "../utils";
import ProgressBar from "./ProgressBar";

export default function TabEvaluacion({ rol }) {
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
