import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Bell,
  BriefcaseBusiness,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Search,
  ShieldCheck,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";
import { clearToken, getToken, normalizeRole, safeApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ScrollProgress, useScrolled } from "./reveal";

const navPostulante = [
  { to: "/dashboard", label: "Mi panel", icon: LayoutDashboard },
  { to: "/puestos", label: "Puestos", icon: BriefcaseBusiness },
  { to: "/evaluaciones", label: "Mis evaluaciones", icon: ClipboardList },
  { to: "/perfil", label: "Mi perfil", icon: UserRound },
];

const navRRHH = [
  { to: "/rrhh", label: "Postulantes", icon: Users },
  { to: "/puestos", label: "Puestos", icon: BriefcaseBusiness },
  { to: "/rrhh/evaluaciones", label: "Evaluaciones", icon: ClipboardList },
  { to: "/rrhh/ranking", label: "Ranking IA", icon: Trophy },
];

export function AppShell({
  children,
  titulo,
  subtitulo,
  usuario,
  rol,
}: {
  children: ReactNode;
  titulo: string;
  subtitulo: string;
  usuario: string;
  rol: "POSTULANTE" | "RRHH";
}) {
  const scrolled = useScrolled();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [usuarioSesion, setUsuarioSesion] = useState(usuario);
  const [rolSesion, setRolSesion] = useState<"POSTULANTE" | "RRHH">(rol);
  const [validando, setValidando] = useState(true);
  const items = rolSesion === "RRHH" ? navRRHH : navPostulante;
  const iniciales = usuarioSesion
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  useEffect(() => {
    let activo = true;

    async function validarAcceso() {
      if (!getToken()) {
        await navigate({ to: "/login" });
        return;
      }

      try {
        const response = await safeApi.me();
        if (!activo) return;

        const rolNormalizado = normalizeRole(response.user.rol);
        const esRRHH = rolNormalizado === "ADMIN" || rolNormalizado === "RRHH";
        const rolReal = esRRHH ? "RRHH" : "POSTULANTE";

        setUsuarioSesion(response.user.nombre);
        setRolSesion(rolReal);

        if (rol === "RRHH" && !esRRHH) {
          await navigate({ to: "/dashboard" });
          return;
        }

        if (rol === "POSTULANTE" && esRRHH && pathname !== "/puestos") {
          await navigate({ to: "/rrhh" });
          return;
        }
      } catch {
        clearToken();
        await navigate({ to: "/login" });
        return;
      } finally {
        if (activo) setValidando(false);
      }
    }

    void validarAcceso();

    return () => {
      activo = false;
    };
  }, [navigate, pathname, rol]);

  function cerrarSesion() {
    clearToken();
    void navigate({ to: "/login" });
  }

  if (validando) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-5 text-sm text-muted-foreground">
        Validando acceso...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <Link to="/" className="flex items-center gap-3 px-6 py-6">
          <span className="grid size-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)] glow-shadow">
            <ShieldCheck className="size-5 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">SAFE</span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {items.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[var(--shadow-soft)] ring-1 ring-primary/30"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="m-3 rounded-xl border border-sidebar-border bg-surface-2/60 p-4">
          <p className="text-xs font-medium text-muted-foreground">Automatización n8n</p>
          <p className="mt-1 text-sm text-foreground">12 flujos activos</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-4/5 rounded-full bg-[image:var(--gradient-primary)]" />
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header
          className={cn(
            "sticky top-0 z-20 border-b border-border/70 backdrop-blur-xl transition-all duration-500",
            scrolled
              ? "topbar-shadow bg-surface/85 border-primary/25"
              : "bg-background/70 shadow-none",
          )}
        >
          <div className="relative flex flex-wrap items-center gap-4 px-5 py-4 md:px-8">
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-semibold md:text-2xl">{titulo}</h1>
              <p className="truncate text-sm text-muted-foreground">{subtitulo}</p>
            </div>

            <div className="relative hidden items-center md:flex">
              <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
              <input
                placeholder="Buscar postulante, puesto..."
                className="h-10 w-64 rounded-lg border border-input bg-surface-2/70 pl-9 pr-3 text-sm outline-none transition-shadow duration-300 placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/60 focus:shadow-[var(--shadow-glow)]"
              />
            </div>

            <button className="relative grid size-10 place-items-center rounded-lg border border-border bg-surface-2/70 text-muted-foreground transition-colors hover:text-foreground">
              <Bell className="size-4" />
              <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-accent" />
            </button>

            <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-2/70 px-3 py-1.5">
              <span className="grid size-8 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-xs font-semibold text-primary-foreground">
                {iniciales}
              </span>
              <div className="hidden leading-tight sm:block">
                <p className="text-sm font-medium">{usuarioSesion}</p>
                <p className="text-xs text-muted-foreground">{rolSesion}</p>
              </div>
            </div>
            <button
              onClick={cerrarSesion}
              className="grid size-10 place-items-center rounded-lg border border-border bg-surface-2/70 text-muted-foreground transition-colors hover:text-foreground"
              title="Cerrar sesion"
            >
              <LogOut className="size-4" />
            </button>
            <ScrollProgress />
          </div>
        </header>

        <main className="px-5 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
