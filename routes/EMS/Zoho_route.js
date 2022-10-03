import axios from 'axios'
import express from 'express'
import orgSchema from '../../models/organization.js'
const router = express.Router()

// Send Link to Login
router.get('/', async (req, res) => {
  const orgData = await orgSchema.findOne({ ID: req.session.orgID })
  req.session.ems_name = 'zoho'
  req.session.ems_clientID = orgData.emsData.clientID
  req.session.ems_clientSecret = orgData.emsData.clientSecret
  req.session.tenantID = orgData.emsData.tenantID
  const url = new URL('https://accounts.zoho.com/oauth/v2/auth')
  url.searchParams.append('scope', 'ZohoExpense.fullaccess.ALL')
  url.searchParams.append('client_id', req.session.ems_clientID)
  url.searchParams.append('state', 'radomState=usedforSecuRity')
  url.searchParams.append('response_type', 'code')
  url.searchParams.append('redirect_uri', `${process.env.domain}/api/v1/zoho/callback`)
  url.searchParams.append('access_type', 'offline')
  url.searchParams.append('prompt', 'consent')
  res.send(url.toString())
})

router.get('/callback', async (req, res) => {
  try {
    const url = new URL('https://accounts.zoho.in/oauth/v2/token')
    url.searchParams.append('code', req.query.code)
    url.searchParams.append('client_id', req.session.ems_clientID)
    url.searchParams.append('client_secret', req.session.ems_clientSecret)
    url.searchParams.append('redirect_uri', `${process.env.domain}/api/v1/zoho/callback`)
    url.searchParams.append('grant_type', 'authorization_code')
    const tokenSet = await axios.post(url.toString(), {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    })
    req.session.ems_accessToken = tokenSet.data.access_token
    req.session.ems_refreshToken = tokenSet.data.refresh_token
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

// To be called only 1 time
router.post('/auth', async (req, res) => {
  const filter = { ID: req.session.orgID }
  const update = {
    emsData: {
      clientID: req.body.clientID,
      clientSecret: req.body.clientSecret,
      tenantID: req.body.tenantID
    }
  }
  try {
    await orgSchema.findOneAndUpdate(filter, update)
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

export { router }
