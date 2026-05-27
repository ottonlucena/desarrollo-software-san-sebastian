import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import session = require("express-session");
import type { RequestHandler } from "express";
import affiliateRoutes from "./routes/affiliate.routes";
import authRoutes from "./routes/auth.routes";
import { requireAuth } from "./middleware/requireAuth";

const app = express();

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(process.cwd(), "views/layouts"),
  }),
);

app.set("view engine", "hbs");
app.set("views", path.join(process.cwd(), "views"));

app.use(express.urlencoded({ extended: true }));

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET ?? "dev-secret",
  resave: false,
  saveUninitialized: false,
});

app.use(sessionMiddleware as unknown as RequestHandler);

app.get("/", (_req, res) => {
  res.render("home");
});

app.use(authRoutes);
app.use("/affiliates", requireAuth, affiliateRoutes);

app.use((_req, res) => {
  res.status(404).render("404");
});

export default app;
