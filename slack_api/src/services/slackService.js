const axios = require('axios');
const qs = require('qs');
const apiUrl = process.env.SLACK_API_URL;

module.exports.getUserById = async function(user_id) {
    return new Promise(function(resolve, reject) {
        const payload = {
            token: process.env.SLACK_USER_TOKEN,
            user: user_id
        };
        axios.post(`${apiUrl}/users.info`, qs.stringify(payload)).then(function (response) {
            resolve(response.data);
        }).catch(function (error) {
            reject(error.data);
        });
    });
};