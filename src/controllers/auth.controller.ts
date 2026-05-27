import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'

import * as UserModel from '../models/user.model'

import {
  registerSchema,
  loginSchema,
} from '../schemas/auth.schemas'

import { formatZodErrors } from '../lib/parseError'

export const registerForm = (_req: Request, res: Response): void => {
  res.render('auth/register')
}

export const registerAction = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = registerSchema.safeParse(req.body)

  if (!result.success) {
    res.status(400).render('auth/register', {
      errors: formatZodErrors(result.error),
      values: req.body,
    })

    return
  }

  const existingUser = await UserModel.findByEmail(result.data.email)

  if (existingUser) {
    res.status(400).render('auth/register', {
      error: 'Ya existe un usuario con ese correo.',
      values: req.body,
    })

    return
  }

  const passwordHash = await bcrypt.hash(result.data.password, 10)

  const user = await UserModel.create({
    email: result.data.email,
    password: passwordHash,
  })

  req.session.userId = user.id

  res.redirect('/affiliates')
}

export const loginForm = (_req: Request, res: Response): void => {
  res.render('auth/login')
}

export const loginAction = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = loginSchema.safeParse(req.body)

  if (!result.success) {
    res.status(400).render('auth/login', {
      errors: formatZodErrors(result.error),
      values: req.body,
    })

    return
  }

  const user = await UserModel.findByEmail(result.data.email)

  if (!user) {
    res.status(400).render('auth/login', {
      error: 'Correo o contraseña incorrectos.',
      values: req.body,
    })

    return
  }

  const passwordMatch = await bcrypt.compare(
    result.data.password,
    user.password
  )

  if (!passwordMatch) {
    res.status(400).render('auth/login', {
      error: 'Correo o contraseña incorrectos.',
      values: req.body,
    })

    return
  }

  req.session.userId = user.id

  res.redirect('/affiliates')
}

export const logoutAction = (
  req: Request,
  res: Response
): void => {
  req.session.destroy(() => {
    res.redirect('/login')
  })
}
