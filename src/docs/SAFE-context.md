SAFE — Sistema Inteligente de Reclutamiento y Selección
Objetivo del Sistema
SAFE es una plataforma de reclutamiento inteligente diseñada para optimizar y automatizar gran parte del proceso de selección de personal mediante:
Gestión centralizada de postulantes.
Automatización de procesos con n8n.
Análisis de CV mediante Inteligencia Artificial.
Evaluaciones automáticas y corrección inteligente.
Ranking de candidatos.
Paneles administrativos para Recursos Humanos.
Seguimiento completo del proceso de selección.
El objetivo principal es reducir tiempos de contratación, mejorar la calidad de los candidatos seleccionados y brindar herramientas de apoyo para la toma de decisiones de RRHH.

Flujo General del Sistema
1. Inicio de Sesión y Registro
Al ingresar al sistema, el usuario podrá:
Iniciar sesión.
Crear una cuenta nueva.

Registro del Postulante
El registro se realizará en tres etapas.
Paso 1 — Creación de Cuenta
El usuario deberá ingresar:
Nombre
Apellido
DNI
Email
Contraseña
El sistema creará una cuenta de acceso única.

Paso 2 — Perfil Profesional
Una vez creada la cuenta, el postulante deberá completar su perfil laboral:
Información personal
Teléfono
Dirección
Fecha de nacimiento
Estado civil
Formación académica
Estudios realizados
Cursos
Certificaciones
Información laboral
Experiencia laboral
Habilidades
Disponibilidad horaria
LinkedIn
Documentación
CV en formato PDF
Apto médico (opcional)
Certificaciones adicionales
Toda esta información quedará almacenada para futuras postulaciones.

Paso 3 — Confirmación
El postulante revisará toda la información cargada y confirmará los datos.
Posteriormente será redirigido al Dashboard Principal.

Dashboard del Postulante

Desde el dashboard el usuario podrá:

- Ver puestos disponibles.
- Consultar sus postulaciones.
- Ver el estado de cada proceso.
- Acceder a las evaluaciones que le hayan sido asignadas.
- Consultar resultados obtenidos.
- Actualizar su perfil profesional.

### Evaluaciones Asignadas

El postulante visualizará únicamente las evaluaciones asignadas por RRHH.

Cada evaluación mostrará:

- Nombre de la evaluación.
- Estado.
- Fecha asignada.
- Hora de inicio.
- Hora de finalización.
- Duración.
- Tiempo restante (cuando corresponda).

La evaluación únicamente podrá iniciarse dentro del horario habilitado por RRHH.

Panel de Recursos Humanos
RRHH contará con un panel administrativo donde podrá visualizar:
Postulante
Puesto
Score IA
Estado
Juan Pérez
Backend Java Jr
85%
Pendiente


Detalle del Postulante
Al seleccionar un postulante, RRHH podrá visualizar:
Datos personales.
Perfil profesional.
CV.
Historial de postulaciones.
Resultados de evaluaciones.
Análisis generado por IA.
Observaciones.
Ranking obtenido.

Decisión Inicial de RRHH
RRHH podrá seleccionar:
Cumple
o
No Cumple

Si NO cumple
SAFE:
Actualiza el estado.
Envía la información a n8n.
n8n envía automáticamente un correo electrónico informando que el candidato no continuará en el proceso.

Si cumple
Asignación de Evaluaciones

Cuando un postulante sea aprobado para continuar en el proceso de selección, el personal de RRHH podrá asignarle una o más evaluaciones.

Durante la asignación, RRHH deberá indicar:

- Evaluación.
- Fecha de realización.
- Hora de inicio.
- Hora de finalización.
- Observaciones (opcional).

Una vez asignada la evaluación:

- SAFE registrará la asignación.
- La evaluación aparecerá automáticamente en el Dashboard del postulante.
- SAFE enviará una notificación dentro del sistema.
- n8n enviará un correo electrónico indicando la fecha y el horario asignados.
- El postulante podrá consultar la información antes del día programado.

Cada evaluación podrá asignarse a distintos postulantes en fechas y horarios diferentes.



Gestión de Evaluaciones (RRHH)
RRHH podrá administrar evaluaciones mediante un CRUD completo.
Funciones
Crear evaluación.
Editar evaluación.
Eliminar evaluación.
Listar evaluaciones.
Cada evaluación tendrá:
Nombre.
Descripción.
Duración.
Puntaje mínimo.
Estado.

Gestión de Preguntas
Cada evaluación podrá contener múltiples preguntas.
RRHH podrá:
Crear preguntas.
Editar preguntas.
Eliminar preguntas.
Visualizar preguntas asociadas.
Cada pregunta almacenará:
Enunciado.
Respuesta correcta o respuesta esperada.
Peso de la pregunta.
Ejemplo:
Pregunta:
¿Qué haría ante una situación de incendio?
Respuesta correcta:
Activar el protocolo de emergencia y evacuar siguiendo las normas de seguridad.
Peso:
10 puntos

Realización de Evaluaciones
Cuando un postulante avance a la etapa de evaluación:
En su dashboard aparecerá una nueva sección:
Evaluaciones Pendientes
Ejemplo:
Evaluación
Estado
Test Java
Pendiente
Test Inglés
Pendiente


Corrección Inteligente mediante IA
Una vez finalizada la evaluación:
SAFE enviará las respuestas a n8n.
n8n utilizará IA para comparar:
Pregunta.
Respuesta correcta definida por RRHH.
Respuesta del postulante.

Funcionamiento de la Corrección
La IA NO tomará decisiones de contratación.
La IA únicamente:
Analizará similitud semántica.
Asignará puntajes.
Generará observaciones.
Ayudará a RRHH en la evaluación.

Ejemplo
Respuesta Correcta:
Activar el protocolo de emergencia y evacuar.
Respuesta Postulante:
Avisar inmediatamente la emergencia y seguir el protocolo de evacuación.
Resultado IA:
Puntaje: 90
Justificación:
La respuesta coincide con las acciones esperadas y demuestra comprensión del procedimiento.

Cálculo de Resultados
SAFE calculará automáticamente:
Puntaje por pregunta.
Puntaje ponderado según el peso.
Puntaje total.
Estado final.
Resultado:
Aprobado
o
Desaprobado

Ranking de Postulantes
SAFE generará automáticamente un ranking de candidatos basado en:
Resultados de evaluaciones.
Puntaje total.
Compatibilidad con el puesto.
Ejemplo:
Posición
Postulante
Puntaje
1
Juan Pérez
95
2
María López
89
3
Pedro Gómez
84


Visualización de Resultados para RRHH
Al seleccionar un postulante RRHH podrá ver:
CV.
Perfil.
Evaluaciones realizadas.
Respuestas enviadas.
Respuestas correctas.
Puntajes por pregunta.
Justificaciones generadas por IA.
Resultado final.

Automatización de Desaprobados
Si el postulante no alcanza el puntaje mínimo:
SAFE podrá:
Marcarlo como desaprobado.
Informar a n8n.
Enviar automáticamente un correo electrónico notificando el resultado.

Entrevistas
Los candidatos aprobados podrán avanzar a:
Entrevista RRHH.
Entrevista técnica.
Contratación.
La decisión final siempre será tomada por RRHH.

Rol de la Inteligencia Artificial
La IA actuará como asistente del proceso de selección.
Su función será:
Analizar CV.
Calcular compatibilidad.
Corregir evaluaciones.
Generar observaciones.
Ayudar en la generación de rankings.
La IA nunca decidirá quién será contratado.
La decisión final será responsabilidad exclusiva de RRHH.

Tecnologías del Proyecto
Frontend
React
Next.js
TypeScript
Tailwind CSS
Backend
Spring Boot
Java
JWT Authentication
REST API
Base de Datos
MySQL
Automatización
n8n
Inteligencia Artificial
Análisis de CV.
Scoring de compatibilidad.
Corrección de evaluaciones.
Generación de observaciones.
Asistencia en ranking de candidatos.

Objetivo Final
SAFE busca transformar el proceso tradicional de reclutamiento mediante la automatización inteligente, permitiendo:
Reducir tiempos de selección.
Mejorar el filtrado de candidatos.
Automatizar tareas repetitivas.
Optimizar evaluaciones.
Generar información útil para RRHH.
Mantener siempre la decisión final en manos de las personas.
Con esto SAFE se posiciona como una plataforma integral de reclutamiento y selección asistida por Inteligencia Artificial y automatización.
