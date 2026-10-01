import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarClock, PlayCircle, Timer } from "lucide-react";
import { AppShell } from "@/components/safe/app-shell";
import { EstadoBadge } from "@/components/safe/pieces";
import { Reveal } from "@/components/safe/reveal";
import { type EvaluacionAsignadaApi, safeApi } from "@/lib/api";

export const Route = createFileRoute("/evaluaciones")({
  head: () => ({ meta: [{ title: "Mis evaluaciones | SAFE postulante" }] }),
  component: MisEvaluaciones,
});

function MisEvaluaciones() {
  const [evaluaciones, setEvaluaciones] = useState<EvaluacionAsignadaApi[]>([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    safeApi.misEvaluaciones()
      .then((response) => setEvaluaciones(response.data ?? []))
      .catch((error) => setMensaje(error instanceof Error ? error.message : "No se pudieron cargar evaluaciones"));
  }, []);

  return (
    <AppShell titulo="Mis evaluaciones" subtitulo="Pruebas asignadas por Recursos Humanos" usuario="Postulante" rol="POSTULANTE">
      {mensaje ? <p className="mb-5 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{mensaje}</p> : null}
      <div className="grid gap-6 lg:grid-cols-3">
        {evaluaciones.length ? evaluaciones.map((ev, i) => (
          <Reveal key={ev.id} delay={i * 80}>
            <div className="lift surface-panel flex h-full flex-col rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3"><p className="font-medium">{ev.nombreEvaluacion}</p><EstadoBadge estado={ev.estado} /></div>
              <p className="mt-1 text-sm text-muted-foreground">{ev.tipoEvaluacion}</p>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><CalendarClock className="size-4 text-primary" />{ev.fecha} · {ev.horaInicio} a {ev.horaFin}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Timer className="size-4 text-primary" />Intento {ev.intento}</div>
              </dl>
              <div className="mt-5 flex-1" />
              {ev.estado === "DISPONIBLE" ? (
                <Link to="/evaluacion/$id" params={{ id: String(ev.id) }} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[image:var(--gradient-primary)] px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:-translate-y-0.5"><PlayCircle className="size-4" /> Rendir ahora</Link>
              ) : (
                <span className="inline-flex items-center justify-center rounded-lg border border-border bg-surface-2/60 px-4 py-2.5 text-sm text-muted-foreground">{ev.estado === "FINALIZADA" ? "Evaluacion finalizada" : "Fuera del horario habilitado"}</span>
              )}
            </div>
          </Reveal>
        )) : <p className="text-sm text-muted-foreground">No tenes evaluaciones asignadas.</p>}
      </div>
    </AppShell>
  );
}
