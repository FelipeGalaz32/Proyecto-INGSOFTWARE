export function estadoAClase(estado) {
  if (estado === "Aprobado") return "success";
  if (estado === "En revisión") return "warning";
  return "neutral";
}

export function calcularPromedio(puntajes) {
  const valores = Object.values(puntajes);
  if (valores.length === 0) return null;
  const suma = valores.reduce((a, b) => a + b, 0);
  return Math.round((suma / valores.length) * 10) / 10;
}

export function badgeVersion(estado) {
  if (estado === "Aprobada") return "success";
  if (estado === "Rechazada") return "danger";
  if (estado === "Ajustes solicitados") return "warning";
  return "neutral";
}

export function detectarTipoCuenta(correo) {
  const dominio = (correo.split("@")[1] || "").toLowerCase();
  if (!dominio) return null;
  if (dominio.includes("alumno") || dominio.includes("estudiante")) return "estudiante";
  if (dominio.includes("profesor") || dominio.includes("docente") || dominio.includes("academico")) return "profesor";
  return "desconocido";
}
