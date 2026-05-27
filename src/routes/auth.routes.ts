import { Router } from 'express'

import {
  registerForm,
  registerAction,
  loginForm,
  loginAction,
  logoutAction,
} from '../controllers/auth.controller'

const router = Router()

router.get('/register', registerForm)
router.post('/register', registerAction)

router.get('/login', loginForm)
router.post('/login', loginAction)

router.post('/logout', logoutAction)

export default router
