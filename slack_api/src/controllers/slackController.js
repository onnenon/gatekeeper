const axios = require('axios');
const qs = require('qs');
const apiUrl = process.env.SLACK_API_URL;

module.exports.getAllUsers = async function() {
    const payload = {
        token: process.env.SLACK_ACCESS_TOKEN,
    };
    let result;
    try {
        result = await axios.post(`${apiUrl}/users.list`, qs.stringify(payload));
    } catch (e) {
        console.log(e);
        result = e;
    }
    return result.data.members;
};

module.exports.getUserById = function(user_id) {
    return new Promise(function(resolve, reject) {
        const payload = {
            token: process.env.SLACK_USER_TOKEN,
            user: user_id
        };
        let result;
        try {
            result = await axios.post(`${apiUrl}/users.info`, qs.stringify(payload));
            resolve(result.data);
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
    
};

module.exports.getUsersInChannel = async function(channel) {
    const payload = {
        token: process.env.SLACK_USER_TOKEN,
        channel: channel
    };
    let result;
    try {
        result = await axios.post(`${apiUrl}/channels.info`, qs.stringify(payload));
    } catch (e) {
        console.log(e);
        result = e;
    }
    return result.data.channel.members;
};