export const ROLES = ["Estudiante", "Profesor Tutor / Asignatura", "Coordinador de Práctica"];

export const TABS = [
  { id: "portafolio", label: "Portafolio del Estudiante" },
  { id: "evaluacion", label: "Evaluación de Clase" },
  { id: "chatbot", label: "Planificaciones y Reflexión" },
  { id: "dashboard", label: "Dashboard CNA" },
];

export const ESTUDIANTES_MOCK = [
  { id: "e1", nombre: "Javiera Contreras Muñoz", carrera: "Pedagogía en Educación Básica" },
  { id: "e2", nombre: "Matías Fuentes Rojas", carrera: "Pedagogía en Educación Parvularia" },
  { id: "e3", nombre: "Camila Soto Herrera", carrera: "Pedagogía en Ed. Diferencial" },
];

export const CICLOS = ["Inicial", "Intermedio", "Final"];

export const ASIGNATURAS_CNA = [
  "Práctica I", "Práctica II", "Práctica III", "Práctica IV", "Práctica V", "Práctica Profesional",
];

export const DOCUMENTOS_MOCK = {
  e1: [
    { ciclo: "Inicial", tipo: "Proyecto de Intervención", asignatura: "Práctica I", fecha: "2026-04-12", estado: "Aprobado" },
    { ciclo: "Intermedio", tipo: "Informe Final de Práctica", asignatura: "Práctica II", fecha: "2026-07-03", estado: "En revisión" },
  ],
  e2: [
    { ciclo: "Inicial", tipo: "Informe Final de Práctica", asignatura: "Práctica I", fecha: "2026-05-20", estado: "Aprobado" },
  ],
  e3: [],
};

export const DIMENSIONES = [
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

export const ELEMENTOS_LABELS = {
  objetivo: "Objetivo de aprendizaje",
  inicio: "Inicio",
  desarrollo: "Desarrollo",
  cierre: "Cierre",
  recursos: "Recursos",
  inclusionDUA: "Inclusión / DUA",
};

export const PREGUNTAS_BOT_INICIAL = [
  "¿Qué aprendizaje esperas que tus estudiantes logren al finalizar la clase?",
  "¿Cómo se conecta el inicio de tu clase con los conocimientos previos del curso?",
  "¿Qué evidencia recogerás durante el desarrollo para saber si se está logrando el objetivo?",
  "¿Cómo cerrarás la clase para verificar que el aprendizaje ocurrió?",
];

export const PREGUNTAS_BOT_AVANZADO = [
  "¿Qué barreras de aprendizaje anticipas en este grupo y cómo las abordas desde el DUA?",
  "¿Qué formas alternativas de representación, expresión o participación ofreces?",
  "¿Cómo se ajusta el cierre de la clase a los distintos ritmos de tus estudiantes?",
  "¿Qué recursos de apoyo tienes previstos para estudiantes con necesidades específicas?",
  "¿Cómo evaluarás el logro considerando las adecuaciones realizadas?",
];
