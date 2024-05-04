import express from 'express'
import routes from './routes'

require('dotenv').config();

const app = express()

app.use(express.json())

app.use(routes)

export default app