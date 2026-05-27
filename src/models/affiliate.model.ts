import prisma from "../lib/prisma";

export type MembershipType = "silver" | "gold" | "platinum";

interface AffiliateInput {
  firstName: string;
  lastName: string;
  email: string;
  membershipType: MembershipType;
}

const discountRates: Record<MembershipType, number> = {
  silver: 0.05,
  gold: 0.1,
  platinum: 0.2,
};

export const membershipOptions: { value: MembershipType; label: string }[] = [
  { value: "silver", label: "Silver" },
  { value: "gold", label: "Gold" },
  { value: "platinum", label: "Platinum" },
];

export const getAll = async (userId: number) => {
  return await prisma.affiliate.findMany({
    where: { userId },
    orderBy: { id: "asc" },
  });
};

export const getById = async (id: number, userId: number) => {
  return await prisma.affiliate.findFirst({
    where: {
      id,
      userId,
    },
  });
};

export const create = async (data: AffiliateInput, userId: number) => {
  return await prisma.affiliate.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const update = async (
  id: number,
  data: AffiliateInput,
  userId: number,
) => {
  return await prisma.affiliate.update({
    where: {
      id_userId: {
        id,
        userId,
      },
    },
    data,
  });
};

export const remove = async (id: number, userId: number) => {
  return await prisma.affiliate.delete({
    where: {
      id_userId: {
        id,
        userId,
      },
    },
  });
};

export const getDiscountRate = (membershipType: string): number => {
  return discountRates[membershipType as MembershipType] ?? 0;
};

export const calculateFinalPrice = (
  membershipType: string,
  treatmentAmount: number,
) => {
  const discountRate = getDiscountRate(membershipType);
  const discountAmount = treatmentAmount * discountRate;
  const finalPrice = treatmentAmount - discountAmount;

  return {
    treatmentAmount,
    discountRate,
    discountPercent: discountRate * 100,
    discountAmount,
    finalPrice,
  };
};
