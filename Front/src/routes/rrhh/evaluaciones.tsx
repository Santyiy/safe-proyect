import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { CalendarClock, ClipboardList, Pencil, Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/safe/app-shell";
import { EstadoBadge, Panel } from "@/components/safe/pieces";
import { Reveal } from "@/components/safe/reveal";
import {
  type EvaluacionApi,
  type EvaluacionAsignadaApi,
  type EvaluacionPayload,
  type PostulanteApi,
  type PreguntaApi,
  type PreguntaPayload,
  type PuestoApi,
  safeApi,
} from "@/lib/api";

export const Route = createFileRoute("/rrhh/evaluaciones")({
  head: () => ({ meta: [{ title: "Gestion de evaluaciones | SAFE RRHH" }] }),
  component: EvaluacionesRRHH,
});

type EvaluacionForm = {
  id?: number;
  nombre: string;
  tipo: string;
  descripcion: string;
  duracion: number;
  puntajeMin: number;
  puntajeMax: number;
  online: boolean;
  idPuesto: string;
  estado: string;
};

type PreguntaForm = {
  id?: number;
  pregunta: string;
  tipo: string;
  respuestaCorrecta: string;
  peso: number;
};

const evaluacionInicial: EvaluacionForm = {
  nombre: "",
  tipo: "TECNICA",
  descripcion: "",
  duracion: 60,
  puntajeMin: 60,
  puntajeMax: 100,
  online: true,
  idPuesto: "",
  estado: "ACTIVA",
};

const preguntaInicial: PreguntaForm = {
  pregunta: "",
  tipo: "DESARROLLO",
  respuestaCorrecta: "",
  peso: 1,
};

function EvaluacionesRRHH() {
  const [evaluaciones, setEvaluaciones] = useState<EvaluacionApi[]>([]);
  const [asignaciones, setAsignaciones] = useState<EvaluacionAsignadaApi[]>([]);
  const [postulantes, setPostulantes] = useState<PostulanteApi[]>([]);
  const [puestos, setPuestos] = useState<PuestoApi[]>([]);
  const [preguntas, setPreguntas] = useState<PreguntaApi[]>([]);
  const [evaluacionSeleccionada, setEvaluacionSeleccionada] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [evaluacionForm, setEvaluacionForm] = useState<EvaluacionForm>(evaluacionInicial);
  const [preguntaForm, setPreguntaForm] = useState<PreguntaForm>(preguntaInicial);
  const [asignacion, setAsignacion] = useState({ idEvaluacion: "", idPostulante: "", fecha: "", horaInicio: "10:00", horaFin: "11:00", observaciones: "" });

  const evaluacionActiva = useMemo(
    () => evaluaciones.find((evaluacion) => evaluacion.id === evaluacionSeleccionada),
    [evaluaciones, evaluacionSeleccionada],
  );

  async function cargar() {
    setLoading(true);
    try {
      const [evs, posts, puestosResponse, asignacionesResponse] = await Promise.all([
        safeApi.evaluaciones(),
        safeApi.adminPostulantes(),
        safeApi.puestos(),
        safeApi.asignaciones(),
      ]);
      const listaEvaluaciones = evs.data ?? [];
      setEvaluaciones(listaEvaluaciones);
      setPostulantes(posts.data ?? []);
      setPuestos(puestosResponse.data ?? []);
      setAsignaciones(asignacionesResponse.data ?? []);
      setEvaluacionSeleccionada((actual) => actual ?? listaEvaluaciones[0]?.id ?? null);
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "No se pudieron cargar datos");
    } finally {
      setLoading(false);
    }
  }

  async function cargarPreguntas(idEvaluacion: number | null) {
    if (!idEvaluacion) {
      setPreguntas([]);
      return;
    }

    try {
      const response = await safeApi.preguntas(idEvaluacion);
      setPreguntas(response.data ?? []);
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "No se pudieron cargar las preguntas");
    }
  }

  useEffect(() => {
    void cargar();
  }, []);

  useEffect(() => {
    void cargarPreguntas(evaluacionSeleccionada);
  }, [evaluacionSeleccionada]);

  function payloadEvaluacion(): EvaluacionPayload {
    return {
      nombre: evaluacionForm.nombre.trim(),
      tipo: evaluacionForm.tipo.trim(),
      descripcion: evaluacionForm.descripcion.trim(),
      duracion: Number(evaluacionForm.duracion),
      puntajeMin: Number(evaluacionForm.puntajeMin),
      puntajeMax: Number(evaluacionForm.puntajeMax),
      online: evaluacionForm.online,
      idPuesto: evaluacionForm.idPuesto ? Number(evaluacionForm.idPuesto) : null,
      estado: evaluacionForm.estado,
    };
  }

  function payloadPregunta(): PreguntaPayload {
    return {
      pregunta: preguntaForm.pregunta.trim(),
      tipo: preguntaForm.tipo.trim(),
      respuestaCorrecta: preguntaForm.respuestaCorrecta.trim(),
      peso: Number(preguntaForm.peso),
    };
  }

  async function guardarEvaluacion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMensaje("");
    setGuardando(true);

    try {
      if (evaluacionForm.id) {
        await safeApi.actualizarEvaluacion(evaluacionForm.id, payloadEvaluacion());
        setMensaje("Evaluacion actualizada correctamente");
      } else {
        await safeApi.crearEvaluacion(payloadEvaluacion());
        setMensaje("Evaluacion creada correctamente");
      }
      setEvaluacionForm(evaluacionInicial);
      await cargar();
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "No se pudo guardar la evaluacion");
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarEvaluacion(id: number) {
    setMensaje("");
    try {
      await safeApi.eliminarEvaluacion(id);
      setMensaje("Evaluacion eliminada correctamente");
      setEvaluacionSeleccionada((actual) => (actual === id ? null : actual));
      await cargar();
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "No se pudo eliminar la evaluacion");
    }
  }

  async function asignar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMensaje("");
    try {
      await safeApi.asignarEvaluacion({
        idEvaluacion: Number(asignacion.idEvaluacion),
        idPostulante: Number(asignacion.idPostulante),
        fecha: asignacion.fecha,
        horaInicio: asignacion.horaInicio,
        horaFin: asignacion.horaFin,
        observaciones: asignacion.observaciones,
      });
      setMensaje("Evaluacion asignada correctamente");
      setAsignacion({ idEvaluacion: "", idPostulante: "", fecha: "", horaInicio: "10:00", horaFin: "11:00", observaciones: "" });
      await cargar();
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "No se pudo asignar la evaluacion");
    }
  }

  async function cambiarEstadoAsignacion(id: number, estado: string) {
    setMensaje("");
    try {
      await safeApi.cambiarEstadoAsignacion(id, estado);
      setMensaje("Estado de asignacion actualizado");
      await cargar();
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "No se pudo actualizar el estado");
    }
  }

  async function guardarPregunta(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!evaluacionSeleccionada) {
      setMensaje("Selecciona una evaluacion para agregar preguntas");
      return;
    }

    setMensaje("");
    try {
      if (preguntaForm.id) {
        await safeApi.actualizarPregunta(preguntaForm.id, payloadPregunta());
        setMensaje("Pregunta actualizada correctamente");
      } else {
        await safeApi.crearPregunta(evaluacionSeleccionada, payloadPregunta());
        setMensaje("Pregunta creada correctamente");
      }
      setPreguntaForm(preguntaInicial);
      await cargarPreguntas(evaluacionSeleccionada);
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "No se pudo guardar la pregunta");
    }
  }

  async function eliminarPregunta(id: number) {
    setMensaje("");
    try {
      await safeApi.eliminarPregunta(id);
      setMensaje("Pregunta eliminada correctamente");
      await cargarPreguntas(evaluacionSeleccionada);
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "No se pudo eliminar la pregunta");
    }
  }

  function editarEvaluacion(ev: EvaluacionApi) {
    setEvaluacionForm({
      id: ev.id,
      nombre: ev.nombre,
      tipo: ev.tipo,
      descripcion: ev.descripcion ?? "",
      duracion: ev.duracion,
      puntajeMin: ev.puntajeMin,
      puntajeMax: ev.puntajeMax,
      online: ev.online,
      idPuesto: ev.idPuesto ? String(ev.idPuesto) : "",
      estado: ev.estado,
    });
  }

  function editarPregunta(pregunta: PreguntaApi) {
    setPreguntaForm({
      id: pregunta.id,
      pregunta: pregunta.pregunta,
      tipo: pregunta.tipo ?? "",
      respuestaCorrecta: pregunta.respuestaCorrecta ?? "",
      peso: pregunta.peso,
    });
  }

  return (
    <AppShell titulo="Evaluaciones" subtitulo="Administracion, preguntas y asignacion de pruebas" usuario="RRHH" rol="RRHH">
      {mensaje ? <p className="mb-5 rounded-xl border border-primary/25 bg-primary/8 p-4 text-sm text-muted-foreground">{mensaje}</p> : null}
      {loading ? <p className="mb-5 text-sm text-muted-foreground">Cargando evaluaciones...</p> : null}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Reveal>
          <Panel titulo="Listado de evaluaciones">
            <ul className="space-y-3">
              {evaluaciones.map((ev) => (
                <li key={ev.id} className="lift rounded-xl border border-border bg-surface-2/45 p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <button type="button" onClick={() => setEvaluacionSeleccionada(ev.id)} className="min-w-0 text-left">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{ev.nombre || "Sin nombre"}</p>
                        <EstadoBadge estado={ev.estado} />
                        {evaluacionSeleccionada === ev.id ? <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs text-primary">seleccionada</span> : null}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{ev.tipo || "Sin tipo"} - {ev.duracion ?? 0} min - min. {ev.puntajeMin ?? 0} - max. {ev.puntajeMax ?? 0}</p>
                      {ev.descripcion ? <p className="mt-2 text-sm text-muted-foreground">{ev.descripcion}</p> : null}
                    </button>
                    <div className="flex gap-2">
                      <button onClick={() => editarEvaluacion(ev)} className="grid size-10 place-items-center rounded-lg border border-border bg-surface-2/70 text-muted-foreground transition-colors hover:text-foreground" title="Editar evaluacion">
                        <Pencil className="size-4" />
                      </button>
                      <button onClick={() => eliminarEvaluacion(ev.id)} className="grid size-10 place-items-center rounded-lg border border-destructive/30 bg-destructive/10 text-destructive transition-colors hover:bg-destructive/15" title="Eliminar evaluacion">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel titulo={evaluacionForm.id ? "Editar evaluacion" : "Nueva evaluacion"} className="mt-6">
            <form onSubmit={guardarEvaluacion} className="grid gap-3 text-sm md:grid-cols-2">
              <Input label="Nombre" value={evaluacionForm.nombre} onChange={(v) => setEvaluacionForm({ ...evaluacionForm, nombre: v })} required />
              <Select label="Tipo" value={evaluacionForm.tipo} onChange={(v) => setEvaluacionForm({ ...evaluacionForm, tipo: v })} options={["TECNICA", "PSICOLOGICA", "MEDICA", "ENTREVISTA"].map((tipo) => ({ value: tipo, label: tipo }))} />
              <Input label="Duracion" value={String(evaluacionForm.duracion)} onChange={(v) => setEvaluacionForm({ ...evaluacionForm, duracion: Number(v) })} type="number" required />
              <Select label="Estado" value={evaluacionForm.estado} onChange={(v) => setEvaluacionForm({ ...evaluacionForm, estado: v })} options={["ACTIVA", "INACTIVA"].map((estado) => ({ value: estado, label: estado }))} />
              <Input label="Puntaje minimo" value={String(evaluacionForm.puntajeMin)} onChange={(v) => setEvaluacionForm({ ...evaluacionForm, puntajeMin: Number(v) })} type="number" required />
              <Input label="Puntaje maximo" value={String(evaluacionForm.puntajeMax)} onChange={(v) => setEvaluacionForm({ ...evaluacionForm, puntajeMax: Number(v) })} type="number" required />
              <Select label="Puesto asociado" value={evaluacionForm.idPuesto} onChange={(v) => setEvaluacionForm({ ...evaluacionForm, idPuesto: v })} options={puestos.map((puesto) => ({ value: String(puesto.id), label: puesto.nombrePuesto || `Puesto #${puesto.id}` }))} />
              <label className="flex items-center gap-2 rounded-lg border border-border bg-surface-2/45 px-3 py-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={evaluacionForm.online} onChange={(event) => setEvaluacionForm({ ...evaluacionForm, online: event.target.checked })} />
                Online
              </label>
              <label className="block md:col-span-2">
                <span className="text-muted-foreground">Descripcion</span>
                <textarea value={evaluacionForm.descripcion} onChange={(event) => setEvaluacionForm({ ...evaluacionForm, descripcion: event.target.value })} rows={3} className="mt-1.5 w-full rounded-lg border border-input bg-surface-2/60 p-3 text-sm outline-none focus:ring-2 focus:ring-ring/60" />
              </label>
              <div className="flex flex-wrap gap-3 md:col-span-2">
                <button disabled={guardando} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[image:var(--gradient-primary)] px-4 py-2.5 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60">
                  <Plus className="size-4" /> {guardando ? "Guardando..." : evaluacionForm.id ? "Guardar cambios" : "Crear"}
                </button>
                {evaluacionForm.id ? <button type="button" onClick={() => setEvaluacionForm(evaluacionInicial)} className="rounded-lg border border-border bg-surface-2/70 px-4 py-2.5 font-medium">Cancelar</button> : null}
              </div>
            </form>
          </Panel>
        </Reveal>

        <Reveal delay={100}>
          <Panel titulo="Asignar evaluacion">
            <form onSubmit={asignar} className="space-y-4 text-sm">
              <Select label="Postulante" value={asignacion.idPostulante} onChange={(v) => setAsignacion({ ...asignacion, idPostulante: v })} options={postulantes.map((p) => ({ value: String(p.id), label: `${p.nombre ?? p.email ?? "Postulante"} #${p.id}` }))} required />
              <Select label="Evaluacion" value={asignacion.idEvaluacion} onChange={(v) => setAsignacion({ ...asignacion, idEvaluacion: v })} options={evaluaciones.map((e) => ({ value: String(e.id), label: e.nombre || `Evaluacion #${e.id}` }))} required />
              <Input label="Fecha" value={asignacion.fecha} onChange={(v) => setAsignacion({ ...asignacion, fecha: v })} type="date" required />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Inicio" value={asignacion.horaInicio} onChange={(v) => setAsignacion({ ...asignacion, horaInicio: v })} type="time" required />
                <Input label="Fin" value={asignacion.horaFin} onChange={(v) => setAsignacion({ ...asignacion, horaFin: v })} type="time" required />
              </div>
              <label className="block">
                <span className="text-muted-foreground">Observaciones</span>
                <textarea value={asignacion.observaciones} onChange={(event) => setAsignacion({ ...asignacion, observaciones: event.target.value })} rows={3} className="mt-1.5 w-full rounded-lg border border-input bg-surface-2/60 p-3 text-sm outline-none focus:ring-2 focus:ring-ring/60" />
              </label>
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[image:var(--gradient-primary)] px-4 py-2.5 font-semibold text-primary-foreground"><CalendarClock className="size-4" /> Asignar</button>
            </form>
          </Panel>

          <Panel titulo="Asignaciones" className="mt-6">
            <ul className="space-y-3">
              {asignaciones.map((item) => (
                <li key={item.id} className="rounded-xl border border-border bg-surface-2/45 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{item.nombreEvaluacion || "Sin nombre"}</p>
                      <p className="mt-1 text-sm text-muted-foreground">Postulante #{item.idPostulante} - {item.fecha} - {item.horaInicio} a {item.horaFin}</p>
                    </div>
                    <EstadoBadge estado={item.estado} />
                  </div>
                  <Select label="Cambiar estado" value={item.estado} onChange={(estado) => cambiarEstadoAsignacion(item.id, estado)} options={["ASIGNADA", "EN_CURSO", "FINALIZADA", "CANCELADA"].map((estado) => ({ value: estado, label: estado }))} />
                </li>
              ))}
            </ul>
          </Panel>
        </Reveal>
      </div>

      <Reveal delay={160}>
        <Panel titulo={`Preguntas${evaluacionActiva ? ` - ${evaluacionActiva.nombre || "Sin nombre"}` : ""}`} className="mt-6">
          <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <form onSubmit={guardarPregunta} className="space-y-4 text-sm">
              <Select label="Evaluacion" value={evaluacionSeleccionada ? String(evaluacionSeleccionada) : ""} onChange={(value) => setEvaluacionSeleccionada(value ? Number(value) : null)} options={evaluaciones.map((ev) => ({ value: String(ev.id), label: ev.nombre || `Evaluacion #${ev.id}` }))} required />
              <Input label="Tipo" value={preguntaForm.tipo} onChange={(v) => setPreguntaForm({ ...preguntaForm, tipo: v })} required />
              <Input label="Peso" value={String(preguntaForm.peso)} onChange={(v) => setPreguntaForm({ ...preguntaForm, peso: Number(v) })} type="number" required />
              <label className="block">
                <span className="text-muted-foreground">Pregunta</span>
                <textarea value={preguntaForm.pregunta} onChange={(event) => setPreguntaForm({ ...preguntaForm, pregunta: event.target.value })} required rows={4} className="mt-1.5 w-full rounded-lg border border-input bg-surface-2/60 p-3 text-sm outline-none focus:ring-2 focus:ring-ring/60" />
              </label>
              <label className="block">
                <span className="text-muted-foreground">Respuesta correcta</span>
                <textarea value={preguntaForm.respuestaCorrecta} onChange={(event) => setPreguntaForm({ ...preguntaForm, respuestaCorrecta: event.target.value })} required rows={4} className="mt-1.5 w-full rounded-lg border border-input bg-surface-2/60 p-3 text-sm outline-none focus:ring-2 focus:ring-ring/60" />
              </label>
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-[image:var(--gradient-primary)] px-4 py-2.5 font-semibold text-primary-foreground"><ClipboardList className="size-4" /> {preguntaForm.id ? "Guardar pregunta" : "Agregar pregunta"}</button>
                {preguntaForm.id ? <button type="button" onClick={() => setPreguntaForm(preguntaInicial)} className="rounded-lg border border-border bg-surface-2/70 px-4 py-2.5 font-medium">Cancelar</button> : null}
              </div>
            </form>

            <ul className="space-y-3">
              {preguntas.map((pregunta, index) => (
                <li key={pregunta.id} className="rounded-xl border border-border bg-surface-2/45 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm font-semibold">{index + 1}. {pregunta.pregunta || "Sin pregunta"}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{pregunta.tipo || "Sin tipo"} - peso {pregunta.peso ?? 0}</p>
                      <p className="mt-2 text-sm text-muted-foreground">Respuesta: {pregunta.respuestaCorrecta || "Sin respuesta cargada"}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editarPregunta(pregunta)} className="grid size-10 place-items-center rounded-lg border border-border bg-surface-2/70 text-muted-foreground transition-colors hover:text-foreground" title="Editar pregunta"><Pencil className="size-4" /></button>
                      <button onClick={() => eliminarPregunta(pregunta.id)} className="grid size-10 place-items-center rounded-lg border border-destructive/30 bg-destructive/10 text-destructive transition-colors hover:bg-destructive/15" title="Eliminar pregunta"><Trash2 className="size-4" /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </Reveal>
    </AppShell>
  );
}

function Input({ label, value, onChange, type = "text", placeholder, required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; required?: boolean }) {
  return <label className="block"><span className="text-muted-foreground">{label}</span><input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-1.5 h-11 w-full rounded-lg border border-input bg-surface-2/60 px-3 text-sm outline-none focus:ring-2 focus:ring-ring/60" /></label>;
}

function Select({ label, value, onChange, options, required = false }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; required?: boolean }) {
  return <label className="block"><span className="text-muted-foreground">{label}</span><select required={required} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1.5 h-11 w-full rounded-lg border border-input bg-surface-2/60 px-3 text-sm outline-none focus:ring-2 focus:ring-ring/60"><option value="">Seleccionar</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}
