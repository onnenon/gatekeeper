const message = require('./messageController');
const signature = require('../verifySignature');
const axios = require('axios');
const qs = require('querystring');
const teamService = require('../services/teamService');


const apiUrl = process.env.SLACK_API_URL;
const openDialog = async (trigger_id) => {
    const dialogData = {
        token: process.env.SLACK_ACCESS_TOKEN,
        trigger_id: trigger_id,
        dialog: JSON.stringify({
            title: 'Create a Team',
            callback_id: 'setupTeam',
            submit_label: 'Request',
            text: ' ',

            elements: [{
                    type: 'text',
                    name: 'title',
                    label: 'Team Name',
                },

                {
                    type: 'select',
                    name: 'team',
                    label: 'Your team\'s slack channel',
                    data_source: 'channels',
                },
                {
                    type: 'text',
                    name: 'time',
                    label: 'Working Hours?',
                    placeholder: '7:30-4:00'
                }
            ]
        })
    };
    return axios.post(`${apiUrl}/dialog.open`, qs.stringify(dialogData));
};

let handleInteractions = async function(req, res) {
    if (!signature.isVerified(req)) {
        res.sendStatus(404);
        return;
    } else {
        const {
            type,
            user,
            trigger_id,
            callback_id,
            actions,
            response_url,
            submission
        } = JSON.parse(req.body.payload);
        console.log(callback_id);
        if (type === 'interactive_message') {
            if (callback_id === 'registerTeam') {
                try {
                    const result = await openDialog(trigger_id);
                    if (result.data.error) {
                        res.sendStatus(500);
                    } else {
                        //teamService.createTeam(data);
                        message.sendShortMessage(user.id, 'Thanks!');
                        res.sendStatus(200);
                    }
                } catch (err) {
                    res.sendStatus(500);
                }
            } else if (callback_id === 'setStatusAsIn') {
                //teamService.setUserStatus(data);
                message.sendShortMessage(user.id, 'Thanks! Don\'t forget to sign out when you leave');
                res.sendStatus(200);
            } else if (callback_id === 'setStatusAsOut') {
                //teamService.setUserStatus(data);
                message.sendShortMessage(user.id, 'Thanks! Have a great rest of your day.');
                res.sendStatus(200);
            } else if (callback_id === 'setupTeam') {
                //teamService.setUserStatus(data);
                message.sendShortMessage(user.id, 'Thanks! Your team has been registered.');
                res.sendStatus(200);
            }
        }
    }
}
module.exports.run = function(req, res) {
    handleInteractions(req, res);
}