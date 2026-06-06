# Flujo de Trabajo Configurado

El proyecto está estructurado bajo una arquitectura cliente-servidor, separando el frontend y backend dentro de un mismo repositorio. Esta organización permite un mejor mantenimiento, escalabilidad y trabajo colaborativo.

- **Frontend:** Next.js, React, TypeScript y TailwindCSS.
- **Backend:** FastAPI con Python.
- **Contenedores:** Docker y Docker Compose.

## Flujo de trabajo

- Desarrollo de funcionalidades en ramas independientes.
- Integración de cambios mediante Git.
- Validación y pruebas antes de fusionar cambios.
- Comunicación entre frontend y backend mediante APIs HTTP.


# Estrategia de Branching

Se implementó una estrategia basada en Git Flow.

## Ramas principales

### `main`
Contiene la versión estable del proyecto.

### `develop`
Rama principal de desarrollo donde se integran nuevas funcionalidades.

## Ramas de trabajo

### `feature/*`
Utilizadas para desarrollar nuevas funcionalidades.

Ejemplos:

ANIMO PROFESORITO GIO
```bash
feature/frontend-login
feature/backend-api
