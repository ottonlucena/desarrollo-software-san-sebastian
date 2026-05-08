import express from 'express'
import { engine } from 'express-handlebars'
import path from 'path'
import affiliateRoutes from './routes/affiliate.routes'

const app = express()

app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(process.cwd(), 'views/layouts'),
  })
)

app.set('view engine', 'hbs')
app.set('views', path.join(process.cwd(), 'views'))

app.use(express.urlencoded({ extended: true }))

app.get('/', (_req, res) => {
  res.render('home')
})

app.use('/affiliates', affiliateRoutes)

app.use((_req, res) => {
  res.status(404).render('404')
})

export default app
