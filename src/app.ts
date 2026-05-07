import express from 'express'
import path from 'path'
import { engine } from 'express-handlebars'
import affiliateRouter from './routes/affiliate.routes'

const app = express()

const viewsPath = path.join(__dirname, '..', 'views')

app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(viewsPath, 'layouts'),
}))
app.set('view engine', 'hbs')
app.set('views', viewsPath)

app.use(express.urlencoded({ extended: true }))

app.get('/', (_req, res) => res.render('home'))
app.use('/affiliates', affiliateRouter)

export default app
