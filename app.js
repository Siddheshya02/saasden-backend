import { router as azure } from './routes/SSO/Azure_route.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import { router as emps } from './routes/dashboard/employee_route.js'
import express from 'express'
import { expressjwt } from 'express-jwt'
import { fileURLToPath } from 'url'
import { router as jumpcloud } from './routes/SSO/JumpCloud_route.js'
import jwks from 'jwks-rsa'
import mongoose from 'mongoose'
import { router as okta } from './routes/SSO/Okta_route.js'
import { router as onelogin } from './routes/SSO/OneLogin_route.js'
import path from 'path'
import { router as pingone } from './routes/SSO/PingOne_route.js'
import sessions from 'express-session'
import { router as subs } from './routes/dashboard/subscription_route.js'
import { router as xero } from './routes/EMS/Xero_route.js'
import { router as zoho } from './routes/EMS/Zoho_route.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()

const jwtCheck = expressjwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://saasden1.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://www.saasden.club',
  issuer: 'https://saasden1.us.auth0.com/',
  algorithms: ['RS256']
})

const sess_config = {
  secret: process.env.sessionSecret,
  saveUninitialized: true,
  resave: false,
  maxAge: 86400000 // 1 Day
}

const cors_config = {}

// MongoDB configuration
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (err) {
    console.log('Error Connecting to mongoDB')
  } else {
    console.log('MongoDB Connected')
  }
})

// App configurations
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(sessions(sess_config))
app.use(cors(cors_config))
app.use(cookieParser())
app.use(express.json())
app.use(jwtCheck)

// SSO Routes
app.use('/api/v1/okta', okta)
app.use('/api/v1/azure', azure)
app.use('/api/v1/pingone', pingone)
app.use('/api/v1/onelogin', onelogin)
app.use('/api/v1/jumpcloud', jumpcloud)

// EMS Routes
app.use('/api/v1/xero', xero)
app.use('/api/v1/zoho', zoho)

app.use('/api/v1', subs)
app.use('/api/v1', emps)

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Listening on port ${port}...`))
