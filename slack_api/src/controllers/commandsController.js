const message = require('./messageController');
const signature = require('../verifySignature');
const teamService = require('../services/teamService')

let checkSlackSiganature = async function(req, res) {
    return !signature.isVerified(req) ? false : true;
}
let handleEvents = async function(req, res) {
    if (checkSlackSiganature === false) {
        res.sendStatus(404);
    }
    else {
        const command = req.body.command.replace(/^\/(qual|dev)_/, '/');

        if (command === '/create_team') {
            const { trigger_id } = req.body;
            try {
                const result = await message.openCreateTeamDialog(trigger_id);
                if (result.data.error) {
                    message.sendErrorMessage(user_id, res, `An unknown error has occured.`);
                } else {
                    res.send('');
                }
            } catch (err) {
                message.sendErrorMessage(user_id, res, `An unknown error has occured.`);
            }
        }
        if (command === '/delete_team') {
            const { trigger_id } = req.body;
            try {
                const result = await message.openDeleteTeamDialog(trigger_id);
                if (result.data.error) {
                    message.sendErrorMessage(user_id, res, `An unknown error has occured.`);
                } else {
                    res.send('');
                }
            } catch (err) {
                message.sendErrorMessage(user_id, res, `An unknown error has occured.`);
            }
        }
        if (command === '/remove_user') {
            const { trigger_id } = req.body;
            try {
                const result = await message.openRemoveUserDialog(trigger_id);
                if (result.data.error) {
                    message.sendErrorMessage(user_id, res, `An unknown error has occured.`);
                } else {
                    res.send('');
                }
            } catch (err) {
                message.sendErrorMessage(user_id, res, `An unknown error has occured.`);
            }
        }
        if (command === '/add_user') {
            const { trigger_id } = req.body;
            try {
                const result = await message.openAddUserDialog(trigger_id);
                if (result.data.error) {
                    message.sendErrorMessage(user_id, res, `An unknown error has occured.`);
                } else {
                    res.send('');
                }
            } catch (err) {
                message.sendErrorMessage(user_id, res, `An unknown error has occured.`);
            }
        }
        if (command === '/team_info') {
            const { trigger_id } = req.body;
            try {
                const result = await message.openListUsersOnTeamDialog(trigger_id);
                if (result.data.error) {
                    message.sendErrorMessage(user_id, res, `An unknown error has occured.`);
                } else {
                    res.send('');
                }
            } catch (err) {
                message.sendErrorMessage(user_id, res, `An unknown error has occured.`);
            }
        }
        if (command === '/update_team_position') {
            const { trigger_id } = req.body;
            try {
                const result = await message.openUpdateTeamDialog(trigger_id);
                if (result.data.error) {
                    message.sendErrorMessage(user_id, res, `An unknown error has occured.`);
                } else {
                    res.send('');
                }
            } catch (err) {
                message.sendErrorMessage(user_id, res, `An unknown error has occured.`);
            }
        }
        if (command === '/my_teams') {
            const { user_id } = req.body;
            try {
                const teamNames = await teamService.getMyTeamNames(user_id);
                if (teamNames === 'error') {
                    message.sendErrorMessage(user_id, res, `You haven't been added to any team yet. Type \`/add_user\``);
                }
                else {
                    message.sendShortMessage(user_id, res, `*Your teams are:*\n` +  teamNames.toString().replace(/[,]/g, "\n"));
                }
            } catch (err) {
                message.sendErrorMessage(user_id, res, `An unknown error has occured.`);
            }
        }
        if (command === '/update_team_status') {
            const { trigger_id } = req.body;
            try {
                await message.openInOutDialog(trigger_id);
                res.send('');
                
            } catch (err) {
                message.sendErrorMessage(user_id, res, `An unknown error has occured.`);
            }
        }
        if (command === '/gatekeeper') {
            const { user_id } = req.body;
            try {
                var readme_message = `
                *The Source Allies In Out Board*\n
                Here is a list of the available commands:\n
                */create_team: *\`registers a new team\`\n
                */delete_team: *\`deletes a team\`\n
                */my_teams: *\`lists your teams\`\n
                */add_user: *\`adds a user to a team\`\n
                */remove_user: *\`removes a user from a team\`\n
                */team_info: *\`gives you info about the team\`\n
                */in: *\`set your team's status to in\`\n
                */out: *\`set your team's status to out\`\n
                */update_team_status: *\`update any team's status\`\n
                */update_team_position: *\`update a team's board position\`\n
                */whos_here: *\`lists all teams in the office and their location\`\n
                `
                message.sendShortMessage(user_id, res, readme_message);
            } catch (err) {
                message.sendErrorMessage(user_id, res, `An unknown error has occured.`);
            }
        }
        if (command === '/whos_here') {
            const { user_id } = req.body;
            try {
                let result = await teamService.getAllTeamsStatus();
                let empty = true;
                let msgList = [`*Whos's here?*\n`];
                for (const team of result.teams) {
                    if (team.status =='1') {
                        let msg = `*${team.teamName}*: \``;
                        if (team.location != null) {
                            msg += `${team.location} @ `;
                        }
                        msg += `${team.building}\``;
                        msgList.push(msg);
                        empty = false;
                    }
                }
                if (empty) {
                    message.sendShortMessage(user_id, res, `Nobody is here.`);
                }
                else {
                    message.sendShortMessage(user_id, res, msgList.join('\n'));
                }
            } catch (e) {
                console.log('error' ,e);
                message.sendErrorMessage(user_id, res, `An unknown error has occured.`);
            }
        }
        if (command === '/in') {
            const { user_id, trigger_id } = req.body;
            try {
                let result = await teamService.checkIfUserHasMultipleTeams(user_id);
                if (result.multiple === 'false') {
                    await teamService.updateTeamStatus(result.team_id, 'in');
                    message.sendShortMessage(user_id, res, "*Team Status Set to:* \`in\`");
                }
                else if (result.multiple === 'true') {
                    try {
                        const result = await message.openInDialog(trigger_id);
                        if (result.data.error) {
                            message.sendErrorMessage(user_id, res, `An unknown error has occured.`);
                        } else {
                            res.send('');
                        }
                    } catch (err) {
                        message.sendErrorMessage(user_id, res, `An unknown error has occured.`);
                    }
                }
                else {
                    message.sendShortMessage(user_id, res, '*Please register for a team by typing `/add_user`.*');
                }
            } catch (e) {
                message.sendErrorMessage(user_id, res, '*Please register for a team by typing `/add_user`.*'); 
            }
        }
    
        if (command === '/out') {
            const { user_id, trigger_id } = req.body;
            try {
                let result = await teamService.checkIfUserHasMultipleTeams(user_id);
                if (result.multiple === 'false') {
                    await teamService.updateTeamStatus(result.team_id, 'out');
                    message.sendShortMessage(user_id, res, "*Team Status Set to:* \`out\`");
                }
                else if (result.multiple === 'true') {
                    try {
                        const result = await message.openOutDialog(trigger_id);
                        if (result.data.error) {
                            message.sendErrorMessage(user_id, res, `An unknown error has occured.`);
                        } else {
                            res.send('');
                        }
                    } catch (err) {
                        message.sendErrorMessage(user_id, res, `An unknown error has occured.`);
                    }
                }
                else {
                    message.sendShortMessage(user_id, res, '*Please register for a team by typing `/add_user`.*');
                }
            } catch (e) {
                console.log('error');
                message.sendErrorMessage(user_id, res, '*Please register for a team by typing `/add_user`.*');
            }
        }
    }
}
module.exports.run = function(req, res) {
    handleEvents(req, res);
}
