import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/safe/reveal";
import { normalizeRole, safeApi, setToken } from "@/lib/api";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Iniciar sesion | SAFE" },
      {
        name: "description",
        content:
          "Accede a SAFE con tu cuenta de postulante o de Recursos Humanos para seguir tu proceso de seleccion.",
      },
      { property: "og:title", content: "Iniciar sesion | SAFE" },
      { property: "og:description", content: "Acceso de postulantes y equipo de RRHH a la plataforma SAFE." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = await safeApi.login(email, password);
      if (!token) {
        throw new Error("Credenciales invalidas");
      }

      setToken(token);
      const me = await safeApi.me();
      const rol = normalizeRole(me.user.rol);

      await navigate({ to: rol === "ADMIN" || rol === "RRHH" ? "/rrhh" : "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-5 py-16">
      <div className="halo pointer-events-none absolute inset-0" />
      <Reveal className="relative w-full max-w-md">
        <div className="surface-panel rounded-2xl p-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[image:var(--gradient-primary)] glow-shadow">
              <ShieldCheck className="size-5 text-primary-foreground" />
            </span>
            <span className="font-display text-xl font-semibold tracking-tight">SAFE</span>
          </Link>

          <h1 className="mt-6 font-display text-2xl font-semibold">Iniciar sesion</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ingresa con tus credenciales reales del backend.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4 text-sm">
            <label className="block">
              <span className="text-muted-foreground">Correo electronico</span>
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="nombre@mail.com"
                  className="h-11 w-full rounded-lg border border-input bg-surface-2/60 pl-9 pr-3 text-sm outline-none transition-shadow duration-300 focus:ring-2 focus:ring-ring/60 focus:shadow-[var(--shadow-glow)]"
                />
              </div>
            </label>
            <label className="block">
              <span className="text-muted-foreground">Contrasena</span>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="********"
                  className="h-11 w-full rounded-lg border border-input bg-surface-2/60 pl-9 pr-3 text-sm outline-none transition-shadow duration-300 focus:ring-2 focus:ring-ring/60 focus:shadow-[var(--shadow-glow)]"
                />
              </div>
            </label>

            {error ? (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[image:var(--gradient-primary)] px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading ? "Ingresando..." : "Entrar"} <ArrowRight className="size-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            No tenes cuenta?{" "}
            <Link to="/registro" className="text-primary hover:underline">
              Registrate
            </Link>
          </p>
        </div>
      </Reveal>
    </main>
  );
}
