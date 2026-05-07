# DentPlus — MVC con Express + Handlebars + Prisma

Aplicación web interna para gestionar pacientes afiliados de la clínica dental DentPlus. Permite listar, ver detalle, crear, editar y eliminar afiliados. Además incluye un simulador de descuento según el tipo de afiliación del paciente.

## Stack

| Herramienta | Versión | Rol |
|-------------|---------|-----|
| Node.js | 22.x LTS | Entorno de ejecución |
| TypeScript | 5.x | Tipado estático |
| Express | 4.x | Framework HTTP |
| express-handlebars | 8.x | Motor de plantillas |
| Prisma ORM | 7.x | ORM para base de datos |
| SQLite | — | Base de datos local |
| nodemon | 3.x | Reinicio automático en desarrollo |
| ts-node | 10.x | Ejecución de TypeScript |
| tsdown | 0.9.x | Build para producción |

## Requisitos

- Node.js 22.x LTS
- Yarn clásico
- Git

Si no tienes Yarn:

```bash
npm install -g yarn
```

## Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd dentplus-mvc

# 2. Instalar dependencias
yarn install

# 3. Crear archivo de variables de entorno
cp .env.example .env

# 4. Crear la base de datos y migración
npx prisma migrate dev --name init

# 5. Cargar datos de ejemplo
yarn seed

# 6. Levantar servidor de desarrollo
yarn dev
```

Abrir en el navegador:

```bash
http://localhost:3000
```

## Funcionalidades

| Funcionalidad | Ruta |
|---------------|------|
| Listar afiliados | `GET /affiliates` |
| Ver detalle | `GET /affiliates/:id` |
| Crear afiliado | `GET /affiliates/create` y `POST /affiliates` |
| Editar afiliado | `GET /affiliates/:id/edit` y `POST /affiliates/:id/edit` |
| Eliminar afiliado | `POST /affiliates/:id/delete` |
| Simular descuento | `POST /affiliates/:id/simulate` |

## Modelo de datos

Cada afiliado tiene:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | número | Identificador único autogenerado |
| `firstName` | texto | Nombre |
| `lastName` | texto | Apellido |
| `email` | texto | Correo electrónico único |
| `membershipType` | texto | Tipo de afiliación: `silver`, `gold` o `platinum` |

## Descuentos

| Tipo | Descuento |
|------|-----------|
| Silver | 5% |
| Gold | 10% |
| Platinum | 20% |

El cálculo del descuento está implementado en el Model, no en la vista.

## Arquitectura MVC

```text
dentplus-mvc/
├── prisma/
│   ├── schema.prisma          # Modelo de datos Prisma
│   └── seed.ts                # Datos iniciales
├── src/
│   ├── index.ts               # Punto de entrada del servidor
│   ├── app.ts                 # Configuración de Express y Handlebars
│   ├── controllers/
│   │   └── affiliate.controller.ts
│   ├── models/
│   │   └── affiliate.model.ts
│   ├── routes/
│   │   └── affiliate.routes.ts
│   ├── lib/
│   │   └── prisma.ts          # Cliente Prisma
│   └── generated/prisma/      # Cliente generado por Prisma
├── views/
│   ├── layouts/
│   │   └── main.hbs
│   ├── affiliates/
│   │   ├── index.hbs
│   │   ├── show.hbs
│   │   ├── create.hbs
│   │   └── edit.hbs
│   ├── home.hbs
│   └── 404.hbs
└── package.json
```

### Separación de responsabilidades

- **Model:** accede a la base de datos usando Prisma y contiene la lógica del descuento.
- **Controller:** recibe la petición HTTP, llama al Model, renderiza vistas o redirige.
- **Router:** define las rutas y conecta cada ruta con su Controller.
- **View:** muestra formularios, tablas y resultados usando Handlebars.

## Comandos útiles

```bash
yarn dev      # Modo desarrollo
yarn build    # Compilar proyecto
yarn start    # Ejecutar compilado
yarn seed     # Cargar datos de ejemplo
```

## Commits sugeridos

```bash
git add .
git commit -m "chore: adapt base project to DentPlus"

git add prisma src/models/affiliate.model.ts
git commit -m "feat: add affiliate model with Prisma"

git add src/controllers src/routes
git commit -m "feat: add affiliate CRUD controller and routes"

git add views
git commit -m "feat: add affiliate views and discount simulator"

git add README.md
git commit -m "docs: add setup instructions"
```
