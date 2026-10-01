import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BriefcaseBusiness, CalendarClock, ClipboardList, Star, Timer } from "lucide-react";
import { AppShell } from "@/components/safe/app-shell";
import { EstadoBadge, Panel, ScoreBar, StatCard } from "@/components/safe/pieces";
import { Reveal } from "@/components/safe/reveal";
import { type EvaluacionAsignadaApi, type PostulacionApi, type PostulanteApi, type PuestoApi, safeApi } from "@/lib/api";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Mi panel | SAFE postulante" }] }),
  component: DashboardPostulante,
});

function DashboardPostulante() {
  const [perfil, setPerfil] = useState<PostulanteApi | null>(null);
  const [postulaciones, setPostulaciones] = useState<PostulacionApi[]>([]);
  const [evaluaciones, setEvaluaciones] = useState<EvaluacionAsignadaApi[]>([]);
  const [puestos, setPuestos] = useState<PuestoApi[]>([]);

  useEffect(() => {
    void Promise.allSettled([
      safeApi.perfil().then(setPerfil),
      safeApi.postulaciones().then((r) => setPostulaciones(r.data ?? [])),
      safeApi.misEvaluaciones().then((r) => setEvaluaciones(r.data ?? [])),
      safeApi.puestos().then((r) => setPuestos(r.data ?? [])),
    ]);
  }, []);

  const score = postulaciones.find((p) => p.scoreIa != null)?.scoreIa ?? 0;
  const usuario = perfil?.nombre || "Postulante";

  return (
    <AppShell titulo={`Hola, ${usuario.split(" ")[0]}`} subtitulo="Estado de tus procesos de seleccion" usuario={usuario} rol="POSTULANTE">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Postulaciones", valor: String(postulaciones.length), delta: "Procesos activos", icon: BriefcaseBusiness },
          { label: "Evaluaciones asignadas", valor: String(evaluaciones.length), delta: "Segun RRHH", icon: ClipboardList },
          { label: "Score IA de tu CV", valor: score ? `${score}%` : "--", delta: "Resultado n8n", icon: Star },
          { label: "Proxima instancia", valor: evaluaciones[0]?.fecha ?? "--", delta: evaluaciones[0]?.nombreEvaluacion ?? "Sin asignar", icon: CalendarClock },
        ].map((s, i) => <Reveal key={s.label} delay={i * 60}><StatCard {...s} /></Reveal>)}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Reveal className="xl:col-span-2">
          <Panel titulo="Evaluaciones asignadas">
            <ul className="space-y-3">
              {evaluaciones.length ? evaluaciones.map((ev) => (
                <li key={ev.id} className="lift rounded-xl border border-border bg-surface-2/50 p-4 md:flex md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2"><p className="font-medium">{ev.nombreEvaluacion}</p><EstadoBadge estado={ev.estado} /></div>
                    <p className="mt-1 text-sm text-muted-foreground">{ev.tipoEvaluacion} · {ev.fecha} · {ev.horaInicio} a {ev.horaFin}</p>
                  </div>
                  <div className="mt-3 flex items-center gap-3 md:mt-0">
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"><Timer className="size-4" /> intento {ev.intento}</span>
                    <Link to="/evaluaciones" className="rounded-lg border border-primary/35 px-3 py-1.5 text-sm text-primary">Ver</Link>
                  </div>
                </li>
              )) : <li className="text-sm text-muted-foreground">No tenes evaluaciones asignadas.</li>}
            </ul>
          </Panel>
        </Reveal>

        <Reveal delay={100}>
          <Panel titulo="Mi perfil profesional" className="h-full">
            <div className="space-y-4 text-sm">
              <div><p className="text-muted-foreground">Completitud del perfil</p><div className="mt-2"><ScoreBar value={perfil?.cvUrl ? 80 : 45} /></div></div>
              <dl className="space-y-2">
                {[["CV", perfil?.cvUrl || "Sin cargar"], ["Experiencia", perfil?.experienciaLaboral || "Sin cargar"], ["Estudios", perfil?.estudios || "Sin cargar"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 border-b border-border/60 pb-2"><dt className="text-muted-foreground">{k}</dt><dd className="text-right">{v}</dd></div>
                ))}
              </dl>
              <Link to="/perfil" className="inline-flex w-full items-center justify-center rounded-lg border border-border bg-surface-2/70 px-4 py-2.5 font-medium hover:border-primary/40">Actualizar perfil</Link>
            </div>
          </Panel>
        </Reveal>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Reveal>
          <Panel titulo="Mis postulaciones">
            <ul className="space-y-4">
              {postulaciones.length ? postulaciones.map((p) => (
                <li key={`${p.idPostulante}-${p.idPuesto}`} className="rounded-xl border border-border bg-surface-2/40 p-4">
                  <div className="flex items-center justify-between gap-3"><p className="font-medium">{p.nombrePuesto}</p><EstadoBadge estado={p.estado} /></div>
                  <p className="mt-1 text-sm text-muted-foreground">Score IA: {p.scoreIa ?? "pendiente"}</p>
                  {p.observacionesIa ? <p className="mt-2 text-sm text-muted-foreground">{p.observacionesIa}</p> : null}
                </li>
              )) : <li className="text-sm text-muted-foreground">Todavia no tenes postulaciones.</li>}
            </ul>
          </Panel>
        </Reveal>
        <Reveal delay={100}>
          <Panel titulo="Puestos disponibles" accion={<Link to="/puestos" className="text-sm text-primary hover:underline">Ver todos</Link>}>
            <ul className="space-y-3">
              {puestos.slice(0, 3).map((p) => <li key={p.id} className="rounded-xl border border-border bg-surface-2/40 p-4"><p className="font-medium">{p.nombrePuesto}</p><p className="text-sm text-muted-foreground">{p.tipo}</p></li>)}
            </ul>
          </Panel>
        </Reveal>
      </div>
    </AppShell>
  );
}
