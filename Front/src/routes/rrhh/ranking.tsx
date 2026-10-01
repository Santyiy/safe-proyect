import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { AppShell } from "@/components/safe/app-shell";
import { Panel, ScoreBar } from "@/components/safe/pieces";
import { Reveal } from "@/components/safe/reveal";
import { type RankingApi, safeApi } from "@/lib/api";

export const Route = createFileRoute("/rrhh/ranking")({
  head: () => ({ meta: [{ title: "Ranking de candidatos | SAFE RRHH" }] }),
  component: Ranking,
});

function Ranking() {
  const [ranking, setRanking] = useState<RankingApi[]>([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    safeApi.ranking()
      .then((response) => setRanking(response.data ?? []))
      .catch((error) => setMensaje(error instanceof Error ? error.message : "No se pudo cargar el ranking"));
  }, []);

  return (
    <AppShell titulo="Ranking de candidatos" subtitulo="Generado a partir de evaluaciones y analisis de IA" usuario="RRHH" rol="RRHH">
      {mensaje ? <p className="mb-5 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{mensaje}</p> : null}
      <div className="grid gap-6 xl:grid-cols-3">
        <Reveal className="xl:col-span-2">
          <Panel titulo="Posiciones">
            <ul className="space-y-3">
              {ranking.length ? ranking.map((r, i) => (
                <li key={r.id} className="lift flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface-2/45 p-4">
                  <span className={`grid size-10 shrink-0 place-items-center rounded-xl font-display font-semibold ${i === 0 ? "bg-[image:var(--gradient-primary)] text-primary-foreground glow-shadow" : "border border-border bg-surface text-muted-foreground"}`}>{i + 1}</span>
                  <div className="min-w-40 flex-1"><p className="font-medium">Postulante #{r.idPostulante}</p><p className="text-sm text-muted-foreground">Ranking backend</p></div>
                  <ScoreBar value={Number(r.promedioFinal ?? 0)} />
                  <div className="text-right"><p className="text-xs text-muted-foreground">Promedio final</p><p className="font-display text-2xl font-semibold gradient-text">{r.promedioFinal}</p></div>
                </li>
              )) : <li className="text-sm text-muted-foreground">Todavia no hay datos de ranking.</li>}
            </ul>
          </Panel>
        </Reveal>
        <Reveal delay={100}>
          <Panel titulo="Criterios del ranking" className="h-full">
            <ul className="space-y-3 text-sm text-muted-foreground">
              {["Score IA del CV", "Puntajes de evaluaciones", "Compatibilidad con el puesto", "Experiencia laboral", "Resultado de entrevistas"].map((c) => <li key={c} className="flex items-start gap-2"><Trophy className="mt-0.5 size-4 shrink-0 text-primary" />{c}</li>)}
            </ul>
          </Panel>
        </Reveal>
      </div>
    </AppShell>
  );
}
