const API_BASE =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" ? `${window.location.protocol}//${window.location.hostname}:8080` : "http://localhost:8080");
const TOKEN_KEY = "safe.token";

export type Usuario = {
  id: number;
  dni: string;
  nombre: string;
  email: string;
  rol: "postulante" | "POSTULANTE" | "admin" | "ADMIN" | "rrhh" | "RRHH";
};

export type ApiEnvelope<T> = {
  status: string;
  message?: string;
  data?: T;
};

export type PuestoApi = {
  id: number;
  nombrePuesto: string;
  tipo: string;
  requisitos: string;
};

export type PostulanteApi = {
  id: number;
  telefono?: string;
  direccion?: string;
  fechaNacimiento?: string;
  estadoCivil?: string;
  experienciaLaboral?: string;
  estudios?: string;
  infoMedica?: string;
  cvUrl?: string;
  aptoMedicoUrl?: string;
  nombre?: string;
  email?: string;
  dni?: string;
};

export type PostulantePayload = Omit<PostulanteApi, "id" | "nombre" | "email" | "dni">;

export type PostulacionApi = {
  idPostulante: number;
  idPuesto: number;
  nombrePuesto: string;
  fechaPostulacion?: string;
  estado: string;
  scoreIa?: number | null;
  observacionesIa?: string | null;
};

export type EvaluacionApi = {
  id: number;
  nombre: string;
  tipo: string;
  descripcion?: string;
  duracion: number;
  puntajeMin: number;
  puntajeMax: number;
  online: boolean;
  idPuesto?: number | null;
  estado: string;
};

export type EvaluacionPayload = {
  nombre: string;
  tipo: string;
  descripcion?: string;
  duracion: number;
  puntajeMin: number;
  puntajeMax: number;
  online: boolean;
  idPuesto?: number | null;
  estado: string;
};

export type EvaluacionAsignadaApi = {
  id: number;
  idEvaluacion: number;
  nombreEvaluacion: string;
  tipoEvaluacion: string;
  idPostulante: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: string;
  intento: number;
  fechaAsignacion?: string;
  observaciones?: string;
};

export type EvaluacionAsignadaPayload = {
  idEvaluacion: number;
  idPostulante: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  observaciones?: string;
};

export type PreguntaApi = {
  id: number;
  idEvaluacion: number;
  pregunta: string;
  tipo: string;
  respuestaCorrecta: string;
  peso: number;
};

export type PreguntaPayload = {
  pregunta: string;
  tipo: string;
  respuestaCorrecta: string;
  peso: number;
};

export type RankingApi = {
  id: number;
  idPostulante: number;
  promedioFinal: number;
};

export function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TOKEN_KEY) ?? "";
}

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function normalizeRole(rol?: string) {
  return (rol ?? "").toUpperCase();
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  const isPublicAuthPath = path === "/usuario/login" || path === "/usuario/register";

  if (token && !isPublicAuthPath) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof body === "string" ? body : body.message || "Error de API";
    throw new Error(message);
  }

  return body as T;
}

export function apiJson<T>(path: string, method: string, payload?: unknown) {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (payload !== undefined) {
    options.body = JSON.stringify(payload);
  }

  return apiRequest<T>(path, options);
}

export const safeApi = {
  async login(email: string, password: string) {
    return apiJson<string>("/usuario/login", "POST", { email, password });
  },
  async me() {
    return apiRequest<{ status: string; user: Usuario }>("/usuario/me");
  },
  async register(payload: { dni: string; nombre: string; email: string; password: string }) {
    return apiJson<ApiEnvelope<Usuario>>("/usuario/register", "POST", payload);
  },
  async puestos() {
    return apiRequest<ApiEnvelope<PuestoApi[]>>("/puestos");
  },
  async crearPuesto(payload: { nombrePuesto: string; tipo: string; requisitos: string }) {
    return apiJson<ApiEnvelope<PuestoApi>>("/admin/puestos", "POST", payload);
  },
  async actualizarPuesto(id: number, payload: { nombrePuesto: string; tipo: string; requisitos: string }) {
    return apiJson<ApiEnvelope<PuestoApi>>(`/admin/puestos/${id}`, "PUT", payload);
  },
  async eliminarPuesto(id: number) {
    return apiJson<ApiEnvelope<void>>(`/admin/puestos/${id}`, "DELETE");
  },
  async perfil() {
    return apiRequest<PostulanteApi>("/postulante/perfil");
  },
  async crearPerfil(payload: PostulantePayload) {
    return apiJson<PostulanteApi>("/postulante/perfil", "POST", payload);
  },
  async actualizarPerfil(payload: PostulantePayload) {
    return apiJson<PostulanteApi>("/postulante/perfil", "PUT", payload);
  },
  async postulaciones() {
    return apiRequest<ApiEnvelope<PostulacionApi[]>>("/postulante/postulaciones");
  },
  async postularse(idPuesto: number) {
    return apiJson<ApiEnvelope<PostulacionApi>>(`/postulante/postulaciones/${idPuesto}`, "POST");
  },
  async adminPostulaciones() {
    return apiRequest<ApiEnvelope<PostulacionApi[]>>("/admin/postulaciones");
  },
  async adminPostulantes() {
    return apiRequest<ApiEnvelope<PostulanteApi[]>>("/admin/postulantes");
  },
  async evaluaciones() {
    return apiRequest<ApiEnvelope<EvaluacionApi[]>>("/admin/evaluaciones");
  },
  async crearEvaluacion(payload: EvaluacionPayload) {
    return apiJson<ApiEnvelope<EvaluacionApi>>("/admin/evaluaciones", "POST", payload);
  },
  async actualizarEvaluacion(id: number, payload: EvaluacionPayload) {
    return apiJson<ApiEnvelope<EvaluacionApi>>(`/admin/evaluaciones/${id}`, "PUT", payload);
  },
  async eliminarEvaluacion(id: number) {
    return apiJson<ApiEnvelope<void>>(`/admin/evaluaciones/${id}`, "DELETE");
  },
  async asignaciones() {
    return apiRequest<ApiEnvelope<EvaluacionAsignadaApi[]>>("/admin/evaluaciones/asignaciones");
  },
  async asignarEvaluacion(payload: EvaluacionAsignadaPayload) {
    return apiJson<ApiEnvelope<EvaluacionAsignadaApi>>("/admin/evaluaciones/asignaciones", "POST", payload);
  },
  async cambiarEstadoAsignacion(id: number, estado: string) {
    return apiRequest<ApiEnvelope<EvaluacionAsignadaApi>>(
      `/admin/evaluaciones/asignaciones/${id}/estado?estado=${encodeURIComponent(estado)}`,
      { method: "PATCH" },
    );
  },
  async preguntas(idEvaluacion: number) {
    return apiRequest<ApiEnvelope<PreguntaApi[]>>(`/admin/evaluaciones/${idEvaluacion}/preguntas`);
  },
  async crearPregunta(idEvaluacion: number, payload: PreguntaPayload) {
    return apiJson<ApiEnvelope<PreguntaApi>>(`/admin/evaluaciones/${idEvaluacion}/preguntas`, "POST", payload);
  },
  async actualizarPregunta(idPregunta: number, payload: PreguntaPayload) {
    return apiJson<ApiEnvelope<PreguntaApi>>(`/admin/evaluaciones/preguntas/${idPregunta}`, "PUT", payload);
  },
  async eliminarPregunta(idPregunta: number) {
    return apiJson<ApiEnvelope<void>>(`/admin/evaluaciones/preguntas/${idPregunta}`, "DELETE");
  },
  async misEvaluaciones() {
    return apiRequest<ApiEnvelope<EvaluacionAsignadaApi[]>>("/postulante/evaluaciones/asignadas");
  },
  async ranking() {
    return apiRequest<ApiEnvelope<RankingApi[]>>("/ranking");
  },
};
