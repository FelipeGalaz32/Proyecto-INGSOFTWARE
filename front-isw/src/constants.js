export const ROLES = [
  "Estudiante",
  "Profesor Colaborador",
  "Profesor Tutor / Asignatura",
  "Coordinador de Práctica"
];

export const TABS = [
  {
    id: "portafolio",
    label: "Portafolio del Estudiante",
    roles: ["ESTUDIANTE", "PROFESOR_ASIGNATURA", "TUTOR_UNIVERSIDAD", "COORDINADOR_PRACTICA"]
  },
  {
    id: "evaluacion",
    label: "Evaluación de Clase",
    roles: ["ESTUDIANTE", "PROFESOR_ASIGNATURA", "TUTOR_UNIVERSIDAD", "COORDINADOR_PRACTICA", "COLABORADOR"]
  },
  {
    id: "chatbot",
    label: "Planificaciones y Reflexión",
    roles: ["ESTUDIANTE", "PROFESOR_ASIGNATURA", "TUTOR_UNIVERSIDAD", "COORDINADOR_PRACTICA", "COLABORADOR"]
  },
  {
    id: "dashboard",
    label: "Dashboard CNA",
      roles: ["COORDINADOR_PRACTICA"]
  },
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
    nombre: "Aspectos de la estructura de la clase",
    indicadores: [
      "1. El objetivo de la clase se presenta a los estudiantes. Es claro y pertinente al nivel.",
      "2. El profesor/a desarrolla un inicio de la clase generando retroalimentación y/o activación de conocimientos previos.",
      "3. El profesor/a realiza un desarrollo de la clase de manera pertinente al objetivo planteado.",
      "4. El profesor/a realiza un desarrollo de la clase con tareas matemáticas pertinentes y coherentes con el objetivo planteado.",
      "5. El profesor/a realiza un cierre de la clase con actividad(es) clave(s) para la verificación del cumplimiento del objetivo planteado.",
      "6. El profesor/a realiza un cierre de la clase integrando y/o sintetizando los aprendizajes de la clase."
    ]
  },
  {
    nombre: "Tareas matemáticas propuestas",
    indicadores: [
      "7. El profesor/a hace uso de los errores y dificultades de los estudiantes como una instancia de devolución.",
      "8. El profesor/a propone tareas matemáticas que se relacionen con alguna de las habilidades de: resolución de problemas, representación, modelación y/o argumentación y comunicación.",
      "9. Las tareas matemáticas están contextualizadas al entorno de los estudiantes.",
      "10. El profesor/a propone variadas estrategias de resolución de las tareas matemáticas presentadas.",
      "11. El profesor/a explica, comprueba y/o demuestra las definiciones, teoremas, proposiciones o procedimientos de manera clara y adecuadas al nivel educativo.",
      "12. El profesor/a utiliza estrategias de trabajo colaborativo para las/os estudiantes en las actividades de la clase."
    ]
  },
  {
    nombre: "Ambiente de aula y recursos de aprendizaje",
    indicadores: [
      "13. El profesor/a hace uso de un lenguaje acorde al nivel de enseñanza.",
      "14. El profesor/a genera oportunidades de participación de los estudiantes durante toda la clase.",
      "15. El profesor/a propicia un ambiente para el desarrollo de toda la clase.",
      "16. El profesor/a brinda atención a todos los estudiantes del aula.",
      "17. El profesor/a hace uso de materiales y/o recursos para el desarrollo de los aprendizajes en la clase.",
      "18. El profesor/a promueve la autoestima, evitando el rechazo, fobia o miedo a la matemática.",
      "19. El profesor/a promueve el diálogo y comunicación entre estudiantes favoreciendo la inclusión en la clase.",
      "20. El profesor/a realiza observación sistemática del proceso cognitivo de los estudiantes durante toda la clase."
    ]
  }
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