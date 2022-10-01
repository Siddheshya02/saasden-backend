import jwt_decode from 'jwt-decode'

export function setOrgName (req, res, next) {
  const auth0_tokenSet = jwt_decode(req.get('Authorization'))
  req.session.orgID = auth0_tokenSet.org_id
  req.session.userName = auth0_tokenSet.name
  req.session.userEmail = auth0_tokenSet.email
  next()
}

// NOTE: Add your errors here
export function handleErrors (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid Token ')
  } else {
    next(err)
  }
}