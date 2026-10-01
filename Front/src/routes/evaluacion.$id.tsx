import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Send, Timer } from "lucide-react";
import { AppShell } from "@/components/safe/app-shell";
import { Panel } from "@/components/safe/pieces";
import { Reveal } from "@/components/safe/reveal";
import { evaluacionesAsignadas } from "@/lib/safe-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/evaluacion/$id")({
  head: () => ({
    meta: [
      { title: "Rendir evaluación | SAFE" },
      {
        name: "description",
        content:
          "Pantalla de rendición de evaluación con temporizador, preguntas de opción múltiple y de desarrollo.",
      },
      { property: "og:title", content: "Rendir evaluación | SAFE" },
      { property: "og:description", content: "Rendición de evaluación con temporizador y envío a corrección IA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RendirEvaluacion,
});

const preguntas = [
  {
    id: 1,
    texto: "¿Cuál es la diferencia principal entre una interfaz y una clase abstracta en Java?",
    opciones: [
      "La interfaz puede tener estado mutable",
      "La clase abstracta puede tener atributos y métodos implementados",
      "Ambas permiten herencia múltiple de implementación",
      "No existe diferencia funcional",
    ],
  },
  {
    id: 2,
    texto: "En Spring Boot, ¿qué anotación expone un método como endpoint HTTP GET?",
    opciones: ["@GetMapping", "@Component", "@Entity", "@Transactional"],
  },
  {
    id: 3,
    texto: "¿Qué índice conviene para acelerar búsquedas por email único en MySQL?",
    opciones: ["Índice FULLTEXT", "Índice UNIQUE sobre la columna", "Ninguno, MySQL lo hace solo", "Índice espacial"],
  },
];

function RendirEvaluacion() {
  const { id } = Route.useParams();
  const evaluacion = evaluacionesAsignadas.find((e) => String(e.id) === id) ?? evaluacionesAsignadas[0]!;
  const [respuestas, setRespuestas] = useState<Record<number, number>>({});
  const [enviado, setEnviado] = useState(false);

  const respondidas = Object.keys(respuestas).length;
  const progreso = Math.round((respondidas / preguntas.length) * 100);

  return (
    <AppShell
      titulo={evaluacion.nombre}
      subtitulo={`${evaluacion.tipo} · habilitada de ${evaluacion.horaInicio} a ${evaluacion.horaFin}`}
      usuario="Juan Pérez"
      rol="POSTULANTE"
    >
      <div className="grid gap-6 xl:grid-cols-3">
        <Reveal className="xl:col-span-2">
          <Panel titulo="Preguntas">
            {enviado ? (
              <div className="rounded-xl border border-success/30 bg-success/10 p-6 text-center">
                <CheckCircle2 className="mx-auto size-8 text-success" />
                <p className="mt-3 font-semibold">Evaluación enviada</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  La corrección automática con IA se está procesando. Vas a recibir el resultado por correo.
                </p>
                <Link
                  to="/dashboard"
                  className="mt-5 inline-flex rounded-lg border border-border bg-surface-2/60 px-4 py-2.5 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
                >
                  Volver a mi panel
                </Link>
              </div>
            ) : (
              <ol className="space-y-6">
                {preguntas.map((p, idx) => (
                  <li key={p.id} className="rounded-xl border border-border bg-surface-2/40 p-4">
                    <p className="font-medium">
                      {idx + 1}. {p.texto}
                    </p>
                    <div className="mt-3 grid gap-2">
                      {p.opciones.map((op, oi) => (
                        <button
                          key={op}
                          onClick={() => setRespuestas((r) => ({ ...r, [p.id]: oi }))}
                          className={cn(
                            "rounded-lg border px-3 py-2.5 text-left text-sm transition-all duration-300",
                            respuestas[p.id] === oi
                              ? "border-primary/50 bg-primary/12 text-primary shadow-[var(--shadow-glow)]"
                              : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground",
                          )}
                        >
                          {op}
                        </button>
                      ))}
                    </div>
                  </li>
                ))}
                <li className="rounded-xl border border-border bg-surface-2/40 p-4">
                  <p className="font-medium">4. Describí cómo abordarías la optimización de una consulta lenta.</p>
                  <textarea
                    rows={4}
                    placeholder="Escribí tu respuesta..."
                    className="mt-3 w-full rounded-lg border border-input bg-surface-2/60 p-3 text-sm outline-none focus:ring-2 focus:ring-ring/60"
                  />
                </li>
              </ol>
            )}
          </Panel>
        </Reveal>

        <Reveal delay={100}>
          <Panel titulo="Estado de la prueba" className="h-full">
            <div className="flex items-center gap-3 rounded-xl border border-primary/25 bg-primary/8 p-4">
              <Timer className="size-5 text-primary" />
              <div>
                <p className="font-display text-2xl font-semibold tabular-nums">{evaluacion.duracion}:00</p>
                <p className="text-xs text-muted-foreground">Tiempo restante</p>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progreso</span>
                <span className="tabular-nums">{progreso}%</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-[image:var(--gradient-primary)] transition-all duration-500"
                  style={{ width: `${progreso}%` }}
                />
              </div>
            </div>

            <dl className="mt-5 space-y-2 text-sm">
              {[
                ["Preguntas", `${preguntas.length + 1}`],
                ["Respondidas", `${respondidas}`],
                ["Puntaje mínimo", `${evaluacion.puntajeMin}`],
                ["Corrección", "Automática con IA"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 border-b border-border/60 pb-2">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>

            <button
              onClick={() => setEnviado(true)}
              disabled={enviado}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[image:var(--gradient-primary)] px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60"
            >
              <Send className="size-4" /> Enviar evaluación
            </button>
          </Panel>
        </Reveal>
      </div>
    </AppShell>
  );
}
