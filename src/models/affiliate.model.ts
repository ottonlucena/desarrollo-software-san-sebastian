import prisma from '../lib/prisma'
import type { Prisma } from '../generated/prisma/client'

export type MembershipType = 'silver' | 'gold' | 'platinum'

const discountRates: Record<MembershipType, number> = {
  silver: 0.05,
  gold: 0.10,
  platinum: 0.20,
}

export const membershipOptions: { value: MembershipType; label: string }[] = [
  { value: 'silver', label: 'Silver' },
  { value: 'gold', label: 'Gold' },
  { value: 'platinum', label: 'Platinum' },
]

export const getAll = async () => {
  return await prisma.affiliate.findMany({ orderBy: { id: 'asc' } })
}

export const getById = async (id: number) => {
  return await prisma.affiliate.findUnique({ where: { id } })
}

export const create = async (data: Prisma.AffiliateCreateInput) => {
  return await prisma.affiliate.create({ data })
}

export const update = async (id: number, data: Prisma.AffiliateUpdateInput) => {
  return await prisma.affiliate.update({ where: { id }, data })
}

export const remove = async (id: number) => {
  return await prisma.affiliate.delete({ where: { id } })
}

export const getDiscountRate = (membershipType: string): number => {
  return discountRates[membershipType as MembershipType] ?? 0
}

export const calculateFinalPrice = (membershipType: string, treatmentAmount: number) => {
  const discountRate = getDiscountRate(membershipType)
  const discountAmount = treatmentAmount * discountRate
  const finalPrice = treatmentAmount - discountAmount

  return {
    treatmentAmount,
    discountRate,
    discountPercent: discountRate * 100,
    discountAmount,
    finalPrice,
  }
}
