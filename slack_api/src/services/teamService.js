const axios = require('axios');
const PI_API_URL = process.env.PI_API_URL;
const slackService = require('./slackService');

module.exports.getTeams = async function() {
  var result = [];
  return new Promise(function(resolve, reject) {
    axios.get(PI_API_URL + '/teams/')
      .then(function (response) {
        for (var team of response.data.data) {
          result.push({label:team.name, value:team.name});
        }
 
        resolve({options: result});
      }).catch(function (error) {
          console.log(error);
          reject(error);
    });
  });
}

module.exports.getAllTeamsStatus = async function() {
  var result = [];
  return new Promise(function(resolve, reject) {
    axios.get(PI_API_URL + '/teams/')
      .then(function (response) {
        for (var team of response.data.data) {
          result.push({team:team.name, status:team.status});
        }
        resolve({teams: result});
      }).catch(function (error) {
          console.log(error);
          reject(error);
    });
  });
}

module.exports.createTeam = async function(team_name) {
  return new Promise(function(resolve, reject) {
    axios.post(PI_API_URL + '/teams/', 
    {
      name: team_name
    }).then(function (response) {
        resolve('success');
      }).catch(function (error) {
          console.log(error.data);
          reject(error);
    });
  });
}

module.exports.updateTeamStatus = async function(team_name, status_text) {
  let status_code = (status_text === 'in' ? 1 : 0);
  return new Promise(function(resolve, reject) {
    axios.patch(PI_API_URL + '/teams/'  + team_name, 
    {
      status: status_code
    }).then(function (response) {
        resolve('success');
      }).catch(function (error) {
          console.log(error.data);
          reject(error);
    });
  });
}

module.exports.deleteTeam = async function(team_name) {
  return new Promise(function(resolve, reject) {
    axios.delete(PI_API_URL + '/teams/' + team_name)
      .then(function (response) {
        resolve('success');
      }).catch(function (error) {
          console.log(error);
          reject(error);
    });
  });
}

module.exports.getUser = async function(user_id) {
  return new Promise(function(resolve, reject) {
    axios.get(PI_API_URL + '/users/' + user_id)
    .then(function (response) {
        resolve(response.data);
      }).catch(function (error) {
          console.log(error.data);
          reject(error);
    });
  });
}

module.exports.deleteUser = async function(user_name) {
  return new Promise(function(resolve, reject) {
    axios.delete(PI_API_URL + '/users/' + user_name)
      .then(function (response) {
        resolve('success');
      }).catch(function (error) {
          console.log(error);
          reject(error);
    });
  });
}

module.exports.addUserToDB = async function(user) {
  return new Promise(function(resolve, reject) {
    axios.post(PI_API_URL + '/users/', 
    {
      username: user
    }).then(function (response) {
        resolve('success');
    }).catch(function (error) {
        console.log('errors', error);
        reject(error.data);
    });
  });
}

module.exports.addUserToTeam = async function(user, team) {
  await this.addUserToDB(user);
  return new Promise(function(resolve, reject) {
    console.log(user, team);
    axios.patch(PI_API_URL + '/users/' + user, 
    {
      teams: [{ name:team }],
    }).then(function (response) {
        resolve('success');
    }).catch(function (error) {
        reject(error.data);
    });
  });
}

module.exports.removeUserFromTeam = async function(user, team) {
  return new Promise(function(resolve, reject) {
    axios.delete(`${PI_API_URL}/teams/${team}/${user}`) 
    .then(function (response) {
        resolve('success');
    }).catch(function (error) {
        reject(error.data);
    });
  });
}

module.exports.listUsersOnTeam = async function(team) {
  return new Promise(function(resolve, reject) {
    axios.get(PI_API_URL + '/teams/' + team)
    .then(async function (response) {
      let result = [];
      for (var member of response.data.data.members) {
        let user = await slackService.getUserById(member.username);
        result.push({name:user.user.real_name});
      }
        resolve(result);
      }).catch(function (error) {
          console.log(error.data);
          reject(error);
    });
  });
}

module.exports.checkIfUserHasMultipleTeams = async function(user_id) {
  return new Promise(function(resolve, reject) {
    axios.get(PI_API_URL + '/users/' + user_id)
      .then(function (response) {
        let teams = response.data.data.teams;
        if (teams.length == 1) {
          resolve({multiple: 'false', team_id: teams[0].name});
        }
        else if (teams.length > 1){
          resolve({multiple: 'true'});
        }
        else {
          resolve({multiple: 'error'});
        }
      }).catch(function (error) {
          console.log(error);
          reject(error);
    });
  });
}