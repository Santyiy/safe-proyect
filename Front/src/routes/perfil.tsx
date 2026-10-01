import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileUp, Save, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/safe/app-shell";
import { Panel, ScoreBar } from "@/components/safe/pieces";
import { Reveal } from "@/components/safe/reveal";
import { type PostulantePayload, safeApi } from "@/lib/api";

export const Route = createFileRoute("/perfil")({
  head: () => ({ meta: [{ title: "Mi perfil | SAFE postulante" }] }),
  component: Perfil,
});

const emptyProfile: PostulantePayload = {
  telefono: "", direccion: "", fechaNacimiento: "", estadoCivil: "",
  experienciaLaboral: "", estudios: "", infoMedica: "", cvUrl: "", aptoMedicoUrl: "",
};

function Perfil() {
  const [form, setForm] = useState<PostulantePayload>(emptyProfile);
  const [nombre, setNombre] = useState("Postulante");
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    safeApi.perfil()
      .then((perfil) => {
        setForm({
          telefono: perfil.telefono ?? "",
          direccion: perfil.direccion ?? "",
          fechaNacimiento: perfil.fechaNacimiento ?? "",
          estadoCivil: perfil.estadoCivil ?? "",
          experienciaLaboral: perfil.experienciaLaboral ?? "",
          estudios: perfil.estudios ?? "",
          infoMedica: perfil.infoMedica ?? "",
          cvUrl: perfil.cvUrl ?? "",
          aptoMedicoUrl: perfil.aptoMedicoUrl ?? "",
        });
        setNombre(perfil.nombre || "Postulante");
        setEmail(perfil.email || "");
        setDni(perfil.dni || "");
      })
      .catch((error) => setMensaje(error instanceof Error ? error.message : "No se pudo cargar el perfil"));
  }, []);

  function update(field: keyof PostulantePayload, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function guardar() {
    setMensaje("");
    try {
      await safeApi.actualizarPerfil(form);
      setMensaje("Perfil actualizado correctamente");
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "No se pudo guardar el perfil");
    }
  }

  return (
    <AppShell titulo="Mi perfil" subtitulo="Datos que ve Recursos Humanos" usuario={nombre} rol="POSTULANTE">
      {mensaje ? <p className="mb-5 rounded-xl border border-primary/25 bg-primary/8 p-4 text-sm text-muted-foreground">{mensaje}</p> : null}
      <div className="grid gap-6 xl:grid-cols-3">
        <Reveal className="xl:col-span-2">
          <Panel titulo="Datos personales">
            <div className="grid gap-4 text-sm sm:grid-cols-2">
              <ReadOnly label="Nombre completo" value={nombre} />
              <ReadOnly label="DNI" value={dni} />
              <ReadOnly label="Correo electronico" value={email} />
              <Campo label="Telefono" value={form.telefono ?? ""} onChange={(v) => update("telefono", v)} />
              <Campo label="Direccion" value={form.direccion ?? ""} onChange={(v) => update("direccion", v)} />
              <Campo label="Fecha nacimiento" value={form.fechaNacimiento ?? ""} onChange={(v) => update("fechaNacimiento", v)} />
              <Campo label="Estado civil" value={form.estadoCivil ?? ""} onChange={(v) => update("estadoCivil", v)} />
              <Campo label="Estudios" value={form.estudios ?? ""} onChange={(v) => update("estudios", v)} />
            </div>
            <TextArea label="Experiencia profesional" value={form.experienciaLaboral ?? ""} onChange={(v) => update("experienciaLaboral", v)} />
            <button onClick={guardar} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[image:var(--gradient-primary)] px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:-translate-y-0.5">
              <Save className="size-4" /> Guardar cambios
            </button>
          </Panel>
        </Reveal>
        <div className="space-y-6">
          <Reveal delay={80}>
            <Panel titulo="Curriculum Vitae">
              <div className="rounded-xl border border-dashed border-primary/35 bg-primary/6 p-6 text-center">
                <FileUp className="mx-auto size-7 text-primary" />
                <p className="mt-3 text-sm font-medium">URL del CV</p>
                <input value={form.cvUrl ?? ""} onChange={(event) => update("cvUrl", event.target.value)} placeholder="https://.../cv.pdf" className="mt-3 h-11 w-full rounded-lg border border-input bg-surface-2/60 px-3 text-sm outline-none focus:ring-2 focus:ring-ring/60" />
              </div>
              <div className="mt-5"><p className="text-sm text-muted-foreground">Completitud del CV</p><div className="mt-2"><ScoreBar value={form.cvUrl ? 80 : 20} /></div></div>
            </Panel>
          </Reveal>
          <Reveal delay={140}>
            <Panel titulo="Seguridad">
              <div className="flex items-start gap-3 text-sm"><ShieldCheck className="mt-0.5 size-5 text-success" /><p className="text-muted-foreground">Tus datos se usan unicamente dentro del proceso de seleccion.</p></div>
            </Panel>
          </Reveal>
        </div>
      </div>
    </AppShell>
  );
}

function Campo({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="text-muted-foreground">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} className="mt-1.5 h-11 w-full rounded-lg border border-input bg-surface-2/60 px-3 text-sm outline-none focus:ring-2 focus:ring-ring/60" /></label>;
}
function ReadOnly({ label, value }: { label: string; value: string }) {
  return <label className="block"><span className="text-muted-foreground">{label}</span><input value={value} readOnly className="mt-1.5 h-11 w-full rounded-lg border border-input bg-surface-2/60 px-3 text-sm text-muted-foreground" /></label>;
}
function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="mt-4 block text-sm"><span className="text-muted-foreground">{label}</span><textarea rows={4} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1.5 w-full rounded-lg border border-input bg-surface-2/60 p-3 text-sm outline-none focus:ring-2 focus:ring-ring/60" /></label>;
}
