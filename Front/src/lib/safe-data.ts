export type EstadoPostulacion =
  | "Pendiente"
  | "En evaluación"
  | "Entrevista"
  | "Aprobado"
  | "Rechazado";

export type EstadoEvaluacion =
  | "PENDIENTE"
  | "DISPONIBLE"
  | "EN_CURSO"
  | "FINALIZADA"
  | "VENCIDA";

export type Puesto = {
  id: number;
  nombre: string;
  tipo: string;
  area: string;
  modalidad: string;
  requisitos: string[];
  vacantes: number;
};

export const puestos: Puesto[] = [
  {
    id: 1,
    nombre: "Backend Java Jr",
    tipo: "Full time",
    area: "Tecnología",
    modalidad: "Híbrido",
    requisitos: ["Java 17", "Spring Boot", "MySQL", "REST"],
    vacantes: 2,
  },
  {
    id: 2,
    nombre: "Analista de RRHH",
    tipo: "Full time",
    area: "Recursos Humanos",
    modalidad: "Presencial",
    requisitos: ["Selección", "Entrevistas por competencias", "Excel"],
    vacantes: 1,
  },
  {
    id: 3,
    nombre: "Técnico en Seguridad e Higiene",
    tipo: "Part time",
    area: "Operaciones",
    modalidad: "Presencial",
    requisitos: ["Normativa vigente", "Protocolos de emergencia"],
    vacantes: 3,
  },
  {
    id: 4,
    nombre: "Frontend React Ssr",
    tipo: "Full time",
    area: "Tecnología",
    modalidad: "Remoto",
    requisitos: ["React", "TypeScript", "Testing"],
    vacantes: 1,
  },
];

export type Postulante = {
  id: number;
  nombre: string;
  dni: string;
  email: string;
  puesto: string;
  scoreIA: number;
  estado: EstadoPostulacion;
  experiencia: string;
  observacionIA: string;
  avatar: string;
};

export const postulantes: Postulante[] = [
  {
    id: 1,
    nombre: "Juan Pérez",
    dni: "40.221.998",
    email: "juan.perez@mail.com",
    puesto: "Backend Java Jr",
    scoreIA: 85,
    estado: "En evaluación",
    experiencia: "2 años en desarrollo backend",
    observacionIA: "Perfil alineado al stack requerido. Falta experiencia en testing automatizado.",
    avatar: "JP",
  },
  {
    id: 2,
    nombre: "María López",
    dni: "38.774.102",
    email: "maria.lopez@mail.com",
    puesto: "Analista de RRHH",
    scoreIA: 91,
    estado: "Entrevista",
    experiencia: "5 años en selección de personal",
    observacionIA: "Amplia experiencia en procesos de selección y evaluación por competencias.",
    avatar: "ML",
  },
  {
    id: 3,
    nombre: "Pedro Gómez",
    dni: "42.009.551",
    email: "pedro.gomez@mail.com",
    puesto: "Técnico en Seguridad e Higiene",
    scoreIA: 78,
    estado: "Pendiente",
    experiencia: "3 años en planta industrial",
    observacionIA: "Cumple requisitos base. Certificación vigente pendiente de validación.",
    avatar: "PG",
  },
  {
    id: 4,
    nombre: "Lucía Fernández",
    dni: "41.556.320",
    email: "lucia.fernandez@mail.com",
    puesto: "Frontend React Ssr",
    scoreIA: 94,
    estado: "Aprobado",
    experiencia: "4 años en desarrollo frontend",
    observacionIA: "Excelente compatibilidad técnica y antecedentes verificables.",
    avatar: "LF",
  },
  {
    id: 5,
    nombre: "Diego Ramírez",
    dni: "39.812.447",
    email: "diego.ramirez@mail.com",
    puesto: "Backend Java Jr",
    scoreIA: 61,
    estado: "Rechazado",
    experiencia: "Sin experiencia profesional",
    observacionIA: "No alcanza los requisitos mínimos de experiencia solicitados.",
    avatar: "DR",
  },
];

export type EvaluacionAsignada = {
  id: number;
  nombre: string;
  tipo: string;
  estado: EstadoEvaluacion;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  duracion: number;
  puntajeMin: number;
};

export const evaluacionesAsignadas: EvaluacionAsignada[] = [
  {
    id: 1,
    nombre: "Test Técnico Java",
    tipo: "Conocimiento",
    estado: "DISPONIBLE",
    fecha: "22/08/2026",
    horaInicio: "10:00",
    horaFin: "11:30",
    duracion: 90,
    puntajeMin: 60,
  },
  {
    id: 2,
    nombre: "Evaluación Psicotécnica",
    tipo: "Psicotécnica",
    estado: "PENDIENTE",
    fecha: "25/08/2026",
    horaInicio: "14:00",
    horaFin: "15:00",
    duracion: 60,
    puntajeMin: 50,
  },
  {
    id: 3,
    nombre: "Test de Inglés",
    tipo: "Idioma",
    estado: "FINALIZADA",
    fecha: "12/08/2026",
    horaInicio: "09:00",
    horaFin: "10:00",
    duracion: 60,
    puntajeMin: 55,
  },
];

export type Postulacion = {
  id: number;
  puesto: string;
  fecha: string;
  estado: EstadoPostulacion;
  progreso: number;
};

export const misPostulaciones: Postulacion[] = [
  { id: 1, puesto: "Backend Java Jr", fecha: "05/08/2026", estado: "En evaluación", progreso: 60 },
  { id: 2, puesto: "Frontend React Ssr", fecha: "28/07/2026", estado: "Entrevista", progreso: 80 },
  { id: 3, puesto: "Analista de Datos", fecha: "14/07/2026", estado: "Rechazado", progreso: 100 },
];

export type Evaluacion = {
  id: number;
  nombre: string;
  puesto: string;
  tipo: string;
  duracion: number;
  puntajeMin: number;
  preguntas: number;
  estado: "Activa" | "Borrador" | "Archivada";
};

export const evaluaciones: Evaluacion[] = [
  {
    id: 1,
    nombre: "Test Técnico Java",
    puesto: "Backend Java Jr",
    tipo: "Conocimiento",
    duracion: 90,
    puntajeMin: 60,
    preguntas: 18,
    estado: "Activa",
  },
  {
    id: 2,
    nombre: "Evaluación Psicotécnica",
    puesto: "General",
    tipo: "Psicotécnica",
    duracion: 60,
    puntajeMin: 50,
    preguntas: 40,
    estado: "Activa",
  },
  {
    id: 3,
    nombre: "Protocolos de Emergencia",
    puesto: "Técnico en Seguridad e Higiene",
    tipo: "Desarrollo",
    duracion: 45,
    puntajeMin: 70,
    preguntas: 10,
    estado: "Borrador",
  },
  {
    id: 4,
    nombre: "Test de Inglés",
    puesto: "General",
    tipo: "Idioma",
    duracion: 60,
    puntajeMin: 55,
    preguntas: 30,
    estado: "Archivada",
  },
];

export type RankingItem = {
  posicion: number;
  postulante: string;
  puesto: string;
  puntaje: number;
  scoreCV: number;
};

export const ranking: RankingItem[] = [
  { posicion: 1, postulante: "Lucía Fernández", puesto: "Frontend React Ssr", puntaje: 95, scoreCV: 94 },
  { posicion: 2, postulante: "María López", puesto: "Analista de RRHH", puntaje: 89, scoreCV: 91 },
  { posicion: 3, postulante: "Juan Pérez", puesto: "Backend Java Jr", puntaje: 84, scoreCV: 85 },
  { posicion: 4, postulante: "Pedro Gómez", puesto: "Seguridad e Higiene", puntaje: 76, scoreCV: 78 },
];

export type CorreccionIA = {
  pregunta: string;
  respuestaEsperada: string;
  respuestaPostulante: string;
  puntaje: number;
  peso: number;
  justificacion: string;
};

export const correccionesIA: CorreccionIA[] = [
  {
    pregunta: "¿Qué haría ante una situación de incendio?",
    respuestaEsperada: "Activar el protocolo de emergencia y evacuar siguiendo las normas.",
    respuestaPostulante:
      "Avisar inmediatamente la emergencia y seguir el protocolo de evacuación establecido.",
    puntaje: 9,
    peso: 10,
    justificacion:
      "La respuesta coincide con las acciones esperadas y demuestra comprensión del procedimiento.",
  },
  {
    pregunta: "Explique la diferencia entre una interfaz y una clase abstracta en Java.",
    respuestaEsperada: "Interfaz define contrato sin estado; abstracta puede tener estado y métodos concretos.",
    respuestaPostulante:
      "La interfaz solo declara métodos, la clase abstracta puede tener atributos y métodos implementados.",
    puntaje: 8,
    peso: 10,
    justificacion: "Concepto correcto, faltó mencionar herencia múltiple de interfaces.",
  },
];

export const actividadReciente = [
  { hora: "hace 4 min", texto: "IA analizó el CV de Lucía Fernández — Score 94%", tipo: "ia" },
  { hora: "hace 22 min", texto: "n8n envió notificación de evaluación a Juan Pérez", tipo: "n8n" },
  { hora: "hace 1 h", texto: "Nueva postulación a Backend Java Jr", tipo: "postulacion" },
  { hora: "hace 3 h", texto: "Corrección automática finalizada: Test de Inglés", tipo: "ia" },
  { hora: "ayer", texto: "María López avanzó a etapa de Entrevista", tipo: "estado" },
];

export const embudo = [
  { etapa: "Postulaciones", valor: 248 },
  { etapa: "En evaluación", valor: 126 },
  { etapa: "Entrevista", valor: 48 },
  { etapa: "Aprobados", valor: 17 },
];
