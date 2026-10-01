# Arquitectura del Sistema SAFE

## Descripción General

SAFE (Sistema Inteligente de Reclutamiento y Selección) es una plataforma orientada a la gestión de postulantes, automatización de procesos de selección y apoyo a Recursos Humanos mediante inteligencia artificial y automatizaciones.

## Tecnologías Utilizadas

### Frontend

* React
* TypeScript
* HTML5
* CSS3

### Backend

* Java
* Spring Boot
* Spring Security
* JWT Authentication
* JPA / Hibernate

### Base de Datos

* MySQL

### Automatización

* n8n

### Inteligencia Artificial

* Análisis de CV
* Scoring de postulantes
* Corrección automática de evaluaciones
* Generación de observaciones y recomendaciones

---

## Arquitectura General

SAFE utiliza una arquitectura Cliente-Servidor basada en API REST.

Frontend (React)
↓
API REST (Spring Boot)
↓
MySQL
↓
n8n
↓
IA y Automatizaciones

---

## Arquitectura del Backend

El backend implementa una arquitectura en capas.

Controller
↓
Service
↓
Repository
↓
MySQL

### Controllers

Gestionan las solicitudes HTTP y respuestas de la API.

### Services

Contienen la lógica de negocio del sistema.

### Repositories

Gestionan el acceso a datos mediante JPA.

### DTOs

Permiten intercambiar información entre cliente y servidor sin exponer directamente las entidades.

### Entities

Representan las tablas de la base de datos.

---

## Funcionalidades Principales

* Registro de usuarios y postulantes.
* Gestión de perfiles laborales.
* Carga de CV.
* Postulación a puestos.
* Análisis automático mediante IA.
* Gestión de evaluaciones.
* Corrección automática de resultados.
* Gestión de entrevistas.
* Panel administrativo para RRHH.
* Envío automático de notificaciones y correos electrónicos.

---

## Convenciones del Proyecto

* Utilizar DTOs para requests y responses.
* No exponer entidades directamente.
* Toda lógica de negocio debe implementarse en Services.
* Los Controllers solo gestionan solicitudes HTTP.
* Los Repositories acceden exclusivamente a la base de datos.
* Utilizar ResponseEntity en todos los endpoints.
* Validar datos mediante Bean Validation.
