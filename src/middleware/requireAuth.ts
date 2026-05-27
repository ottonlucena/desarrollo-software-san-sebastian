import { RequestHandler } from "express";

export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect("/login");
    return;
  }

  next();
};
