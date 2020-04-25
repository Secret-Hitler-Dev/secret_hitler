const request = require('request-promise');

module.exports = {
    postRequest: (endpoint, body, req, res) => {
        console.log(body);
        let options = {
            method: 'POST',
            uri: 'http://localhost:8080' + endpoint,
            body: body,
            json: true
        };
        console.log(options);
        request(options).then(response => response).catch(err => err);
                
        
    }
};