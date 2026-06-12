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
Instituto Profesional San Sebastián — IF202INF Introducción Cloud.

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

### Tipos de membresía y descuentos

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

| Variable         | Descripción                          | Ejemplo                                                     |
| ---------------- | ------------------------------------ | ----------------------------------------------------------- |
| `DATABASE_URL`   | URL de conexión PostgreSQL           | `postgresql://postgres:postgres@localhost:5432/dentplus_db` |
| `SESSION_SECRET` | Clave secreta para las sesiones HTTP | `mi-clave-secreta-local`                                    |

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

1. Levanta PostgreSQL 16 y espera a que esté completamente listo (healthcheck con `pg_isready`)
2. Construye la imagen de la aplicación (multi-stage build en 3 etapas)
3. Ejecuta las migraciones de base de datos (`prisma migrate deploy`)
4. Carga los datos de prueba (`yarn seed`)
5. Inicia el servidor en el puerto **3000**

Abre en el navegador: **http://localhost:3000**

**Credenciales de prueba:**

```
Email:      demo@dentplus.cl
Contraseña: 12345678
```

### Salida esperada

Si todo funciona correctamente, los últimos logs del servicio `app` deben verse así:

```
dentplus-app  | Prisma schema loaded from prisma/schema.prisma
dentplus-app  | Datasource "db": PostgreSQL database "dentplus_db", schema "public" at "db:5432"
dentplus-app  | 1 migration found in prisma/migrations
dentplus-app  | Applying migration `20260527040225_init_postgresql`
dentplus-app  | All migrations have been successfully applied.
dentplus-app  | $ ts-node prisma/seed.ts
dentplus-app  | Seeding database...
dentplus-app  | Inserted 1 user.
dentplus-app  | Inserted 3 affiliates.
dentplus-app  | Demo user: demo@dentplus.cl / 12345678
dentplus-app  | Server running at http://localhost:3000
```

> **Nota:** puede aparecer un warning `MODULE_TYPELESS_PACKAGE_JSON` de Node al ejecutar el seed con `ts-node`. Es informativo, no detiene la aplicación — indica que `package.json` no declara `"type"` explícitamente. No afecta el funcionamiento del proyecto.
>
> También puede aparecer el warning de `MemoryStore` de `express-session`. Es esperado en este entorno académico (ver sección **Auth y sesiones**) y no impide el funcionamiento de la app.

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
# Editar .env con tu configuración local
```

```
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/dentplus_db"
SESSION_SECRET="mi-clave-secreta-local"
```

### 3. Crear la base de datos

```bash
psql -U postgres -c "CREATE DATABASE dentplus_db;"
```

### 4. Ejecutar migraciones

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

## Dockerización

La aplicación fue completamente dockerizada usando dos archivos: `Dockerfile` y `docker-compose.yml`.

### Dockerfile — Multi-Stage Build

El Dockerfile está dividido en **3 etapas** para producir una imagen final pequeña y segura:

```
Etapa 1 (deps)    → instala todas las dependencias con yarn
Etapa 2 (build)   → compila TypeScript + genera Prisma Client
Etapa 3 (runner)  → imagen final, solo copia lo necesario para correr
```

Esta estrategia tiene tres ventajas concretas:

- La imagen final no incluye herramientas de compilación ni dependencias de desarrollo
- Menor tamaño de imagen = menos tiempo de descarga en producción
- Menor superficie de ataque al no exponer código fuente TypeScript

Las `views/` se copian explícitamente porque Handlebars las lee en tiempo de ejecución, no en compilación. Sin ese `COPY` el servidor arrancaría pero no encontraría ninguna plantilla.

### Docker Compose — Orquestación de servicios

`docker-compose.yml` levanta dos servicios: `db` (PostgreSQL) y `app` (DentPlus).

El punto crítico es el **healthcheck**:

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres"]
  interval: 5s
  timeout: 5s
  retries: 5
```

`pg_isready` es el comando oficial de PostgreSQL para verificar si el servidor está listo para aceptar conexiones. Sin este healthcheck, `docker compose up` levanta ambos servicios en paralelo y la app intenta conectarse a PostgreSQL antes de que esté listo, resultando en `ECONNREFUSED`.

La app espera el resultado del healthcheck:

```yaml
depends_on:
  db:
    condition: service_healthy
```

`condition: service_healthy` es distinto de `depends_on` simple: no solo espera que el contenedor esté corriendo, sino que el healthcheck haya pasado. Es la diferencia entre "el proceso de PostgreSQL inició" y "PostgreSQL está listo para aceptar conexiones".

### .dockerignore

Excluye de la imagen: `node_modules`, `dist`, `.env`, `dev.db` y `.git`. Esto evita incluir secretos en la imagen y reduce el contexto de build enviado a Docker.

---

## Arquitectura MVC — Estructura y separación de capas

### El flujo completo de una petición

```
Navegador
    │  HTTP Request
    ▼
[Router]          ← Mapea la URL al controller correcto. Sin lógica.
    │
    ▼
[Middleware]      ← requireAuth verifica sesión activa. Redirige si no hay.
    │
    ▼
[Controller]      ← Valida con Zod, aplica bcrypt, llama al Model.
    │
    ▼
[Model]           ← Solo habla con Prisma. No conoce req, res ni HTTP.
    │
    ▼
[Controller]      ← Recibe datos del Model. Decide qué vista renderizar.
    │
    ▼
[View]            ← Renderiza HTML con los datos recibidos. Sin lógica.
    │  HTTP Response
    ▼
Navegador
```

### Responsabilidad de cada capa

**Model** (`src/models/`) — Única responsabilidad: persistir y consultar datos a través de Prisma. No importa `req` ni `res`. No aplica bcrypt. No conoce HTTP. Puede testearse sin Express.

**Controller** (`src/controllers/`) — Coordina el flujo: valida con Zod, aplica lógica de negocio (hash de contraseña, lectura de sesión), llama al Model y decide qué vista renderizar o a dónde redirigir.

**View** (`views/`) — Solo presenta datos enviados por el Controller. No realiza cálculos ni toma decisiones.

**Router** (`src/routes/`) — Mapea URLs a funciones del Controller. Sin lógica de negocio.

**Middleware** (`src/middleware/requireAuth.ts`) — Se ejecuta antes del Controller en rutas protegidas. Si `req.session.userId` no existe, redirige a `/login` antes de que el Controller llegue a ejecutarse.

### ¿Qué pasaría si se mezclaran las capas?

Un ejemplo de lo que **no** se hizo:

```typescript
// ❌ MAL — Model usando Express directamente
export const create = async (req: Request) => {
  const userId = req.session.userId; // el Model conoce HTTP → acoplamiento
  const hash = await bcrypt.hash(req.body.password, 10); // lógica de negocio en el Model
  return prisma.user.create({ data: { ...req.body, password: hash } });
};
```

Problemas de este enfoque:

- El Model queda acoplado a Express: no puede usarse en otro contexto (CLI, tests, API REST)
- Para testear el Model habría que simular un objeto `req` completo
- Cambiar de bcrypt a argon2 requeriría modificar el Model
- Se pierde la separación que hace MVC predecible y mantenible

Lo que **sí** se hizo:

```typescript
// ✅ BIEN — Controller aplica lógica, Model solo persiste
// auth.controller.ts
const passwordHash = await bcrypt.hash(result.data.password, 10);
const user = await UserModel.create({ email, password: passwordHash });

// user.model.ts
export const create = (data: { email: string; password: string }) =>
  prisma.user.create({ data });
```

---

## Decisiones de stack tecnológico

### Node.js + Express

Node.js permite usar JavaScript tanto en frontend como backend. Express fue elegido por ser liviano y explícito: no impone una estructura, lo que obliga a implementar MVC de forma consciente y facilita entender cada capa.

**Alternativas consideradas:**

- **NestJS**: arquitectura más estructurada con decoradores e inyección de dependencias, pero agrega complejidad significativa que no era necesaria para los objetivos de esta evaluación.
- **Fastify**: mayor rendimiento en benchmarks, pero Express tiene mayor adopción y documentación para entornos educativos.

### TypeScript

Agrega tipado estático sobre JavaScript. En este proyecto fue especialmente útil para:

- Detectar en tiempo de compilación que `req.session.userId` podía ser `undefined`
- Tipar los datos validados por Zod con `z.infer<typeof schema>`
- Evitar errores al pasar datos entre Controller y Model

### Handlebars (express-handlebars)

Permite renderizar vistas del lado servidor siguiendo MVC tradicional. Las vistas son archivos `.hbs` que reciben datos del Controller y generan HTML — sin JavaScript en el cliente.

**Alternativas descartadas:** React, Vue y Angular están orientados a SPA (Single Page Applications) y no correspondían a una evaluación centrada en MVC servidor.

### Prisma ORM

Proporciona una capa de abstracción tipada sobre la base de datos. El beneficio más concreto de este proyecto: **migrar de SQLite a PostgreSQL no requirió cambiar ningún Model, Controller, Router ni Vista**. Solo cambiaron archivos de configuración.

### PostgreSQL vs SQLite

| Característica        | SQLite               | PostgreSQL            |
| --------------------- | -------------------- | --------------------- |
| Almacenamiento        | Archivo local `.db`  | Servidor dedicado     |
| Escritura concurrente | Un escritor a la vez | Múltiples simultáneos |
| Escalabilidad         | Baja                 | Alta                  |
| Uso recomendado       | Desarrollo/prototipo | Producción            |

SQLite fue suficiente en la Unidad 2. Para producción con múltiples usuarios simultáneos, PostgreSQL es el estándar.

### bcryptjs vs otros algoritmos de hash

| Algoritmo | Velocidad    | Salt automático | Recomendado para contraseñas       |
| --------- | ------------ | --------------- | ---------------------------------- |
| MD5       | ~10B hash/s  | ❌ No           | ❌ Nunca — roto criptográficamente |
| SHA-256   | ~4B hash/s   | ❌ No           | ❌ No — demasiado rápido           |
| bcrypt    | ~20K hash/s  | ✅ Sí           | ✅ Estándar comprobado             |
| argon2id  | Configurable | ✅ Sí           | ✅ Estado del arte (PHC 2015)      |

MD5 y SHA son rápidos por diseño — sirven para checksums de archivos. Esa velocidad es un problema para contraseñas: un atacante con GPU moderna puede probar miles de millones de combinaciones por segundo contra hashes MD5. bcrypt es deliberadamente lento (configurable con `rounds`) y genera un salt único por contraseña automáticamente. Se eligió bcryptjs sobre argon2 por su madurez y por no requerir dependencias nativas (compila sin problemas en Alpine Linux/Docker).

---

## Autenticación y sesiones

### Flujo completo de autenticación

```
POST /login
  → loginSchema.safeParse(req.body)         [Zod valida email y password]
  → si errores: render('auth/login', { errors, values })
  → UserModel.findByEmail(email)             [busca usuario en BD]
  → bcrypt.compare(password, user.password) [compara sin desencriptar]
  → si falla: render con "Correo o contraseña incorrectos"
  → req.session.userId = user.id            [establece identidad]
  → redirect('/affiliates')
```

### ¿Por qué userId nunca viene del formulario?

El `userId` se obtiene **exclusivamente** desde `req.session.userId`, nunca desde `req.body`. La razón es simple: un campo `<input type="hidden" name="userId" value="1">` puede ser modificado por cualquier persona con las herramientas de desarrollo del navegador. Si el Controller leyera `userId` del formulario, un usuario podría cambiar el valor a `2` y ver o modificar los afiliados de otra cuenta.

```typescript
// ❌ NUNCA — manipulable desde el navegador
const userId = req.body.userId;

// ✅ SIEMPRE — viene del servidor, no del cliente
const userId = req.session.userId!;
```

El middleware `requireAuth` garantiza que `userId` existe antes de que cualquier Controller de afiliados se ejecute, por eso el `!` (non-null assertion) es seguro.

### Cómo funciona bcrypt.compare

bcrypt no "desencripta" — la operación es unidireccional. Cuando se verifica un login:

```typescript
await bcrypt.compare("password123", "$2b$10$KIXx...");
```

bcrypt extrae el **salt** y el **cost factor** del propio hash (están embebidos en el string), vuelve a hashear la contraseña ingresada con esos mismos parámetros, y compara el resultado. Si coincide, la contraseña es correcta. Nunca se obtiene el texto original.

### express-session y MemoryStore

`express-session` mantiene al usuario autenticado entre requests usando cookies. Por defecto guarda las sesiones en **MemoryStore** (RAM del proceso).

**Limitaciones del MemoryStore:**

- Las sesiones se pierden al reiniciar el servidor
- No escala a múltiples instancias del servidor
- No apto para producción real

Express mismo lo advierte al arrancar:

```
Warning: connect.session() MemoryStore is not
designed for a production environment
```

**En producción real** se reemplazaría por un store persistente:

| Store               | Tecnología | Cuándo usarlo               |
| ------------------- | ---------- | --------------------------- |
| `connect-pg-simple` | PostgreSQL | Cuando ya se usa PostgreSQL |
| `connect-redis`     | Redis      | Alta escala, baja latencia  |
| `connect-mongo`     | MongoDB    | Cuando ya se usa MongoDB    |

Para esta evaluación, MemoryStore es aceptable porque el objetivo es demostrar el mecanismo de autenticación, no la persistencia de sesiones en producción.

---

## Migración a PostgreSQL — Docker y qué cambió

### Lo que cambió al migrar de SQLite a PostgreSQL

| Archivo                | Cambio realizado                                       | ¿Por qué cambió?                 |
| ---------------------- | ------------------------------------------------------ | -------------------------------- |
| `prisma/schema.prisma` | `provider: "postgresql"`                               | Indicar el motor a Prisma        |
| `src/lib/prisma.ts`    | Adaptador `PrismaPg` en lugar de libSQL                | Driver nativo para PostgreSQL    |
| `prisma.config.ts`     | `datasource.url` apunta a `DATABASE_URL` de PostgreSQL | Fuente de datos para migraciones |
| `.env`                 | `DATABASE_URL` con cadena de conexión PostgreSQL       | Variable de entorno actualizada  |

### Lo que **no** cambió

```
src/models/affiliate.model.ts   → sin cambios ✅
src/models/user.model.ts        → sin cambios ✅
src/controllers/*.ts            → sin cambios ✅
src/routes/*.ts                 → sin cambios ✅
views/**/*.hbs                  → sin cambios ✅
```

Esto demuestra que la arquitectura MVC estaba correctamente separada. Prisma actúa como capa de abstracción: los modelos hacen `prisma.affiliate.findMany()` sin saber si detrás hay SQLite o PostgreSQL. Cambiar el motor es una decisión de infraestructura que no debería tocar la lógica de negocio, y no la tocó.

### depends_on con healthcheck vs depends_on simple

```yaml
# ❌ depends_on simple — solo espera que el contenedor INICIE
depends_on:
  - db

# ✅ depends_on con condition — espera que PostgreSQL esté LISTO
depends_on:
  db:
    condition: service_healthy
```

La diferencia es importante: un contenedor de PostgreSQL puede estar "corriendo" (proceso iniciado) pero aún inicializando la base de datos. Sin `service_healthy`, la app intentaría conectarse durante esa ventana y fallaría con `ECONNREFUSED`. El healthcheck con `pg_isready` resuelve esto.

---

## Estructura del proyecto

```
mvc-express-handlebars-web-1/
├── prisma/
│   ├── schema.prisma          # Modelos de datos: User, Affiliate
│   ├── migrations/            # Historial de migraciones SQL
│   └── seed.ts                # Datos de prueba
│
├── src/
│   ├── controllers/
│   │   ├── affiliate.controller.ts   # CRUD de afiliados + simulador de descuento
│   │   └── auth.controller.ts        # Registro, login, logout + bcrypt
│   ├── models/
│   │   ├── affiliate.model.ts        # Acceso a datos de afiliados (solo Prisma)
│   │   └── user.model.ts             # Acceso a datos de usuarios (solo Prisma)
│   ├── routes/
│   │   ├── affiliate.routes.ts       # Rutas /affiliates
│   │   └── auth.routes.ts            # Rutas /login, /register, /logout
│   ├── schemas/
│   │   ├── affiliate.schemas.ts      # Validación Zod de afiliados
│   │   └── auth.schemas.ts           # Validación Zod de login y registro
│   ├── middleware/
│   │   └── requireAuth.ts            # Guarda de rutas privadas
│   ├── lib/
│   │   ├── prisma.ts                 # Cliente Prisma singleton con adaptador PrismaPg
│   │   └── parseError.ts             # Convierte ZodError a { campo: mensaje }
│   ├── types/
│   │   └── session.d.ts              # Extiende SessionData con userId?: number
│   ├── app.ts                        # Configuración Express, middlewares, rutas
│   └── index.ts                      # Punto de entrada — app.listen()
│
├── views/
│   ├── layouts/main.hbs              # Layout principal con Bootstrap 5
│   ├── affiliates/
│   │   ├── index.hbs                 # Listado de afiliados del usuario
│   │   ├── show.hbs                  # Detalle + simulador de descuento
│   │   ├── create.hbs                # Formulario con validación inline
│   │   └── edit.hbs                  # Formulario con repoblado de values
│   ├── auth/
│   │   ├── login.hbs                 # Formulario de inicio de sesión
│   │   └── register.hbs              # Formulario de registro
│   ├── home.hbs
│   └── 404.hbs
│
├── Dockerfile                        # Multi-stage: deps → build → runner
├── docker-compose.yml                # Servicios: db (PostgreSQL) + app
├── .dockerignore                     # Excluye node_modules, .env, dev.db
├── .env.example                      # Variables de entorno documentadas
├── .gitignore
├── package.json
├── tsconfig.json
├── tsdown.config.ts
└── prisma.config.ts                  # URL de BD para migraciones Prisma 7
```

---

## Uso de Inteligencia Artificial

Durante el desarrollo de este proyecto se utilizó **Claude (Anthropic)** como asistente de programación. A continuación se documentan los prompts utilizados y qué se aprendió de cada uno.

### Prompts utilizados

**Prompt 1 — Validaciones con Zod y repoblado de formularios:**

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

_Aprendido: el patrón de declaration merging con `declare module 'express-session'` en un archivo `.d.ts`. Por qué es necesario y cómo tsconfig.json debe incluirlo._

---

**Prompt 3 — Docker Compose con healthcheck para PostgreSQL:**

```
En mi docker-compose.yml la app arranca antes que PostgreSQL esté listo y
da error de conexión. ¿Cómo configuro el healthcheck de PostgreSQL y hago
que la app espere a que esté disponible antes de iniciar?
```

_Aprendido: la diferencia entre `depends_on` simple y `depends_on: condition: service_healthy`. Cómo `pg_isready` funciona como healthcheck. Por qué sin esto la app falla con `ECONNREFUSED`._

---

**Prompt 4 — Dockerfile multi-stage para Node.js con Prisma y Handlebars:**

```
Tengo una app Node.js con TypeScript, Prisma y Handlebars. Necesito un
Dockerfile multi-stage que compile TypeScript, genere el Prisma Client
y produzca una imagen final liviana. ¿Qué archivos debo copiar en la
etapa final y por qué las views deben copiarse explícitamente?
```

_Aprendido: por qué las vistas Handlebars no están en `dist/` y necesitan copiarse aparte. La diferencia entre lo que `tsc` compila y lo que el servidor necesita en tiempo de ejecución._

---

**Prompt 5 — README profesional para evaluación académica:**

```
Tengo un proyecto Node.js con Express, TypeScript, Prisma 7, PostgreSQL,
Zod, bcryptjs, express-session y Docker. Es una evaluación académica con
rúbrica que evalúa 6 criterios: Dockerización (25pts), Decisión de
tecnologías (15pts), Estructura y MVC (15pts), Decisiones de stack (20pts),
Auth y sesiones (15pts), Docker y PostgreSQL (10pts). Los autores son
Otton Lucena y Valeria Gomez. Genera un README.md que cubra nota 7 en
cada criterio.
```

_Aprendido: cómo estructurar documentación técnica para que sea útil tanto para un evaluador académico como para un desarrollador que quiera levantar el proyecto. La importancia de explicar no solo el "qué" sino el "por qué" de cada decisión._

---

Todo el código fue revisado, comprendido y adaptado al contexto específico del proyecto DentPlus. Se entiende cada decisión implementada y se puede explicar en detalle durante el video y la defensa.
