# Cambios realizados en Frontend - Puestos y Evaluaciones

## Objetivo

Se conectaron al frontend las funcionalidades que ya estaban disponibles en el backend para el panel de Recursos Humanos/Admin, principalmente:

- Gestion de puestos.
- Gestion de evaluaciones.
- Asignacion de evaluaciones.
- Gestion de preguntas.
- Control de acceso por rol.

---

## Archivos modificados

### Frontend

- `Front/src/lib/api.ts`
- `Front/src/components/safe/app-shell.tsx`
- `Front/src/routes/index.tsx`
- `Front/src/routes/puestos.tsx`
- `Front/src/routes/rrhh/evaluaciones.tsx`

---

## Conexion con backend

La conexion entre frontend y backend se centralizo en:

```ts
Front/src/lib/api.ts
```

Ese archivo usa `fetch` para llamar a los endpoints de Spring Boot y agrega automaticamente el token JWT cuando existe:

```ts
headers.set("Authorization", `Bearer ${token}`);
```

De esta forma, las pantallas React no llaman directamente al backend, sino que usan los metodos de `safeApi`.

---

## Gestion de puestos

Archivo principal:

```ts
Front/src/routes/puestos.tsx
```

Se adapto la pantalla `/puestos` para que funcione segun el rol del usuario autenticado.

### Para postulantes

El postulante puede:

- Ver los puestos disponibles.
- Postularse a un puesto.

Endpoints usados:

```http
GET /puestos
POST /postulante/postulaciones/{idPuesto}
```

### Para RRHH/Admin

RRHH/Admin puede:

- Listar puestos.
- Crear puesto.
- Editar puesto.
- Eliminar puesto.

Endpoints usados:

```http
GET /puestos
POST /admin/puestos
PUT /admin/puestos/{id}
DELETE /admin/puestos/{id}
```

Metodos agregados en `safeApi`:

```ts
crearPuesto(...)
actualizarPuesto(...)
eliminarPuesto(...)
puestos()
```

---

## Gestion de evaluaciones

Archivo principal:

```ts
Front/src/routes/rrhh/evaluaciones.tsx
```

Se amplio la pantalla de evaluaciones del panel RRHH/Admin para usar las funcionalidades disponibles en backend.

### Evaluaciones

RRHH/Admin puede:

- Listar evaluaciones.
- Crear evaluacion.
- Editar evaluacion.
- Eliminar evaluacion.
- Asociar una evaluacion a un puesto existente.

Endpoints usados:

```http
GET /admin/evaluaciones
POST /admin/evaluaciones
PUT /admin/evaluaciones/{id}
DELETE /admin/evaluaciones/{id}
GET /puestos
```

Metodos agregados en `safeApi`:

```ts
evaluaciones()
crearEvaluacion(...)
actualizarEvaluacion(...)
eliminarEvaluacion(...)
```

---

## Asignacion de evaluaciones

En la misma pantalla de RRHH/Admin se agrego la gestion de asignaciones.

RRHH/Admin puede:

- Asignar una evaluacion a un postulante.
- Listar asignaciones existentes.
- Cambiar el estado de una asignacion.

Endpoints usados:

```http
GET /admin/evaluaciones/asignaciones
POST /admin/evaluaciones/asignaciones
PATCH /admin/evaluaciones/asignaciones/{id}/estado?estado={estado}
GET /admin/postulantes
```

Metodos agregados en `safeApi`:

```ts
asignaciones()
asignarEvaluacion(...)
cambiarEstadoAsignacion(...)
adminPostulantes()
```

---

## Gestion de preguntas

Tambien se conecto el CRUD de preguntas asociado a cada evaluacion.

RRHH/Admin puede:

- Seleccionar una evaluacion.
- Listar sus preguntas.
- Crear pregunta.
- Editar pregunta.
- Eliminar pregunta.

Endpoints usados:

```http
GET /admin/evaluaciones/{idEvaluacion}/preguntas
POST /admin/evaluaciones/{idEvaluacion}/preguntas
PUT /admin/evaluaciones/preguntas/{idPregunta}
DELETE /admin/evaluaciones/preguntas/{idPregunta}
```

Metodos agregados en `safeApi`:

```ts
preguntas(...)
crearPregunta(...)
actualizarPregunta(...)
eliminarPregunta(...)
```

---

## Seguridad y roles

Archivo modificado:

```ts
Front/src/components/safe/app-shell.tsx
```

Se agrego validacion de sesion y rol usando:

```http
GET /usuario/me
```

Comportamiento:

- Si no hay token, redirige a `/login`.
- Si el usuario es `POSTULANTE`, se lo mantiene en las pantallas de postulante.
- Si el usuario es `ADMIN` o `RRHH`, se lo deriva al panel de RRHH/Admin.
- Si un postulante intenta entrar a una pantalla de RRHH/Admin, se redirige.
- Si RRHH/Admin entra a una pantalla que no corresponde, se lo redirige al panel correcto.

Tambien se agrego boton de cerrar sesion, que elimina el token guardado en `localStorage`.

---

## Home

Archivo modificado:

```ts
Front/src/routes/index.tsx
```

Se quitaron los accesos directos:

- Soy postulante.
- Panel RRHH.
- Dashboard postulante.
- Panel RRHH desde la seccion inferior.

Ahora la entrada al sistema pasa por:

- Login.
- Registro.

Esto evita accesos directos desde la home a paneles internos sin pasar por autenticacion.

---

## Verificacion

Se ejecuto el build del frontend:

```bash
npm.cmd run build
```

Resultado:

```text
Build compilado correctamente.
```

Tambien se dejo levantado el frontend de desarrollo en:

```text
http://127.0.0.1:8082/
```

---

## Nota importante

La seguridad real queda del lado del backend.

El frontend ayuda a mostrar u ocultar pantallas segun el rol, pero la proteccion importante es que Spring Boot mantenga protegidos los endpoints:

```http
/admin/**
/postulante/**
```

Por eso, aunque alguien intente llamar manualmente a un endpoint admin desde el navegador o Postman, el backend debe responder `403 Forbidden` si el usuario no tiene rol `ADMIN` o `RRHH`.
