# DentPlus MVC — Sistema de gestión de afiliados con Express + Handlebars + Prisma

Aplicación web CRUD para gestión de pacientes afiliados de una clínica dental, construida utilizando arquitectura MVC (Model - View - Controller).

El sistema permite registrar, consultar, editar y eliminar afiliados, además de simular descuentos según el tipo de afiliación del paciente.

Este proyecto fue desarrollado como parte de una evaluación académica enfocada en arquitectura MVC, separación de capas y desarrollo backend con Node.js + TypeScript.

---

# Objetivo del proyecto

La clínica dental **DentPlus** actualmente administra sus afiliados usando planillas Excel, lo que provoca problemas como:

- duplicidad de información;
- errores manuales;
- dificultad para mantener registros;
- pérdida de datos.

El objetivo de esta aplicación es modernizar ese proceso mediante un sistema web interno que permita:

- gestionar afiliados;
- consultar información;
- calcular descuentos automáticamente;
- mantener separación MVC correctamente implementada.

---

# Funcionalidades implementadas

## CRUD completo de afiliados

El sistema permite:

| Funcionalidad     | Descripción                             |
| ----------------- | --------------------------------------- |
| Listar afiliados  | Muestra todos los pacientes registrados |
| Ver detalle       | Muestra información individual          |
| Crear afiliado    | Registro de nuevos pacientes            |
| Editar afiliado   | Actualización de datos                  |
| Eliminar afiliado | Eliminación desde la interfaz           |

---

## Simulador de descuento

Cada afiliado posee un tipo de membresía:

| Membresía | Descuento |
| --------- | --------- |
| Silver    | 5%        |
| Gold      | 10%       |
| Platinum  | 20%       |

En la vista de detalle se puede ingresar un monto de tratamiento y el sistema calcula automáticamente:

- monto original;
- porcentaje de descuento;
- monto descontado;
- precio final.

Ejemplo:

```text
Monto tratamiento: $80.000
Afiliación: Gold
Descuento: 10%
Resultado final: $72.000
```

---

# Tecnologías utilizadas

| Tecnología         | Versión | Uso                     |
| ------------------ | ------- | ----------------------- |
| Node.js            | 22.x    | Entorno de ejecución    |
| TypeScript         | 5.x     | Lenguaje principal      |
| Express            | 4.x     | Framework backend       |
| express-handlebars | 7.x     | Motor de plantillas     |
| Prisma ORM         | 7.x     | ORM para acceso a datos |
| SQLite             | —       | Base de datos local     |
| ts-node            | 10.x    | Ejecución TypeScript    |
| tsdown             | 0.9.x   | Compilación             |
| nodemon            | 3.x     | Hot reload              |
| Bootstrap 5        | CDN     | Estilos visuales        |

---

# Arquitectura MVC

El proyecto está construido utilizando arquitectura MVC.

MVC significa:

- **Model**
- **View**
- **Controller**

La idea principal es separar responsabilidades.

---

# ¿Qué hace cada capa?

## Model

La capa Model trabaja con:

- acceso a datos;
- reglas del negocio;
- cálculos;
- persistencia.

Archivo principal:

```text
src/models/affiliate.model.ts
```

Responsabilidades:

- listar afiliados;
- buscar afiliados;
- crear registros;
- editar registros;
- eliminar registros;
- calcular descuentos.

El Model utiliza Prisma ORM para comunicarse con SQLite.

Importante:

El Model NO utiliza `req` ni `res`.
No conoce HTTP.
Eso permite respetar correctamente MVC.

---

## Controller

La capa Controller coordina la aplicación.

Archivo principal:

```text
src/controllers/affiliate.controller.ts
```

Responsabilidades:

- recibir formularios;
- obtener parámetros;
- validar datos;
- llamar al Model;
- renderizar vistas;
- redireccionar;
- manejar errores.

Ejemplo conceptual:

```ts
const affiliate = await AffiliateModel.getById(id);
res.render("affiliates/show", { affiliate });
```

El Controller sí trabaja con:

```ts
req;
res;
```

porque pertenece a la capa HTTP.

---

## Router

El Router define las rutas del sistema.

Archivo principal:

```text
src/routes/affiliate.routes.ts
```

Responsabilidades:

- mapear URLs;
- conectar rutas con controllers.

Ejemplo:

```text
GET /affiliates
POST /affiliates
GET /affiliates/:id
POST /affiliates/:id/edit
```

El Router no contiene lógica del negocio.

---

## View

Las Views son las vistas del sistema.

Se desarrollaron usando Handlebars.

Carpeta principal:

```text
views/
```

Responsabilidades:

- mostrar información;
- renderizar formularios;
- presentar resultados al usuario.

Las vistas NO realizan cálculos.
Solo muestran datos enviados por el Controller.

---

# Estructura del proyecto

```text
dentplus-mvc/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── src/
│   ├── controllers/
│   │   └── affiliate.controller.ts
│   │
│   ├── models/
│   │   └── affiliate.model.ts
│   │
│   ├── routes/
│   │   └── affiliate.routes.ts
│   │
│   ├── lib/
│   │   └── prisma.ts
│   │
│   ├── generated/
│   │   └── prisma/
│   │
│   ├── app.ts
│   └── index.ts
│
├── views/
│   ├── layouts/
│   │   └── main.hbs
│   │
│   ├── affiliates/
│   │   ├── index.hbs
│   │   ├── show.hbs
│   │   ├── create.hbs
│   │   └── edit.hbs
│   │
│   ├── home.hbs
│   └── 404.hbs
│
├── package.json
├── tsconfig.json
├── tsdown.config.ts
├── prisma.config.ts
├── .env.example
├── .gitignore
└── README.md
```

---

# Explicación detallada de carpetas

---

# Carpeta `src/`

Contiene toda la lógica backend principal del proyecto.

---

## `src/index.ts`

Es el punto de entrada de la aplicación.

Responsabilidades:

- iniciar el servidor;
- definir el puerto;
- ejecutar `app.listen()`.

Ejemplo:

```ts
app.listen(3000);
```

---

## `src/app.ts`

Configura Express y la aplicación completa.

Responsabilidades:

- configurar Handlebars;
- configurar layouts;
- habilitar formularios;
- registrar rutas;
- configurar vistas;
- manejar errores 404.

---

# Carpeta `src/controllers/`

Contiene los controladores MVC.

---

## `affiliate.controller.ts`

Controla toda la lógica de flujo de afiliados.

Funciones principales:

| Función          | Acción              |
| ---------------- | ------------------- |
| index            | Lista afiliados     |
| show             | Muestra detalle     |
| createForm       | Formulario creación |
| createAction     | Guarda afiliado     |
| editForm         | Formulario edición  |
| editAction       | Actualiza afiliado  |
| deleteAction     | Elimina afiliado    |
| simulateDiscount | Simula descuento    |

---

# Carpeta `src/models/`

Contiene acceso a datos y lógica de negocio.

---

## `affiliate.model.ts`

Trabaja directamente con Prisma ORM.

Incluye:

- CRUD;
- descuentos;
- simulador;
- consultas a SQLite.

También contiene:

```ts
calculateFinalPrice();
```

que realiza el cálculo del descuento.

---

# Carpeta `src/routes/`

Define las rutas Express.

---

## `affiliate.routes.ts`

Conecta URLs con controllers.

Ejemplo:

```ts
router.get("/", AffiliateController.index);
```

---

# Carpeta `src/lib/`

Contiene configuraciones reutilizables.

---

## `prisma.ts`

Exporta una instancia única de Prisma Client.

Eso evita crear múltiples conexiones innecesarias.

---

# Carpeta `views/`

Contiene las vistas Handlebars.

---

## `views/layouts/main.hbs`

Layout principal del sitio.

Contiene:

- HTML base;
- Bootstrap;
- navbar;
- footer;
- `{{{body}}}`.

`{{{body}}}` inserta dinámicamente cada vista.

---

## `views/home.hbs`

Página de inicio del sistema.

---

## `views/affiliates/index.hbs`

Listado de afiliados.

---

## `views/affiliates/show.hbs`

Detalle del afiliado y simulador.

---

## `views/affiliates/create.hbs`

Formulario de creación.

---

## `views/affiliates/edit.hbs`

Formulario de edición.

---

# Carpeta `prisma/`

Contiene toda la configuración de base de datos.

---

## `schema.prisma`

Define el modelo `Affiliate`.

```prisma
model Affiliate {
  id             Int    @id @default(autoincrement())
  firstName      String
  lastName       String
  email          String @unique
  membershipType String
}
```

---

## `seed.ts`

Inserta datos de ejemplo.

---

## `migrations/`

Contiene historial de migraciones.

---

# Base de datos

El proyecto usa SQLite.

La conexión se define en:

```env
DATABASE_URL="file:./dev.db"
```

La base se crea usando:

```bash
npx prisma migrate dev --name init
```

---

# Cómo descargar y ejecutar el proyecto

## 1. Clonar repositorio

```bash
git clone git@github.com:ottonlucena/desarrollo-software-san-sebastian.git
cd mvc-express-handlebars-web-1
```

---

## 2. Instalar dependencias

```bash
yarn install
```

---

## 3. Crear archivo `.env`

```bash
cp .env.example .env
```

Contenido:

```env
DATABASE_URL="file:./dev.db"
```

---

## 4. Generar Prisma Client

```bash
npx prisma generate
```

---

## 5. Crear base de datos

```bash
npx prisma migrate dev --name init
```

---

## 6. Poblar datos de ejemplo

```bash
yarn seed
```

---

## 7. Levantar servidor

```bash
yarn dev
```

Abrir:

```text
http://localhost:3000
```

---

# Scripts disponibles

| Script     | Función                 |
| ---------- | ----------------------- |
| yarn dev   | Ejecuta en desarrollo   |
| yarn build | Compila el proyecto     |
| yarn start | Ejecuta build           |
| yarn seed  | Inserta datos iniciales |

---

# Mejoras realizadas sobre proyecto base

El proyecto original estaba enfocado en productos.

Cambios realizados:

- reemplazo de `Product` por `Affiliate`;
- implementación CRUD de afiliados;
- implementación simulador de descuentos;
- nuevas vistas;
- mejoras visuales Bootstrap;
- confirmación de eliminación;
- adaptación completa a DentPlus;
- documentación completa;
- separación MVC mejorada.

---

# Posibles mejoras futuras

El proyecto podría seguir creciendo agregando:

- autenticación de usuarios;
- panel administrativo;
- historial de tratamientos;
- validaciones más avanzadas;
- búsqueda y filtros;
- paginación;
- API REST;
- Dockerización;
- despliegue en Railway o Render;
- integración con PostgreSQL;
- sistema de reservas médicas;
- manejo de imágenes y documentos.

---

# Problemas encontrados y soluciones

## Problema: Handlebars no cargaba layout

Causa:
El archivo `main.hbs` fue sobrescrito incorrectamente.

Solución:
Se restauró el layout principal con Bootstrap y `{{{body}}}`.

---

# Estado del proyecto

```text
Proyecto funcional y finalizado
```

Incluye:

- arquitectura MVC;
- CRUD completo;
- Prisma ORM;
- SQLite;
- simulador de descuentos;
- Handlebars;
- Bootstrap;
- documentación completa.

---

# Autores

Proyecto desarrollado por:

```text
Otton Lucena
Valeria Gomez
```

Como parte de una evaluación académica de arquitectura MVC y desarrollo backend.
