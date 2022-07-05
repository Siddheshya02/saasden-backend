function getOktaOptions(oktaDomain, path, method, oktaAPIKey){
    const options = {
        method: method,
        url: oktaDomain + path,
        headers:{
            Authorization: oktaAPIKey,
            Accept: 'application/json',
            ContentType: 'application/json',
        }
    }
    return options
}


function getXeroOptions(url, method, tenantID, bearer){
    const options = {
        method: method,
        url: url,
        headers:{
            'Authorization': 'Bearer ' + bearer,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'xero-tenant-id': tenantID
        }
    }
    return options
}

module.exports = {getOktaOptions, getXeroOptions}