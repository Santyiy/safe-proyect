# Integracion n8n - Analisis de CV

## Objetivo

Conectar SAFE con un workflow de n8n para analizar el CV/perfil de un postulante mediante IA y devolver el resultado al backend.

El flujo queda asi:

```text
Postulante se postula a un puesto
        ↓
Spring Boot guarda la postulacion
        ↓
Spring Boot envia datos a n8n
        ↓
n8n ejecuta el agente IA
        ↓
n8n devuelve score/observaciones a Spring Boot
        ↓
Spring Boot actualiza la postulacion
        ↓
RRHH ve scoreIa y observacionesIa en el panel
```

---

## Configuracion en Spring Boot

Archivo:

```text
src/main/resources/application.properties
```

Propiedades agregadas:

```properties
n8n.webhook.analisis-cv-url=
n8n.webhook.result-secret=
safe.api.public-base-url=http://localhost:8080
```

### `n8n.webhook.analisis-cv-url`

Es la URL del Webhook inicial de n8n.

Ejemplo local:

```properties
n8n.webhook.analisis-cv-url=http://localhost:5678/webhook/analisis-cv
```

O si se usa la URL de test de n8n:

```properties
n8n.webhook.analisis-cv-url=http://localhost:5678/webhook-test/analisis-cv
```

### `safe.api.public-base-url`

Es la URL publica del backend SAFE que n8n usara para devolver el resultado.

En local:

```properties
safe.api.public-base-url=http://localhost:8080
```

Si n8n corre en Docker, puede que `localhost` no apunte a tu PC. En ese caso usar la IP local:

```properties
safe.api.public-base-url=http://192.168.0.105:8080
```

### `n8n.webhook.result-secret`

Es opcional. Sirve para proteger el endpoint donde n8n devuelve el resultado.

Ejemplo:

```properties
n8n.webhook.result-secret=mi_clave_segura
```

Si se configura, n8n debe enviar este header:

```http
X-SAFE-WEBHOOK-SECRET: mi_clave_segura
```

---

## Endpoint que SAFE envia a n8n

Cuando un postulante se postula, SAFE envia un `POST` al webhook configurado en:

```properties
n8n.webhook.analisis-cv-url
```

Payload enviado a n8n:

```json
{
  "evento": "ANALISIS_CV",
  "callbackUrl": "http://localhost:8080/webhooks/n8n/analisis-cv",
  "puesto": {
    "id": 1,
    "nombre": "Backend Java Jr",
    "requisitos": "Java, Spring Boot, SQL"
  },
  "postulante": {
    "id": 12,
    "nombre": "Juan Perez",
    "email": "juan@mail.com",
    "dni": "12345678",
    "experiencia": "Experiencia laboral cargada",
    "estudios": "Estudios cargados",
    "cvUrl": "https://...",
    "telefono": "123456",
    "direccion": "Direccion cargada"
  }
}
```

---

## Webhook inicial en n8n

El nodo `Webhook` de n8n debe recibir la solicitud desde Spring Boot.

Configuracion recomendada:

```text
Method: POST
Path: analisis-cv
Response: puede responder inmediatamente OK
```

Importante:

En el workflow de la imagen el Webhook aparece como `GET`. Para recibir datos desde Spring Boot deberia estar en:

```text
POST
```

---

## Agente IA en n8n

El agente IA debe leer:

- Datos del puesto.
- Requisitos del puesto.
- Datos del postulante.
- Experiencia.
- Estudios.
- `cvUrl`.

Debe devolver una respuesta estructurada, por ejemplo:

```json
{
  "scoreIa": 82.5,
  "observacionesIa": "El candidato cumple con Java y SQL, tiene experiencia parcial en Spring Boot.",
  "estado": "ANALIZADO_IA"
}
```

---

## HTTP Request final en n8n

El ultimo nodo `HTTP Request` debe devolver el resultado al backend SAFE.

Configuracion:

```text
Method: POST
URL: {{$json.callbackUrl}}
Send Body: JSON
```

Body esperado por SAFE:

```json
{
  "idPostulante": 12,
  "idPuesto": 1,
  "scoreIa": 82.5,
  "observacionesIa": "El candidato cumple con Java y SQL, tiene experiencia parcial en Spring Boot.",
  "estado": "ANALIZADO_IA"
}
```

Si se usa secret, agregar header:

```http
X-SAFE-WEBHOOK-SECRET: mi_clave_segura
```

---

## Endpoint de retorno en SAFE

Se agrego este endpoint:

```http
POST /webhooks/n8n/analisis-cv
```

Controller:

```text
src/main/java/com/safe/controller/N8nWebhookController.java
```

DTO:

```text
src/main/java/com/safe/dto/AnalisisCvResultadoDTO.java
```

Este endpoint:

1. Recibe el resultado de n8n.
2. Busca la postulacion por `idPostulante` + `idPuesto`.
3. Actualiza:
   - `scoreIa`
   - `observacionesIa`
   - `estado`
4. Devuelve la postulacion actualizada.

---

## Campos actualizados en base de datos

Tabla:

```text
postulacion
```

Campos:

```text
Score_IA
Observaciones_IA
Estado
```

---

## Prueba manual del callback

Se puede probar sin n8n usando Postman o PowerShell:

```powershell
Invoke-RestMethod `
  -Uri http://localhost:8080/webhooks/n8n/analisis-cv `
  -Method POST `
  -ContentType "application/json" `
  -Body '{
    "idPostulante": 12,
    "idPuesto": 1,
    "scoreIa": 82.5,
    "observacionesIa": "Buen perfil para el puesto.",
    "estado": "ANALIZADO_IA"
  }'
```

Luego consultar las postulaciones desde el panel RRHH o desde:

```http
GET /admin/postulaciones
```

---

## Archivos modificados

- `src/main/java/com/safe/service/PostulacionService.java`
- `src/main/java/com/safe/controller/N8nWebhookController.java`
- `src/main/java/com/safe/dto/AnalisisCvResultadoDTO.java`
- `src/main/java/com/safe/config/SecurityConfig.java`
- `src/main/resources/application.properties`

---

## Estado

La integracion backend para analisis de CV queda preparada:

- SAFE envia datos a n8n.
- n8n puede procesar con IA.
- n8n puede devolver resultado.
- SAFE guarda score y observaciones en la postulacion.

Queda pendiente configurar en n8n:

- Webhook inicial en `POST`.
- Prompt/agente IA usando los datos recibidos.
- HTTP Request final hacia `callbackUrl`.
- Mapear correctamente `idPostulante`, `idPuesto`, `scoreIa`, `observacionesIa` y `estado`.
