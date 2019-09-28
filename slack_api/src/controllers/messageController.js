'use strict';

const axios = require('axios');
const qs = require('qs');
const apiUrl = process.env.SLACK_API_URL;
const teamService = require('../services/teamService');

const sendShortMessage = (userId, text) => {
    let data = {
        token: process.env.SLACK_ACCESS_TOKEN,
        channel: userId,
        text: text,
    };
    send(data);
};

const send = async (data) => {
    data.as_user = true; // send DM as a bot, not Slackbot
    const result = await axios.post(`${apiUrl}/chat.postMessage`, qs.stringify(data))
    try {
        if (result.data.error) console.log(`PostMessage Error: ${result.data.error}`);
    } catch (err) {
        console.log(err);
    }
};

const openCreateTeamDialog = async (trigger_id) => {
    let open_positions = await teamService.getOpenBoardPositions();
    let open_positions_str = open_positions.toString();
    console.log(open_positions);

    const dialogData = {
        token: process.env.SLACK_ACCESS_TOKEN,
        trigger_id: trigger_id,
        dialog: JSON.stringify(
            {
            title: 'Create a Team',
            callback_id: 'setupTeam',
            submit_label: 'Create',
            text: ' ',
            elements: [
                {
                    type: 'text',
                    name: 'name',
                    label: 'Team Name',
                },
                {
                    type: 'text',
                    name: 'location',
                    placeholder: 'The Vault',
                    label: 'Location',
                },
                {
                    type: 'text',
                    name: 'board_position',
                    placeholder: '0',
                    label: `Board Location\n Available Positions: ${open_positions_str})`,
                }
            ]
        })
    };
    return axios.post(`${apiUrl}/dialog.open`, qs.stringify(dialogData));
};

const openDeleteTeamDialog = async (trigger_id) => {
    const dialogData = {
        token: process.env.SLACK_ACCESS_TOKEN,
        trigger_id: trigger_id,
        dialog: JSON.stringify(
            {
            title: 'Delete a Team',
            callback_id: 'deleteTeam',
            submit_label: 'Delete',
            text: ' ',
            elements: [
                {
                    type: 'select',
                    name: 'team',
                    label: 'Choose the team to delete',
                    data_source: 'external',
                }
            ]
        })
    };
    return axios.post(`${apiUrl}/dialog.open`, qs.stringify(dialogData));
};

const openInDialog = async (trigger_id) => {
    const dialogData = {
        token: process.env.SLACK_ACCESS_TOKEN,
        trigger_id: trigger_id,
        dialog: JSON.stringify(
            {
            title: 'Delete a Team',
            callback_id: 'deleteTeam',
            submit_label: 'Delete',
            text: ' ',
            elements: [
                {
                    type: 'select',
                    name: 'team',
                    label: 'Choose the team to delete',
                    data_source: 'external',
                }
            ]
        })
    };
    return axios.post(`${apiUrl}/dialog.open`, qs.stringify(dialogData));
};

const openInOutDialog = async (trigger_id) => {
    const dialogData = {
        token: process.env.SLACK_ACCESS_TOKEN,
        trigger_id: trigger_id,
        dialog: JSON.stringify(
            {
            title: 'Change Team\'s Status',
            callback_id: 'inout',
            submit_label: 'Set',
            text: ' ',
            elements: [
                {
                    type: 'select',
                    name: 'team',
                    label: 'Choose the team to update',
                    data_source: 'external',
                },
                {
                    type: 'select',
                    name: 'status',
                    label: 'Set team\'s status',
                    options: [
                        {
                            label: "In",
                            value: "in"
                        },
                        {
                            label: "Out",
                            value: "out"
                        }
                    ]
                }
            ]
        })
    };
    return axios.post(`${apiUrl}/dialog.open`, qs.stringify(dialogData));
};

const openListUsersOnTeamDialog = async (trigger_id) => {
    const dialogData = {
        token: process.env.SLACK_ACCESS_TOKEN,
        trigger_id: trigger_id,
        dialog: JSON.stringify(
            {
            title: 'List Teammates',
            callback_id: 'listTeam',
            submit_label: 'Go',
            text: ' ',
            elements: [
                {
                    type: 'select',
                    name: 'team',
                    label: 'Choose the team to list',
                    data_source: 'external',
                }
            ]
        })
    };
    return axios.post(`${apiUrl}/dialog.open`, qs.stringify(dialogData));
};

const openAddUserDialog = async (trigger_id) => {
    const dialogData = {
        token: process.env.SLACK_ACCESS_TOKEN,
        trigger_id: trigger_id,
        dialog: JSON.stringify(
            {
            title: 'Add a user to a team',
            callback_id: 'addUser',
            submit_label: 'Add',
            text: ' ',
            elements: [
                {
                    type: 'select',
                    name: 'user',
                    label: 'Choose the user to add',
                    data_source: 'users',
                },
                {
                    type: 'select',
                    name: 'team',
                    label: 'Choose the team',
                    data_source: 'external',
                }
            ]
        })
    };
    return axios.post(`${apiUrl}/dialog.open`, qs.stringify(dialogData));
};

const openRemoveUserDialog = async (trigger_id) => {
    const dialogData = {
        token: process.env.SLACK_ACCESS_TOKEN,
        trigger_id: trigger_id,
        dialog: JSON.stringify(
            {
            title: 'Remove user from a team',
            callback_id: 'removeUser',
            submit_label: 'Remove',
            text: ' ',
            elements: [
                {
                    type: 'select',
                    name: 'user',
                    label: 'Choose a user to remove',
                    data_source: 'users',
                },
                {
                    type: 'select',
                    name: 'team',
                    label: 'Choose the team',
                    data_source: 'external',
                }
            ]
        })
    };
    return axios.post(`${apiUrl}/dialog.open`, qs.stringify(dialogData));
};

module.exports = {
    openCreateTeamDialog,
    openDeleteTeamDialog,
    openListUsersOnTeamDialog,
    openAddUserDialog,
    openRemoveUserDialog,
    openInOutDialog,
    sendShortMessage
};