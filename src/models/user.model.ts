import prisma from '../lib/prisma'

interface CreateUserInput {
  email: string
  password: string
}

export const create = async (data: CreateUserInput) => {
  return prisma.user.create({
    data,
  })
}

export const findByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  })
}

export const findById = async (id: number) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
  })
}
