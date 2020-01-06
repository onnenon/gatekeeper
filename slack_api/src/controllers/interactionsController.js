const message = require('./messageController');
const signature = require('../verifySignature');
const teamService = require('../services/teamService');

function json2array(json){
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function(key){
        result.push(json[key].name + "\n");
    });
    return result;
}

let handleInteractions = async function(req, res) {
    if (!signature.isVerified(req)) {
        res.sendStatus(404);
        return;
    } else {
        const {
            type,
            user,
            callback_id,
            submission
        } = JSON.parse(req.body.payload);

        if (type === 'dialog_submission') {
            if (callback_id === 'setupTeam') {
                try {
                    let result = await teamService.createTeam(submission.name, submission.location, submission.board_position);
                    message.sendShortMessage(user.id, res, `*Your team has been registered.*\n *Your board position is:* \`${submission.board_position}\``);
                } catch (e) {
                    console.log('error', e);
                    message.sendErrorMessage(user.id, res, '*That team name or board position is already taken.*');
                }
            }
            else if (callback_id === 'deleteTeam') {
                try {
                    await teamService.deleteTeam(submission.teamName);
                    message.sendShortMessage(user.id, res, `*Deleted team:* \`${submission.teamName}\``);
                
                } catch (e) {
                    console.log('error');
                    message.sendErrorMessage(user.id, res, `*Failed To Delete Team*`);
                
                }
            }
            else if (callback_id === 'listTeam') {
                try {
                    let result = await teamService.listUsersOnTeam(submission.teamName);
                    let teamResult = await teamService.getTeamByID(submission.teamName);
                    let team = teamResult.data;
                    result = json2array(result);
                    let formattedList = []
                    for (var person of result) {
                        person = person.replace(/[\n]/g, "");
                        formattedList.push(`\`${person}\`\n`);
                    }
                    if (result.length != 0) {
                        message.sendShortMessage(user.id, res, `*Team Name: *\`${submission.teamName}\`\n *Board position: *\`${team.board_position}\`\n *location: * \`${team.location}\`\n *Members: *\n` +  formattedList.toString().replace(/[,]/g, ""));
                    }
                    else {
                        message.sendErrorMessage(user.id, res, `*The team \`${submission.teamName}\` has no teammates yet.*`);
                    }
                } catch (e) {
                    console.log('error');
                    message.sendErrorMessage(user.id, res, `*Failed To List Teams*`);
                }
            }
            else if (callback_id === 'addUser') {
                try {
                    await teamService.addUserToTeam(submission.user, submission.teamName);
                    message.sendShortMessage(user.id, res, `*Successfully added user to the team:* \`${submission.teamName}\``);
                } catch (e) {
                    console.log('error');
                    message.sendErrorMessage(user.id, res, `*Failed to add user*`);
                }
            }
            else if (callback_id === 'removeUser') {
                try {
                    await teamService.removeUserFromTeam(submission.user, submission.teamName);
                    message.sendShortMessage(user.id, res, `*Successfully removed user from the team:* \`${submission.teamName}\``);
                
                } catch (e) {
                    message.sendErrorMessage(user.id, res, `*That user is not currently on team:* \`${submission.teamName}\``);
                }
            }
            else if (callback_id === 'inout') {
                try {
                    await teamService.updateTeamStatus(submission.teamName, submission.status);
                    message.sendShortMessage(user.id, res, `*Successfully set \`${submission.teamName}'s\` status to:* \`${submission.status}\``);
                
                } catch (e) {
                    console.log('error');
                    message.sendErrorMessage(user.id, res, `*Failed To Set Status*`);
                }
            }
            else if (callback_id === 'in') {
                try {
                    await teamService.updateTeamStatus(submission.teamName, 'in');
                    message.sendShortMessage(user.id, res, `*Successfully set \`${submission.teamName}'s\` status to:* \`in\``);
                } catch (e) {
                    console.log('error');
                    message.sendErrorMessage(user.id, res, `*Failed To Set Status*`);
                }
            }
            else if (callback_id === 'out') {
                try {
                    await teamService.updateTeamStatus(submission.teamName, 'out');
                    message.sendShortMessage(user.id, res, `*Successfully set \`${submission.teamName}'s\` status to:* \`out\``);
                } catch (e) {
                    console.log('error');
                    message.sendErrorMessage(user.id, res, `*Failed To Set Status*`);
                }
            }
            else if (callback_id === 'updatePosition') {
                try {
                    await teamService.updateTeamPosition(submission.teamName, Number(submission.board_position));
                    message.sendShortMessage(user.id, res, `*Successfully updated \`${submission.teamName}'s\` board position to:* \`${submission.board_position}\``);
                } catch (e) {
                    console.log('error');
                    message.sendErrorMessage(user.id, res, `*Failed Updating Board Position*`);
                }
            }
        }
    }
}
module.exports.run = function(req, res) {
    handleInteractions(req, res);
}