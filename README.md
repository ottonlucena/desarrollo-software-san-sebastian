# DentPlus MVC — Sistema de Gestión de Afiliados

Sistema web para la clínica dental **DentPlus**, construido con arquitectura **MVC** (Model–View–Controller) sobre Node.js, TypeScript, Express, Handlebars y Prisma ORM con PostgreSQL.

El proyecto evolucionó desde un CRUD básico hasta una aplicación lista para producción incorporando: validaciones con Zod, autenticación con sesiones HTTP, hash de contraseñas con bcryptjs, aislamiento de datos por usuario, migración a PostgreSQL y containerización con Docker Compose.

---

## Autores

| Nombre        | Rol            |
| ------------- | -------------- |
| Otton Lucena  | Desarrollador  |
| Valeria Gomez | Desarrolladora |

Proyecto desarrollado como parte de la Evaluación Unidad 3 — Desarrollo Web con arquitectura MVC.

---

## Stack tecnológico

| Capa             | Tecnología                 | Versión    |
| ---------------- | -------------------------- | ---------- |
| Servidor         | Node.js + Express          | 22.x / 4.x |
| Lenguaje         | TypeScript                 | 5.x        |
| Vistas           | express-handlebars         | 7.x        |
| ORM              | Prisma                     | 7.x        |
| Base de datos    | PostgreSQL                 | 16         |
| Validaciones     | Zod                        | 4.x        |
| Autenticación    | express-session + bcryptjs | —          |
| Containerización | Docker + Docker Compose    | —          |
| Estilos          | Bootstrap                  | 5.3 (CDN)  |

---

## Funcionalidades

- Registro, inicio de sesión y cierre de sesión seguros
- Cada usuario ve y gestiona **únicamente sus propios afiliados** — aislamiento total de datos
- CRUD completo de afiliados (crear, listar, ver detalle, editar, eliminar)
- Validaciones de formulario con mensajes de error inline y repoblado de campos tras error
- Simulador de descuentos por tipo de membresía
- Contraseñas almacenadas con hash bcrypt (10 rounds), nunca en texto plano
- Rutas protegidas: sin sesión activa se redirige automáticamente a `/login`

### Tipos de membresía

| Membresía | Descuento |
| --------- | --------- |
| Silver    | 5 %       |
| Gold      | 10 %      |
| Platinum  | 20 %      |

---

## Variables de entorno

Copia `.env.example` a `.env` antes de ejecutar:

```bash
cp .env.example .env
```

| Variable         | Descripción                          | Valor por defecto (ejemplo)                                 |
| ---------------- | ------------------------------------ | ----------------------------------------------------------- |
| `DATABASE_URL`   | URL de conexión PostgreSQL           | `postgresql://postgres:postgres@localhost:5432/dentplus_db` |
| `SESSION_SECRET` | Clave secreta para las sesiones HTTP | `dev-secret`                                                |

> **Nunca subas `.env` al repositorio.** Está incluido en `.gitignore`.

---

## Levantar el proyecto con Docker _(recomendado)_

Requiere **Docker Desktop** o **Docker Engine + Compose v2** instalados.

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd mvc-express-handlebars-web-1

# 2. Levantar PostgreSQL + aplicación con un solo comando
docker compose up --build
```

Docker Compose realiza automáticamente:

1. Levanta PostgreSQL 16 y espera a que esté listo (healthcheck integrado)
2. Construye la imagen de la aplicación (multi-stage build)
3. Ejecuta las migraciones de base de datos (`prisma migrate deploy`)
4. Carga los datos de prueba (`yarn seed`)
5. Inicia el servidor en el puerto **3000**

Abre en el navegador: **http://localhost:3000**

**Credenciales de prueba:**

```
Email:      demo@dentplus.cl
Contraseña: 12345678
```

### Comandos Docker útiles

```bash
# Ver logs en tiempo real
docker compose logs app -f

# Detener los contenedores (datos se conservan)
docker compose down

# Detener y eliminar la base de datos (datos se pierden)
docker compose down -v

# Reconstruir la imagen tras cambios en el código
docker compose up --build
```

---

## Levantar el proyecto sin Docker (desarrollo local)

Requiere **Node.js 22+**, **Yarn** y una instancia de **PostgreSQL 16** corriendo localmente.

### 1. Instalar dependencias

```bash
yarn install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tu configuración local de PostgreSQL:

```
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/dentplus_db"
SESSION_SECRET="mi-clave-secreta-local"
```

### 3. Crear la base de datos en PostgreSQL

```bash
psql -U postgres -c "CREATE DATABASE dentplus_db;"
```

### 4. Ejecutar las migraciones

```bash
npx prisma migrate deploy
```

### 5. Cargar datos de prueba

```bash
yarn seed
```

### 6. Iniciar el servidor

```bash
yarn dev
```

Abre en el navegador: **http://localhost:3000**

### Scripts disponibles

| Script       | Función                                     |
| ------------ | ------------------------------------------- |
| `yarn dev`   | Inicia el servidor en modo desarrollo       |
| `yarn build` | Compila TypeScript a JavaScript             |
| `yarn start` | Ejecuta la versión compilada                |
| `yarn seed`  | Inserta datos de prueba en la base de datos |

---

## Arquitectura MVC

### Separación de capas

```
Request HTTP
     │
     ▼
 [Router]              ← Define URLs y las conecta con controllers
     │
     ▼
 [Controller]          ← Recibe el request, valida con Zod, llama al Model
     │
     ▼
 [Model]               ← Accede a datos a través de Prisma ORM
     │
     ▼
 [Controller]          ← Recibe los datos y los pasa a la vista
     │
     ▼
 [View (Handlebars)]   ← Renderiza el HTML y lo envía al navegador
```

### Responsabilidad de cada capa

**Model** (`src/models/`) — Solo habla con Prisma. No conoce `req` ni `res`. No aplica lógica de negocio como hashing. Recibe y devuelve datos.

**Controller** (`src/controllers/`) — Coordina el flujo: valida con Zod, aplica lógica de negocio (hash, sesión), llama al modelo y decide qué vista renderizar.

**View** (`views/`) — Solo presenta datos. No realiza cálculos ni lógica.

**Router** (`src/routes/`) — Mapea URLs a controllers. No contiene lógica.

**Middleware** (`src/middleware/`) — `requireAuth` protege rutas privadas antes de que lleguen al controller.

---

## Estructura del proyecto

```
mvc-express-handlebars-web-1/
├── prisma/
│   ├── schema.prisma          # Modelos de datos (User, Affiliate)
│   ├── migrations/            # Historial de migraciones SQL
│   └── seed.ts                # Datos de prueba
│
├── src/
│   ├── controllers/
│   │   ├── affiliate.controller.ts   # CRUD de afiliados + simulador
│   │   └── auth.controller.ts        # Registro, login, logout
│   ├── models/
│   │   ├── affiliate.model.ts        # Acceso a datos de afiliados
│   │   └── user.model.ts             # Acceso a datos de usuarios
│   ├── routes/
│   │   ├── affiliate.routes.ts       # Rutas /affiliates
│   │   └── auth.routes.ts            # Rutas /login, /register, /logout
│   ├── schemas/
│   │   ├── affiliate.schemas.ts      # Validación Zod de afiliados
│   │   └── auth.schemas.ts           # Validación Zod de autenticación
│   ├── middleware/
│   │   └── requireAuth.ts            # Guarda de rutas privadas
│   ├── lib/
│   │   ├── prisma.ts                 # Cliente Prisma singleton
│   │   └── parseError.ts             # Formateador de errores Zod
│   ├── types/
│   │   └── session.d.ts              # Extensión de tipos de express-session
│   ├── app.ts                        # Configuración de Express
│   └── index.ts                      # Punto de entrada del servidor
│
├── views/
│   ├── layouts/main.hbs              # Layout principal con Bootstrap
│   ├── affiliates/
│   │   ├── index.hbs                 # Listado de afiliados
│   │   ├── show.hbs                  # Detalle + simulador
│   │   ├── create.hbs                # Formulario de creación
│   │   └── edit.hbs                  # Formulario de edición
│   ├── auth/
│   │   ├── login.hbs                 # Formulario de login
│   │   └── register.hbs              # Formulario de registro
│   ├── home.hbs
│   └── 404.hbs
│
├── Dockerfile                        # Imagen multi-stage de la app
├── docker-compose.yml                # Orquesta PostgreSQL + app
├── .dockerignore
├── .env.example                      # Variables de entorno documentadas
├── .gitignore
├── package.json
├── tsconfig.json
├── tsdown.config.ts
└── prisma.config.ts
```

---

## Decisión de arquitectura: bcrypt en el controller, no en el model

El hash de contraseñas con bcrypt se realiza en `auth.controller.ts` y **no** dentro de `user.model.ts`. Esta decisión respeta la separación de responsabilidades de MVC:

**El modelo** tiene una única responsabilidad: **persistir y consultar datos**. Recibe la contraseña ya hasheada y la guarda. No le importa qué algoritmo se usó ni cómo se procesó el dato.

**El controller** aplica la **lógica de negocio**: valida los datos de entrada con Zod, decide que se debe usar bcrypt con 10 rounds de costo y pasa el resultado procesado al modelo.

```typescript
// ✅ Controller — aplica lógica de negocio antes de llamar al modelo
const passwordHash = await bcrypt.hash(result.data.password, 10);
const user = await UserModel.create({ email, password: passwordHash });

// ✅ Model — solo habla con Prisma, sin conocer bcrypt
export const create = (data: { email: string; password: string }) =>
  prisma.user.create({ data });
```

Esta separación permite:

- **Testear el modelo** sin depender de bcrypt
- **Cambiar el algoritmo** (por ejemplo a argon2) tocando solo el controller, sin modificar el modelo ni la base de datos
- Mantener el modelo **limpio y predecible**

---

## Migración a PostgreSQL

La migración desde SQLite a PostgreSQL no requirió cambios en modelos, controllers, rutas ni vistas. Solo cambiaron archivos de infraestructura:

| Archivo                | Cambio                                           |
| ---------------------- | ------------------------------------------------ |
| `prisma/schema.prisma` | `provider: "postgresql"`                         |
| `src/lib/prisma.ts`    | Adaptador `PrismaPg` (driver nativo)             |
| `prisma.config.ts`     | Fuente de datos apunta a PostgreSQL              |
| `.env`                 | `DATABASE_URL` con cadena de conexión PostgreSQL |

Esto demuestra que la arquitectura MVC estaba correctamente separada: Prisma actúa como capa de abstracción que aísla la lógica de negocio del motor de base de datos. El cambio de motor fue transparente para toda la lógica de la aplicación.

---

## Uso de Inteligencia Artificial

Durante el desarrollo de este proyecto se utilizó **Claude (Anthropic)** como asistente de programación. A continuación se documentan los prompts utilizados y qué se aprendió de cada uno.

### Prompts utilizados

**Prompt 1 — Configuración de Zod con express-session en TypeScript:**

```
Tengo un proyecto Express con TypeScript y quiero agregar validaciones con Zod
a mis formularios. Necesito que cuando falle la validación, la vista muestre
los errores inline junto a cada campo y que el formulario se repueble con los
valores que el usuario ingresó. ¿Cómo implemento safeParse en el controller
y qué le paso a la vista?
```

_Aprendido: la diferencia entre `parse` (lanza excepción) y `safeParse` (devuelve objeto con `success`). El patrón de pasar `{ errors, values }` a la vista para repoblar campos. El uso de `error.issues` (no `error.errors`) para iterar los errores de Zod._

---

**Prompt 2 — Extensión de tipos de express-session en TypeScript:**

```
Usando express-session con TypeScript, cuando intento acceder a
req.session.userId TypeScript me dice que esa propiedad no existe.
¿Cómo extiendo la interfaz SessionData para que TypeScript reconozca
mis propiedades personalizadas?
```

_Aprendido: el patrón de declaration merging con `declare module 'express-session'` en un archivo `.d.ts`. Por qué es necesario este archivo y cómo `tsconfig.json` debe incluirlo con `types`._

---

**Prompt 3 — Docker Compose con healthcheck para PostgreSQL:**

```
En mi docker-compose.yml la app arranca antes que PostgreSQL esté listo y
da error de conexión. ¿Cómo configuro el healthcheck de PostgreSQL y hago
que la app espere a que esté disponible antes de iniciar?
```

_Aprendido: la diferencia entre `depends_on` simple y `depends_on: condition: service_healthy`. Cómo `pg_isready` funciona como comando de healthcheck. Por qué sin esto la app falla con `ECONNREFUSED`._

---

**Prompt 4 — README profesional para evaluación académica:**

```
Tengo un proyecto Node.js con Express, TypeScript, Prisma, PostgreSQL, Zod,
bcryptjs, express-session y Docker. El proyecto es una evaluación académica
que evalúa: validaciones con Zod, autenticación con sesiones, migración a
PostgreSQL y Docker. Los autores son Otton Lucena y Valeria Gomez.

Genera un README.md profesional que incluya:
- Instrucciones detalladas para levantar el proyecto con y sin Docker
- Tabla de variables de entorno documentadas
- Explicación de la arquitectura MVC
- Decisión de arquitectura sobre por qué bcrypt va en el controller y no en el model
- Sección de migración a PostgreSQL explicando por qué los modelos no cambiaron
- Esta misma sección de uso de IA con los prompts reales usados durante el desarrollo
```

_Aprendido: cómo estructurar documentación técnica de forma que sea útil tanto para un evaluador académico como para un desarrollador que quiera levantar el proyecto en su máquina._

---
