import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  valor,
  delta,
  icon: Icon,
}: {
  label: string;
  valor: string;
  delta?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="lift surface-panel relative overflow-hidden rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl font-semibold">{valor}</p>
        </div>
        <span className="grid size-10 place-items-center rounded-xl border border-primary/25 bg-primary/12 text-primary">
          <Icon className="size-5" />
        </span>
      </div>
      {delta ? <p className="mt-3 text-xs text-success">{delta}</p> : null}
      <span className="absolute inset-x-0 bottom-0 h-px bg-[image:var(--gradient-primary)] opacity-60" />
    </div>
  );
}

export function Panel({
  titulo,
  accion,
  children,
  className,
}: {
  titulo: string;
  accion?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("surface-panel rounded-2xl", className)}>
      <header className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-4">
        <h2 className="text-base font-semibold">{titulo}</h2>
        {accion}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

const estadoStyles: Record<string, string> = {
  Pendiente: "bg-muted text-muted-foreground border-border",
  PENDIENTE: "bg-muted text-muted-foreground border-border",
  "En evaluación": "bg-primary/15 text-primary border-primary/30",
  DISPONIBLE: "bg-success/15 text-success border-success/30",
  EN_CURSO: "bg-warning/15 text-warning border-warning/30",
  FINALIZADA: "bg-accent/15 text-accent border-accent/30",
  VENCIDA: "bg-destructive/15 text-destructive border-destructive/30",
  Entrevista: "bg-accent/15 text-accent border-accent/30",
  Aprobado: "bg-success/15 text-success border-success/30",
  Rechazado: "bg-destructive/15 text-destructive border-destructive/30",
  Activa: "bg-success/15 text-success border-success/30",
  Borrador: "bg-warning/15 text-warning border-warning/30",
  Archivada: "bg-muted text-muted-foreground border-border",
};

export function EstadoBadge({ estado }: { estado?: string | null }) {
  const estadoSeguro = estado || "SIN_ESTADO";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        estadoStyles[estadoSeguro] ?? "bg-muted text-muted-foreground border-border",
      )}
    >
      {estadoSeguro.replaceAll("_", " ")}
    </span>
  );
}

export function ScoreBar({ value }: { value: number }) {
  const tone = value >= 85 ? "bg-success" : value >= 70 ? "bg-primary" : "bg-warning";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full", tone)} style={{ width: `${value}%` }} />
      </div>
      <span className="text-sm tabular-nums text-foreground">{value}%</span>
    </div>
  );
}
