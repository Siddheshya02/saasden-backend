const options = require("./utils")
const userAppSchema = require('../models/userApps')
const axios = require('axios')

async function appDB(accessToken, tenantID){   
    var okta_apps = []
    const options_Okta = options.getOktaOptions('/api/v1/apps', 'GET')
    var output = await axios.request(options_Okta)
    output.data.forEach(app => okta_apps.push([app.id, app.label]));

    var xeroList = []
    const options_Xero = options.getXeroOptions('https://api.xero.com/api.xro/2.0/Contacts', 'GET', tenantID, accessToken)
    var output = await axios.request(options_Xero)    
    output.data.Contacts.forEach(contact => xeroList.push([contact.ContactID, contact.Name]))
    
    var contactList = []
    okta_apps.forEach(app => {
        for(i=0; i<xeroList.length; i++){
            if(app[1] == xeroList[i][1]){
                contactList.push({
                    appName : xeroList[i][1],
                    appID : app[0],
                    contactID : xeroList[i][0]
                })
                xeroList.splice(i,1)
                break
            }
        }
    })

    try {
        await userAppSchema.insertMany(contactList)
        console.log("Records inserted succesfully")
    } catch (error) {
        console.log(error)
    }
}

module.exports = {appDB}