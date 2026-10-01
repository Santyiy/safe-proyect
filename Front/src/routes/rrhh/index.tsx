import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BrainCircuit, CheckCircle2, Users, Workflow } from "lucide-react";
import { AppShell } from "@/components/safe/app-shell";
import { EstadoBadge, Panel, ScoreBar, StatCard } from "@/components/safe/pieces";
import { Reveal } from "@/components/safe/reveal";
import { type PostulacionApi, safeApi } from "@/lib/api";

export const Route = createFileRoute("/rrhh/")({
  head: () => ({ meta: [{ title: "Panel RRHH | SAFE" }] }),
  component: PanelRRHH,
});

function PanelRRHH() {
  const [postulaciones, setPostulaciones] = useState<PostulacionApi[]>([]);
  const [seleccionado, setSeleccionado] = useState<PostulacionApi | null>(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    safeApi.adminPostulaciones()
      .then((response) => {
        const data = response.data ?? [];
        setPostulaciones(data);
        setSeleccionado(data[0] ?? null);
      })
      .catch((error) => setMensaje(error instanceof Error ? error.message : "No se pudieron cargar postulaciones"));
  }, []);

  const analizados = useMemo(() => postulaciones.filter((p) => p.scoreIa != null).length, [postulaciones]);
  const enEvaluacion = useMemo(() => postulaciones.filter((p) => p.estado === "EN_EVALUACION" || p.estado === "En evaluacion").length, [postulaciones]);

  return (
    <AppShell titulo="Panel de Recursos Humanos" subtitulo="Seguimiento de candidatos y automatizaciones" usuario="RRHH" rol="RRHH">
      {mensaje ? <p className="mb-5 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{mensaje}</p> : null}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Postulaciones", valor: String(postulaciones.length), delta: "Desde backend", icon: Users },
          { label: "CVs analizados por IA", valor: String(analizados), delta: "Con score IA", icon: BrainCircuit },
          { label: "En evaluacion", valor: String(enEvaluacion), delta: "Estado actual", icon: CheckCircle2 },
          { label: "Flujos n8n", valor: "--", delta: "Ver n8n", icon: Workflow },
        ].map((s, i) => <Reveal key={s.label} delay={i * 60}><StatCard {...s} /></Reveal>)}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Reveal className="xl:col-span-2">
          <Panel titulo="Postulaciones">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-muted-foreground"><th className="pb-3 font-medium">Postulante</th><th className="pb-3 font-medium">Puesto</th><th className="pb-3 font-medium">Score IA</th><th className="pb-3 font-medium">Estado</th></tr></thead>
                <tbody>
                  {postulaciones.map((p) => (
                    <tr key={`${p.idPostulante}-${p.idPuesto}`} onClick={() => setSeleccionado(p)} className={`cursor-pointer border-t border-border/60 transition-colors ${seleccionado?.idPostulante === p.idPostulante && seleccionado?.idPuesto === p.idPuesto ? "bg-primary/10" : "hover:bg-surface-2/60"}`}>
                      <td className="py-3">Postulante #{p.idPostulante}</td>
                      <td className="py-3 text-muted-foreground">{p.nombrePuesto}</td>
                      <td className="py-3">{p.scoreIa != null ? <ScoreBar value={Number(p.scoreIa)} /> : <span className="text-muted-foreground">Pendiente</span>}</td>
                      <td className="py-3"><EstadoBadge estado={p.estado} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </Reveal>
        <Reveal delay={100}>
          <Panel titulo="Detalle" className="h-full">
            {seleccionado ? (
              <div className="space-y-4 text-sm">
                <dl className="space-y-2">
                  {[["Postulante", `#${seleccionado.idPostulante}`], ["Puesto", seleccionado.nombrePuesto], ["Estado", seleccionado.estado], ["Score IA", seleccionado.scoreIa ?? "Pendiente"]].map(([k, v]) => <div key={k} className="flex justify-between gap-3 border-b border-border/60 pb-2"><dt className="text-muted-foreground">{k}</dt><dd className="text-right">{v}</dd></div>)}
                </dl>
                <div className="rounded-xl border border-primary/25 bg-primary/8 p-4"><p className="flex items-center gap-2 text-sm font-medium text-primary"><BrainCircuit className="size-4" /> Observacion de IA</p><p className="mt-2 text-sm text-muted-foreground">{seleccionado.observacionesIa ?? "El analisis todavia no fue devuelto por n8n."}</p></div>
              </div>
            ) : <p className="text-sm text-muted-foreground">No hay postulaciones cargadas.</p>}
          </Panel>
        </Reveal>
      </div>
    </AppShell>
  );
}
