// src/components/TabDashboard.jsx

import { useState } from "react";
import { ASIGNATURAS_CNA, CICLOS, ESTUDIANTES_MOCK } from "../constants";
import ProgressBar from "./ProgressBar";

export default function TabDashboard({ rol, usuario }) {
  const rolNormalizado = (rol || usuario?.rol || usuario?.role || "").toUpperCase();
  const esCoordinador = rolNormalizado === "COORDINADOR_PRACTICA";

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

        {esCoordinador && (
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