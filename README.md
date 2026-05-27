# DentPlus MVC — Sistema de Gestión de Afiliados Clínicos

Sistema web desarrollado para la clínica dental ficticia **DentPlus**, construido utilizando arquitectura MVC con Node.js, TypeScript, Express, Handlebars, Prisma ORM y PostgreSQL.

El proyecto evolucionó desde un CRUD básico hacia una aplicación lista para producción, incorporando:

- validaciones con Zod;
- autenticación con sesiones;
- hash de contraseñas con bcryptjs;
- aislamiento de datos por usuario;
- PostgreSQL;
- Docker Compose;
- separación MVC completa.

---

# Objetivo del proyecto

La clínica DentPlus administraba afiliados mediante planillas Excel, provocando:

- duplicidad de registros;
- errores manuales;
- problemas de seguridad;
- dificultad para mantener datos;
- pérdida de información.

El objetivo del sistema es modernizar la gestión mediante una aplicación web segura y escalable.

---

# Funcionalidades implementadas

# Gestión completa de afiliados (CRUD)

El sistema permite:

| Funcionalidad     | Descripción                               |
| ----------------- | ----------------------------------------- |
| Listar afiliados  | Muestra afiliados del usuario autenticado |
| Ver detalle       | Visualiza información individual          |
| Crear afiliado    | Registro de nuevos afiliados              |
| Editar afiliado   | Actualización de datos                    |
| Eliminar afiliado | Eliminación segura                        |

---

# Simulador de descuentos

Cada afiliado posee una membresía:

| Membresía | Descuento |
| --------- | --------- |
| Silver    | 5%        |
| Gold      | 10%       |
| Platinum  | 20%       |

El sistema calcula automáticamente:

- porcentaje de descuento;
- monto descontado;
- valor final del tratamiento.

Ejemplo:

```text
Monto: $80.000
Membresía: Gold
Descuento: 10%
Resultado final: $72.000
```
