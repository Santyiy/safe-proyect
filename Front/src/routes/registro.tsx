import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/safe/reveal";
import { clearToken, safeApi, setToken } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/registro")({
  head: () => ({ meta: [{ title: "Registro de postulante | SAFE" }] }),
  component: Registro,
});

const pasos = ["Cuenta", "Perfil profesional", "Confirmacion"];

function Registro() {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: "", apellido: "", dni: "", email: "", password: "", repetirPassword: "",
    telefono: "", direccion: "", fechaNacimiento: "", estadoCivil: "",
    estudios: "", experienciaLaboral: "", cvUrl: "", aptoMedicoUrl: "", infoMedica: "",
  });

  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  async function confirmar() {
    setError("");
    if (form.password !== form.repetirPassword) {
      setError("Las contrasenas no coinciden");
      return;
    }
    setLoading(true);
    clearToken();
    try {
      await safeApi.register({
        dni: form.dni,
        nombre: `${form.nombre} ${form.apellido}`.trim(),
        email: form.email,
        password: form.password,
      });
      const token = await safeApi.login(form.email, form.password);
      if (!token) {
        throw new Error("Usuario creado, pero no se pudo iniciar sesion automaticamente");
      }
      setToken(token);
      await safeApi.crearPerfil({
        telefono: form.telefono,
        direccion: form.direccion,
        fechaNacimiento: form.fechaNacimiento,
        estadoCivil: form.estadoCivil,
        estudios: form.estudios,
        experienciaLaboral: form.experienciaLaboral,
        cvUrl: form.cvUrl,
        aptoMedicoUrl: form.aptoMedicoUrl,
        infoMedica: form.infoMedica,
      });
      await navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo completar el registro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="halo min-h-screen bg-background">
      <div className="relative z-10 mx-auto max-w-3xl px-5 py-14">
        <Link to="/" className="inline-flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)] glow-shadow">
            <ShieldCheck className="size-5 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-semibold">SAFE</span>
        </Link>
        <Reveal>
          <h1 className="mt-8 text-3xl font-semibold md:text-4xl">Crea tu cuenta de postulante</h1>
          <p className="mt-2 text-muted-foreground">Tu informacion queda guardada para futuras postulaciones.</p>
        </Reveal>
        <div className="mt-8 flex items-center gap-3">
          {pasos.map((p, i) => (
            <div key={p} className="flex flex-1 items-center gap-3">
              <div className={cn("flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm", i <= paso ? "border-primary/40 bg-primary/12 text-primary" : "border-border text-muted-foreground")}>
                <span className="grid size-5 place-items-center rounded-full bg-primary/20 text-xs">{i < paso ? <Check className="size-3" /> : i + 1}</span>
                <span className="hidden sm:inline">{p}</span>
              </div>
              {i < pasos.length - 1 ? <div className="h-px flex-1 bg-border" /> : null}
            </div>
          ))}
        </div>
        <Reveal delay={80}>
          <div className="surface-panel mt-8 rounded-2xl p-6 md:p-8">
            {paso === 0 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <Campo label="Nombre" value={form.nombre} onChange={(v) => update("nombre", v)} />
                <Campo label="Apellido" value={form.apellido} onChange={(v) => update("apellido", v)} />
                <Campo label="DNI" value={form.dni} onChange={(v) => update("dni", v)} />
                <Campo label="Email" value={form.email} onChange={(v) => update("email", v)} type="email" />
                <Campo label="Contrasena" value={form.password} onChange={(v) => update("password", v)} type="password" />
                <Campo label="Repetir contrasena" value={form.repetirPassword} onChange={(v) => update("repetirPassword", v)} type="password" />
              </div>
            ) : null}
            {paso === 1 ? (
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Campo label="Telefono" value={form.telefono} onChange={(v) => update("telefono", v)} />
                  <Campo label="Direccion" value={form.direccion} onChange={(v) => update("direccion", v)} />
                  <Campo label="Fecha nacimiento" value={form.fechaNacimiento} onChange={(v) => update("fechaNacimiento", v)} placeholder="1998-04-20" />
                  <Campo label="Estado civil" value={form.estadoCivil} onChange={(v) => update("estadoCivil", v)} />
                  <Campo label="Estudios" value={form.estudios} onChange={(v) => update("estudios", v)} />
                  <Campo label="CV URL" value={form.cvUrl} onChange={(v) => update("cvUrl", v)} placeholder="https://.../cv.pdf" />
                  <Campo label="Apto medico URL" value={form.aptoMedicoUrl} onChange={(v) => update("aptoMedicoUrl", v)} />
                </div>
                <TextArea label="Experiencia laboral" value={form.experienciaLaboral} onChange={(v) => update("experienciaLaboral", v)} />
              </div>
            ) : null}
            {paso === 2 ? (
              <dl className="divide-y divide-border/70 rounded-xl border border-border bg-surface-2/40">
                {[["Nombre", `${form.nombre} ${form.apellido}`], ["DNI", form.dni], ["Email", form.email], ["CV", form.cvUrl || "Sin CV"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 px-4 py-3 text-sm"><dt className="text-muted-foreground">{k}</dt><dd>{v}</dd></div>
                ))}
              </dl>
            ) : null}
            {error ? <p className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p> : null}
            <div className="mt-8 flex items-center justify-between gap-3">
              <button onClick={() => setPaso((p) => Math.max(0, p - 1))} disabled={paso === 0} className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium disabled:opacity-40">Volver</button>
              {paso < 2 ? (
                <button onClick={() => setPaso((p) => Math.min(2, p + 1))} className="rounded-lg bg-[image:var(--gradient-primary)] px-5 py-2.5 text-sm font-semibold text-primary-foreground">Continuar</button>
              ) : (
                <button onClick={confirmar} disabled={loading} className="rounded-lg bg-[image:var(--gradient-primary)] px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{loading ? "Registrando..." : "Confirmar e ingresar"}</button>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function Campo({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block"><span className="text-sm text-muted-foreground">{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-1.5 h-11 w-full rounded-lg border border-input bg-surface-2/60 px-3 text-sm outline-none focus:ring-2 focus:ring-ring/60" /></label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block"><span className="text-sm text-muted-foreground">{label}</span><textarea rows={4} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1.5 w-full rounded-lg border border-input bg-surface-2/60 p-3 text-sm outline-none focus:ring-2 focus:ring-ring/60" /></label>
  );
}
