# Base de Datos SAFE

## Motor

* MySQL

---

# Tablas Principales

## Usuario

Representa las cuentas de acceso al sistema.

### Campos principales

* ID
* dni
* nombre
* email
* password
* rol

### Roles

* ADMIN
* RRHH
* POSTULANTE

### Relación

* 1:1 con Postulante

---

## Postulante

Contiene la información laboral y personal del candidato.

### Campos principales

* ID
* ID_usuario
* nombre
* apellido
* telefono
* direccion
* estudios
* experiencia_laboral
* fecha_nacimiento
* cv_url
* apto_medico_url

### Relación

* Usuario (1:1)
* 1:N EvaluacionAsignada

---

## Puesto

Representa las vacantes publicadas.

### Campos principales

* ID
* Nombre_Puesto
* Tipo
* Requisitos

### Relación

* 1:N Evaluacion

---

## Postulación

Relaciona postulantes con puestos.

### Campos principales

* ID
* ID_postulante
* ID_puesto
* Estado
* Score_IA
* Observaciones_IA

### Estado

* Pendiente
* En evaluación
* Entrevista
* Aprobado
* Rechazado

### Relación

* Postulante (N:M) Puesto

---

## Evaluación

Representa pruebas técnicas, psicotécnicas o de conocimiento.

### Campos principales

* ID
* ID_puesto
* Nombre
* Tipo
* Descripcion
* Duracion
* Puntaje_min
* Puntaje_max
* Online
* Estado

### Descripción

Las evaluaciones pueden ser creadas manualmente por RRHH o, en futuras versiones, generadas automáticamente mediante la importación de documentos PDF y el uso de Inteligencia Artificial.

### Relación

* N:1 Puesto
* 1:N Pregunta
* 1:N EvaluacionAsignada
* 1:N ResultadoEvaluacion

---

## EvaluacionAsignada

Permite asignar una evaluación específica a un postulante indicando el día y horario en que podrá realizarla.

### Campos principales

* ID
* ID_evaluacion
* ID_postulante
* fecha
* hora_inicio
* hora_fin
* estado
* intento
* fecha_asignacion

### Estados

* PENDIENTE
* DISPONIBLE
* EN_CURSO
* FINALIZADA
* VENCIDA

### Descripción

Esta tabla permite que una misma evaluación pueda asignarse a distintos postulantes en fechas y horarios diferentes.

Recursos Humanos podrá definir cuándo estará disponible una evaluación y SAFE controlará automáticamente el acceso del postulante únicamente dentro del período configurado.

### Relación

* N:1 Evaluacion
* N:1 Postulante

---

## Pregunta

Preguntas asociadas a una evaluación.

### Campos principales

* ID
* ID_evaluacion
* Pregunta
* Tipo
* Respuesta_correcta
* Peso

### Tipo

* Opción múltiple
* Verdadero/Falso
* Respuesta corta
* Desarrollo

### Descripción

La respuesta correcta será utilizada posteriormente por la IA para comparar la respuesta del postulante y calcular un puntaje de similitud.

### Relación

* N:1 Evaluacion
* 1:N RespuestaUsuario

---

## RespuestaUsuario

Respuestas enviadas por los postulantes.

### Campos principales

* ID
* ID_postulante
* ID_pregunta
* Respuesta
* Puntaje_IA
* Observacion_IA

### Descripción

Almacena la respuesta original del postulante junto con la evaluación realizada por la IA.

### Flujo

1. El postulante responde la pregunta.
2. SAFE envía la respuesta a n8n.
3. La IA compara la respuesta con la respuesta correcta.
4. Se almacena el puntaje y la observación generada.

---

## ResultadoEvaluacion

Resultados finales obtenidos por cada postulante.

### Campos principales

* ID
* ID_evaluacion
* ID_postulante
* Puntaje_obtenido
* Aprobado
* Fecha

### Descripción

Contiene el resultado general de una evaluación una vez corregidas todas las preguntas.

### Cálculo

El puntaje obtenido se calcula a partir de la suma de los puntajes obtenidos en cada pregunta de la evaluación.

---

## DetalleResultado

Detalle de corrección por pregunta.

### Campos principales

* ID
* ID_resultado
* ID_pregunta
* Puntaje
* Justificacion_IA

### Descripción

Permite visualizar cómo fue corregida cada pregunta por la IA.

### Relación

* N:1 ResultadoEvaluacion
* N:1 Pregunta

---

## Entrevista

Gestiona las entrevistas realizadas.

### Campos principales

* ID
* ID_postulante
* Fecha
* Modalidad
* Estado
* Observaciones

---

## Notificacion

Historial de notificaciones enviadas.

### Campos principales

* ID
* ID_postulante
* Mensaje
* Tipo
* Fecha

### Descripción

Permite registrar eventos importantes del sistema como nuevas postulaciones, análisis de CV realizados por IA, evaluaciones asignadas, evaluaciones finalizadas, resultados disponibles y recordatorios para RRHH.

---

## Historial

Registro de acciones realizadas sobre un postulante.

### Campos principales

* ID
* Fecha
* Accion
* ID_postulante

---

## CV

Almacena referencias a los currículums cargados.

### Campos principales

* ID
* Archivo_CV
* Fecha_carga
* ID_postulante

---

## Ranking

Ranking general de postulantes.

### Campos principales

* ID
* ID_postulante
* Posicion
* Promedio_final

### Descripción

Puede generarse automáticamente a partir de los resultados de evaluaciones y análisis IA.

### Criterios

El ranking podrá considerar:

* Score IA del CV.
* Puntajes obtenidos en evaluaciones.
* Compatibilidad con el puesto.
* Experiencia laboral.
* Resultado de entrevistas.

La decisión final siempre será tomada por RRHH.

---

# Relaciones Principales

Usuario

└── 1:1 Postulante

Postulante

├── 1:N CV

├── 1:N Entrevista

├── 1:N Historial

├── 1:N Notificacion

├── 1:N ResultadoEvaluacion

├── 1:N RespuestaUsuario

├── 1:N EvaluacionAsignada

└── N:M Puesto (mediante Postulacion)

Puesto

├── 1:N Evaluacion

└── N:M Postulante (mediante Postulacion)

Evaluacion

├── N:1 Puesto

├── 1:N Pregunta

├── 1:N EvaluacionAsignada

└── 1:N ResultadoEvaluacion

Pregunta

├── 1:N RespuestaUsuario

└── 1:N DetalleResultado

ResultadoEvaluacion

└── 1:N DetalleResultado

---

# Integración con IA (n8n)

## Análisis de CV

SAFE envía el CV y los datos del postulante a n8n.

La IA calcula la compatibilidad con el puesto y devuelve:

* Score IA.
* Observaciones IA.

Estos datos se almacenan en la Postulación para asistir al personal de RRHH durante el proceso de selección.

---

## Corrección de Evaluaciones

SAFE enviará a n8n:

* Pregunta.
* Respuesta correcta.
* Respuesta del postulante.

La IA devolverá:

* Puntaje.
* Nivel de similitud.
* Justificación.

SAFE almacenará dicha información en:

* RespuestaUsuario
* DetalleResultado
* ResultadoEvaluacion

---

## Ranking Automático

SAFE podrá generar rankings utilizando:

* Score IA del CV.
* Resultados de evaluaciones.
* Puntajes obtenidos.
* Compatibilidad con el puesto.
* Experiencia laboral.
* Resultado de entrevistas.

La decisión final siempre será tomada por RRHH.

---

# Funcionalidad futura

## Generación automática de evaluaciones mediante PDF

Como propuesta de mejora, SAFE permitirá importar evaluaciones mediante archivos PDF.

El flujo previsto será:

PDF

↓

Apache PDFBox

↓

Extracción del contenido

↓

n8n

↓

Inteligencia Artificial

↓

Generación automática de preguntas

↓

Revisión por RRHH

↓

Publicación de la evaluación

La IA únicamente asistirá en la generación del contenido; la publicación final siempre dependerá de Recursos Humanos.

---

# Flujo General del Sistema

1. El postulante crea una cuenta.
2. Completa su perfil.
3. Sube su CV.
4. Se postula a un puesto.
5. SAFE analiza el CV mediante IA (n8n).
6. RRHH selecciona una evaluación.
7. RRHH define la fecha y el horario de inicio y finalización.
8. SAFE registra la asignación en la tabla EvaluacionAsignada.
9. El postulante visualiza la evaluación en su Dashboard.
10. La evaluación solo podrá iniciarse dentro del horario establecido.
11. El postulante responde la evaluación.
12. SAFE envía las respuestas a n8n.
13. La IA corrige cada respuesta.
14. SAFE almacena los resultados en:
    * RespuestaUsuario
    * DetalleResultado
    * ResultadoEvaluacion
15. RRHH revisa los resultados obtenidos.
16. Se agenda una entrevista.
17. SAFE genera el ranking de postulantes.
18. RRHH toma la decisión final de contratación.