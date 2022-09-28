const axios = require('axios')

function getZohoOptions (orgId, accessToken, method, uri) {
  const zohoOptions = {
    method: method,
    uri: uri,
    headers: {
      'X-com-zoho-expense-organizationid': orgId,
      Authorization: 'Zoho-oauthtoken ' + accessToken

    }
  }
  return zohoOptions
}

async function getZohoAccessTokens (code) {
  const zohoCallBackOptions = {
    method: 'POST',
    uri: `https://accounts.zoho.in/oauth/v2/token?code=${code}&client_id=${process.env.client_id}&client_secret=${process.env.client_secret}&redirect_uri=http://localhost:3000/callback&grant_type=authorization_code`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  }
  const uri = `https://accounts.zoho.in/oauth/v2/token?code=${code}&client_id=${process.env.client_id}&client_secret=${process.env.client_secret}&redirect_uri=http://localhost:3000/callback&grant_type=authorization_code`
  const response = await axios.request(uri, zohoCallBackOptions)
  const accessToken = response.data.access_token
  return accessToken
}

module.exports = { getZohoOptions, getZohoAccessTokens }
