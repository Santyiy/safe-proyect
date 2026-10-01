import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { MapPin, Pencil, Plus, Trash2, Users2 } from "lucide-react";
import { AppShell } from "@/components/safe/app-shell";
import { Reveal } from "@/components/safe/reveal";
import { normalizeRole, type PuestoApi, safeApi } from "@/lib/api";

export const Route = createFileRoute("/puestos")({
  head: () => ({ meta: [{ title: "Puestos | SAFE" }] }),
  component: Puestos,
});

type RolVista = "POSTULANTE" | "RRHH";

type PuestoForm = {
  id?: number;
  nombrePuesto: string;
  tipo: string;
  requisitos: string;
};

const formInicial: PuestoForm = {
  nombrePuesto: "",
  tipo: "",
  requisitos: "",
};

function Puestos() {
  const [rolVista, setRolVista] = useState<RolVista>("POSTULANTE");
  const [puestos, setPuestos] = useState<PuestoApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [form, setForm] = useState<PuestoForm>(formInicial);

  const esRRHH = rolVista === "RRHH";
  const titulo = esRRHH ? "Gestion de puestos" : "Puestos disponibles";
  const subtitulo = esRRHH ? "Crea y administra las vacantes publicadas" : "Vacantes abiertas para tu perfil";

  const requisitosFormateados = useMemo(
    () => form.requisitos.split(",").map((r) => r.trim()).filter(Boolean),
    [form.requisitos],
  );

  async function cargar() {
    setLoading(true);
    try {
      const [puestosResponse, meResponse] = await Promise.all([safeApi.puestos(), safeApi.me()]);
      const rolNormalizado = normalizeRole(meResponse.user.rol);
      setRolVista(rolNormalizado === "ADMIN" || rolNormalizado === "RRHH" ? "RRHH" : "POSTULANTE");
      setPuestos(puestosResponse.data ?? []);
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "No se pudieron cargar los puestos");
    } finally {
      setLoading(false);
    }
  }

  async function postular(idPuesto: number) {
    setMensaje("");
    try {
      const response = await safeApi.postularse(idPuesto);
      setMensaje(response.message ?? "Postulacion realizada. Revisar analisis en n8n.");
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "No se pudo realizar la postulacion");
    }
  }

  async function guardarPuesto(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMensaje("");
    setGuardando(true);

    const payload = {
      nombrePuesto: form.nombrePuesto.trim(),
      tipo: form.tipo.trim(),
      requisitos: form.requisitos.trim(),
    };

    try {
      if (form.id) {
        await safeApi.actualizarPuesto(form.id, payload);
        setMensaje("Puesto actualizado correctamente.");
      } else {
        await safeApi.crearPuesto(payload);
        setMensaje("Puesto creado correctamente.");
      }
      setForm(formInicial);
      await cargar();
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "No se pudo guardar el puesto");
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarPuesto(id: number) {
    setMensaje("");
    try {
      await safeApi.eliminarPuesto(id);
      setMensaje("Puesto eliminado correctamente.");
      await cargar();
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "No se pudo eliminar el puesto");
    }
  }

  function editarPuesto(puesto: PuestoApi) {
    setForm({
      id: puesto.id,
      nombrePuesto: puesto.nombrePuesto,
      tipo: puesto.tipo,
      requisitos: puesto.requisitos,
    });
  }

  useEffect(() => {
    void cargar();
  }, []);

  return (
    <AppShell titulo={titulo} subtitulo={subtitulo} usuario={esRRHH ? "Recursos Humanos" : "Postulante"} rol={rolVista}>
      {mensaje ? <p className="mb-5 rounded-xl border border-primary/25 bg-primary/8 p-4 text-sm text-muted-foreground">{mensaje}</p> : null}
      {loading ? <p className="text-sm text-muted-foreground">Cargando puestos...</p> : null}

      {esRRHH ? (
        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <form onSubmit={guardarPuesto} className="surface-panel rounded-2xl p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{form.id ? "Editar puesto" : "Crear puesto"}</h2>
                <p className="mt-1 text-sm text-muted-foreground">Publica una vacante disponible para postulantes.</p>
              </div>
              <span className="grid size-10 place-items-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                <Plus className="size-5" />
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block text-sm font-medium">
                Nombre del puesto
                <input
                  value={form.nombrePuesto}
                  onChange={(event) => setForm((actual) => ({ ...actual, nombrePuesto: event.target.value }))}
                  required
                  className="mt-2 h-11 w-full rounded-lg border border-input bg-surface-2/70 px-3 text-sm outline-none focus:ring-2 focus:ring-ring/60"
                  placeholder="Ej: Operario de deposito"
                />
              </label>

              <label className="block text-sm font-medium">
                Tipo
                <input
                  value={form.tipo}
                  onChange={(event) => setForm((actual) => ({ ...actual, tipo: event.target.value }))}
                  required
                  className="mt-2 h-11 w-full rounded-lg border border-input bg-surface-2/70 px-3 text-sm outline-none focus:ring-2 focus:ring-ring/60"
                  placeholder="Ej: Full-time, presencial"
                />
              </label>

              <label className="block text-sm font-medium">
                Requisitos
                <textarea
                  value={form.requisitos}
                  onChange={(event) => setForm((actual) => ({ ...actual, requisitos: event.target.value }))}
                  required
                  rows={5}
                  className="mt-2 w-full resize-none rounded-lg border border-input bg-surface-2/70 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/60"
                  placeholder="Separalos por coma para verlos como etiquetas"
                />
              </label>
            </div>

            {requisitosFormateados.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {requisitosFormateados.map((requisito) => (
                  <span key={requisito} className="rounded-lg border border-border bg-surface-2/60 px-2.5 py-1 text-xs text-muted-foreground">
                    {requisito}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={guardando}
                className="rounded-lg bg-[image:var(--gradient-primary)] px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {guardando ? "Guardando..." : form.id ? "Guardar cambios" : "Crear puesto"}
              </button>
              {form.id ? (
                <button
                  type="button"
                  onClick={() => setForm(formInicial)}
                  className="rounded-lg border border-border bg-surface-2/70 px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40"
                >
                  Cancelar
                </button>
              ) : null}
            </div>
          </form>

          <div className="grid gap-4">
            {puestos.map((puesto, i) => (
              <Reveal key={puesto.id} delay={i * 50}>
                <article className="surface-panel rounded-2xl p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">{puesto.nombrePuesto}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{puesto.tipo}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editarPuesto(puesto)}
                        className="grid size-10 place-items-center rounded-lg border border-border bg-surface-2/70 text-muted-foreground transition-colors hover:text-foreground"
                        title="Editar puesto"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => eliminarPuesto(puesto.id)}
                        className="grid size-10 place-items-center rounded-lg border border-destructive/30 bg-destructive/10 text-destructive transition-colors hover:bg-destructive/15"
                        title="Eliminar puesto"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {puesto.requisitos.split(",").map((r) => r.trim()).filter(Boolean).map((requisito) => (
                      <span key={requisito} className="rounded-lg border border-border bg-surface-2/60 px-2.5 py-1 text-xs text-muted-foreground">
                        {requisito}
                      </span>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {puestos.map((p, i) => {
            const requisitos = p.requisitos?.split(",").map((r) => r.trim()).filter(Boolean) ?? [];
            return (
              <Reveal key={p.id} delay={i * 70}>
                <article className="lift surface-panel h-full rounded-2xl p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold">{p.nombrePuesto}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{p.tipo}</p>
                    </div>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">#{p.id}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(requisitos.length ? requisitos : [p.requisitos]).map((r) => (
                      <span key={r} className="rounded-lg border border-border bg-surface-2/60 px-2.5 py-1 text-xs text-muted-foreground">{r}</span>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-border/70 pt-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><MapPin className="size-4" /> SAFE</span>
                    <span className="inline-flex items-center gap-1.5"><Users2 className="size-4" /> Postulaciones</span>
                    <button onClick={() => postular(p.id)} className="rounded-lg bg-[image:var(--gradient-primary)] px-4 py-2 font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5">Postularme</button>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
