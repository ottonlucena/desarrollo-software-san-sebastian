import { defineConfig } from "prisma/config";

// En desarrollo, cargar .env si existe. En Docker, DATABASE_URL ya viene del entorno.
if (process.env.NODE_ENV !== "production") {
  try {
    require("dotenv").config();
  } catch {
    // dotenv es opcional
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
