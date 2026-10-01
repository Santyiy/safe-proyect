import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BrainCircuit,
  ClipboardCheck,
  ShieldCheck,
  Sparkles,
  Trophy,
  Workflow,
} from "lucide-react";
import { Reveal, useScrolled } from "@/components/safe/reveal";
import { embudo } from "@/lib/safe-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SAFE — Reclutamiento y selección con IA" },
      {
        name: "description",
        content:
          "SAFE centraliza postulantes, automatiza evaluaciones con IA y n8n, y entrega rankings para que RRHH decida con datos.",
      },
      { property: "og:title", content: "SAFE — Reclutamiento y selección con IA" },
      {
        property: "og:description",
        content: "Plataforma de reclutamiento inteligente: análisis de CV, evaluaciones y ranking automático.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: BrainCircuit,
    titulo: "Análisis de CV con IA",
    texto: "Cada CV recibe un score de compatibilidad con el puesto y observaciones justificadas.",
  },
  {
    icon: ClipboardCheck,
    titulo: "Evaluaciones asignadas",
    texto: "RRHH define fecha, horario y duración. SAFE habilita el acceso solo en esa ventana.",
  },
  {
    icon: Sparkles,
    titulo: "Corrección semántica",
    texto: "La IA compara la respuesta esperada con la del postulante y sugiere un puntaje ponderado.",
  },
  {
    icon: Workflow,
    titulo: "Automatización n8n",
    texto: "Notificaciones y correos automáticos en cada cambio de estado del proceso.",
  },
  {
    icon: Trophy,
    titulo: "Ranking de candidatos",
    texto: "Puntajes, entrevistas y compatibilidad combinados en un ranking siempre actualizado.",
  },
  {
    icon: ShieldCheck,
    titulo: "Decisión humana",
    texto: "La IA asiste, nunca decide. La contratación final es responsabilidad de RRHH.",
  },
];

function Landing() {
  const scrolled = useScrolled(20);

  return (
    <div className="min-h-screen bg-background">
      <header
        className={`sticky top-0 z-30 border-b transition-all duration-500 ${
          scrolled
            ? "topbar-shadow border-primary/25 bg-surface/85 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)] glow-shadow">
              <ShieldCheck className="size-5 text-primary-foreground" />
            </span>
            <div className="leading-tight">
              <p className="font-display text-lg font-semibold">SAFE</p>
              <p className="text-xs text-muted-foreground">Reclutamiento inteligente</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Iniciar sesion
            </Link>
            <Link
              to="/registro"
              className="rounded-lg bg-[image:var(--gradient-primary)] px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Crear cuenta
            </Link>
          </nav>
        </div>
      </header>

      <section className="halo relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-6xl px-5 pb-20 pt-20 text-center md:pt-28">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" /> IA + n8n integrados al proceso de selección
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] md:text-6xl">
              Selección de personal <span className="gradient-text">más rápida y más justa</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
              SAFE centraliza postulantes, analiza CVs, asigna y corrige evaluaciones automáticamente,
              y genera rankings para que Recursos Humanos decida con información real.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                to="/registro"
                className="group inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-primary)] px-6 py-3 font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                Crear cuenta de postulante
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-2/60 px-6 py-3 font-medium transition-colors hover:border-primary/40 hover:text-primary"
              >
                Iniciar sesión
              </Link>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-16 grid gap-4 sm:grid-cols-4">
              {embudo.map((e) => (
                <div key={e.etapa} className="surface-panel lift rounded-2xl px-5 py-6">
                  <p className="font-display text-3xl font-semibold gradient-text">{e.valor}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{e.etapa}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <h2 className="text-2xl font-semibold md:text-3xl">Qué resuelve SAFE</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Un flujo completo desde la postulación hasta la entrevista final, con trazabilidad de cada
            acción realizada sobre el candidato.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.titulo} delay={i * 70}>
              <article className="lift surface-panel h-full rounded-2xl p-6">
                <span className="grid size-11 place-items-center rounded-xl border border-primary/25 bg-primary/12 text-primary">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{f.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.texto}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24">
        <Reveal>
          <div className="surface-panel glow-shadow flex flex-col items-start gap-6 rounded-3xl p-8 md:flex-row md:items-center md:justify-between md:p-12">
            <div>
              <h2 className="text-2xl font-semibold md:text-3xl">Acceso seguro por rol</h2>
              <p className="mt-2 max-w-xl text-muted-foreground">
                Recorré el dashboard del postulante y el panel de Recursos Humanos con datos de ejemplo.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/login"
                className="rounded-xl border border-border bg-surface-2/70 px-5 py-3 text-sm font-medium transition-colors hover:border-primary/40"
              >
                Iniciar sesion
              </Link>
              <Link
                to="/registro"
                className="rounded-xl bg-[image:var(--gradient-primary)] px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
              >
                Crear cuenta
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-border/70 px-5 py-8">
        <p className="mx-auto max-w-6xl text-sm text-muted-foreground">
          SAFE — Sistema Inteligente de Reclutamiento y Selección. Prototipo de interfaz.
        </p>
      </footer>
    </div>
  );
}
