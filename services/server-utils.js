const request = require('request-promise');

module.exports = {
    postRequest: async (endpoint, body) => {
        console.log(body);
        let options = {
            method: 'POST',
            uri: 'http://localhost:8080' + endpoint,
            body: body,
            json: true
        };
        console.log(options);
        var res;
        await request(options)
        .then(response => {
            res = response;
        })
        .catch(err => {
            res = err;
        });
        return res;
        
    }
};