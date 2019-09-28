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
                    let result = await teamService.createTeam(submission.name, submission.location, submission.board_location);
                    message.sendShortMessage(user.id, `Your team has been registered.\n Your board position is: ${result.board_location}`);
                    res.send('');
                } catch (e) {
                    console.log('error');
                    message.sendShortMessage(user.id, 'Oops, the name ${submission.title} is already taken or an error has occured.');
                    res.send('');
                }
            }
            else if (callback_id === 'deleteTeam') {
                try {
                    await teamService.deleteTeam(submission.team);
                    message.sendShortMessage(user.id, 'Deleted team: ' + submission.team);
                    res.send('');
                } catch (e) {
                    console.log('error');
                    res.send(500);
                }
            }
            else if (callback_id === 'listTeam') {
                try {
                    let result = await teamService.listUsersOnTeam(submission.team);
                    result = json2array(result);
                    let formattedList = []
                    for (var person of result) {
                        person = person.replace(/[\n]/g, "");
                        formattedList.push(`\`${person}\`\n`);
                    }
                    console.log(result);
                    if (result.length != 0) {
                        message.sendShortMessage(user.id, `*The teammates on team ${submission.team} are:*\n` +  formattedList.toString().replace(/[,]/g, ""));
                    }
                    else {
                        message.sendShortMessage(user.id, `*The team \'${submission.team}\' has no teammates yet.*`);
                    }
                    res.send('');
                } catch (e) {
                    console.log('error');
                    res.send(500);
                }
            }
            else if (callback_id === 'addUser') {
                try {
                    await teamService.addUserToTeam(submission.user, submission.team);
                    message.sendShortMessage(user.id, `*Successfully added user to the team:* ${submission.team}`);
                    res.send('');
                } catch (e) {
                    console.log('error');
                    res.send(500);
                }
            }
            else if (callback_id === 'removeUser') {
                try {
                    await teamService.removeUserFromTeam(submission.user, submission.team);
                    message.sendShortMessage(user.id, `*Successfully removed user from the team:* ${submission.team}`);
                    res.send('');
                } catch (e) {
                    message.sendShortMessage(user.id, `*They are currently no users on the team:* ${submission.team}`);
                    res.send('');
                }
            }
            else if (callback_id === 'inout') {
                try {
                    await teamService.updateTeamStatus(submission.team, submission.status);
                    message.sendShortMessage(user.id, `*Successfully set ${submission.team}'s status to:* ${submission.status}`);
                    res.send('');
                } catch (e) {
                    console.log('error');
                    res.send(500);
                }
            }
        }
    }
}
module.exports.run = function(req, res) {
    handleInteractions(req, res);
}