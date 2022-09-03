const axios = require('axios')
const subModel = require('../../../models/subscription')
const empSchema = require('../../../models/employee')

async function getApps (subdomain, apiToken) {
  const res = await axios.get(`https://${subdomain}/api/v1/apps`, {
    headers: {
      Authorization: `SSWS ${apiToken}`,
      'Content-Type': 'application/json'
    }
  })
  const appList = []
  res.data.forEach(app => appList.push([app.id, app.label, app.status, app._links.users.href]))
  return appList
}

async function getUsers (subDomain, apiToken) {
  const res = await axios.get(`https://${subDomain}/api/v1/users`, {
    headers: {
      Authorization: `SSWS ${apiToken}`,
      'Content-Type': 'application/json'
    }
  })
  const userList = []
  res.data.forEach(user => userList.push([{
    id: user.id,
    email: user.profile.email,
    firstname: user.profile.firstName,
    lastname: user.profile.lastName,
    username: user.profile.email,
    apps: []
  }]))

  return userList
}

async function getSubs (subDomain, apiToken, user_saasden_id) {
  try {
    const appData = await getApps(subDomain, apiToken)
    const subList = []
    for (const app of appData) {
      console.log('running for ' + app[1])
      const userData = await axios.get(app[3], {
        headers: {
          Authorization: `SSWS ${apiToken}`,
          'Content-Type': 'application/json'
        }
      })
      const empList = []
      for (const user of userData.data) {
        empList.push({
          id: user.id,
          email: user.profile.email,
          firstname: user.profile.firstName,
          lastname: user.profile.lastName,
          username: user.profile.email
        })
      }

      subList.push({
        name: app[1],
        id: app[0],
        emps: empList
      })
    }
    const filter = { user_saasden_id: user_saasden_id }
    const update = { apps: subList }
    await subModel.findOneAndUpdate(filter, update)
    console.log('Okta subscription data updated successfully')
  } catch (error) {
    console.log(error)
  }
}

async function getEmps (subDomain, apiToken, user_saasden_id) {
  try {
    const userList = await getUsers(subDomain, apiToken)
    for (const user of userList) {
      const appList = await axios.get(`https://${subDomain}/api/v1/apps?filter=user.id=="${user.id}"`, {
        headers: {
          Authorization: `SSWS ${apiToken}`,
          'Content-Type': 'application/json'
        }
      })
      console.log(appList.data)
      for (const app of appList.data) {
        user.apps.push({
          id: app.id,
          name: app.label
        })
      }
    }
    console.log(userList)
    // const filter = {user_saasden_id: user_saasden_id}
    // const update = {emps: subList}
    // await emsSchema.findOneAndUpdate(filter, update)
  } catch (error) {
    console.log(error)
  }
}

getEmps('trial-4790348.okta.com', '00JqHAKwnzIRdURjI3FhG7oqSn0xZ34ybrGurZbCFL', 'fuck off').then(res => {
  console.log(res)
}).catch(error => {
  console.log(error)
})
