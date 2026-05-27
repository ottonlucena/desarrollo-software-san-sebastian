import { Request, Response } from "express";
import * as AffiliateModel from "../models/affiliate.model";
import { affiliateSchema } from "../schemas/affiliate.schemas";
import { formatZodErrors } from "../lib/parseError";

const renderNotFound = (res: Response): void => {
  res.status(404).render("404", { message: "Afiliado no encontrado" });
};

const buildMembershipOptions = (selected?: string) => {
  return AffiliateModel.membershipOptions.map((option) => ({
    ...option,
    selected: option.value === selected,
  }));
};

export const index = async (_req: Request, res: Response): Promise<void> => {
  const affiliates = await AffiliateModel.getAll();
  res.render("affiliates/index", { affiliates });
};

export const show = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const affiliate = await AffiliateModel.getById(id);

  if (!affiliate) {
    renderNotFound(res);
    return;
  }

  res.render("affiliates/show", { affiliate });
};

export const simulateDiscount = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = Number(req.params.id);
  const affiliate = await AffiliateModel.getById(id);

  if (!affiliate) {
    renderNotFound(res);
    return;
  }

  const treatmentAmount = Number(req.body.treatmentAmount);

  if (Number.isNaN(treatmentAmount) || treatmentAmount <= 0) {
    res.render("affiliates/show", {
      affiliate,
      error: "Ingresa un monto de tratamiento válido mayor a 0.",
    });
    return;
  }

  const simulation = AffiliateModel.calculateFinalPrice(
    affiliate.membershipType,
    treatmentAmount,
  );
  res.render("affiliates/show", { affiliate, simulation });
};

export const createForm = (_req: Request, res: Response): void => {
  res.render("affiliates/create", {
    membershipOptions: buildMembershipOptions(),
  });
};

export const createAction = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = affiliateSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).render("affiliates/create", {
      membershipOptions: buildMembershipOptions(req.body.membershipType),
      errors: formatZodErrors(result.error),
      values: req.body,
    });
    return;
  }

  try {
    const affiliate = await AffiliateModel.create(result.data);
    res.redirect(`/affiliates/${affiliate.id}`);
  } catch {
    res.status(400).render("affiliates/create", {
      membershipOptions: buildMembershipOptions(result.data.membershipType),
      error:
        "No se pudo crear el afiliado. Revisa que el correo no esté duplicado.",
      values: result.data,
    });
  }
};

export const editForm = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const affiliate = await AffiliateModel.getById(id);

  if (!affiliate) {
    renderNotFound(res);
    return;
  }

  res.render("affiliates/edit", {
    affiliate,
    membershipOptions: buildMembershipOptions(affiliate.membershipType),
  });
};

export const editAction = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = Number(req.params.id);

  const result = affiliateSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).render("affiliates/edit", {
      affiliate: {
        id,
        ...req.body,
      },
      membershipOptions: buildMembershipOptions(req.body.membershipType),
      errors: formatZodErrors(result.error),
      values: req.body,
    });
    return;
  }

  try {
    await AffiliateModel.update(id, result.data);
    res.redirect(`/affiliates/${id}`);
  } catch {
    res.status(400).render("affiliates/edit", {
      affiliate: {
        id,
        ...result.data,
      },
      membershipOptions: buildMembershipOptions(result.data.membershipType),
      error: "No se pudo editar el afiliado. Revisa los datos ingresados.",
      values: result.data,
    });
  }
};

export const deleteAction = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = Number(req.params.id);

  try {
    await AffiliateModel.remove(id);
    res.redirect("/affiliates");
  } catch {
    renderNotFound(res);
  }
};
