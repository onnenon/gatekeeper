const axios = require('axios');
const PI_API_URL = process.env.PI_API_URL;
const slackService = require('./slackService');

module.exports.getTeams = async function() {
  var result = [];
  return new Promise(function(resolve, reject) {
    axios.get(PI_API_URL + '/teams/')
      .then(function (response) {
        for (var team of response.data.data) {
          var team_and_location = `${team.board_position}. ${team.name}`
          result.push({label:team_and_location, value:team.name});
        }
        
        result.sort(function(a, b) {
          var loc1 = (Number)(a.label.split('.')[0]);
          var loc2 = (Number)(b.label.split('.')[0]);
          if (loc1 < loc2) {
            return -1;
          }
          if (loc1 > loc2) {
            return 1;
          }
          return 0;
        });
 
        resolve({options: result});
      }).catch(function (error) {
          console.log(error);
          reject(error);
    });
  });
}
function arrayRemove(arr, value) {
  return arr.filter(function(ele){
      return ele != value;
  });
}
module.exports.getOpenBoardPositions = async function() {
  var available_positions = [];
  var result = [];
  for (var a = 0; a < 20; a++) {  //initialize board positions
    available_positions[a] = a;
  }
  return new Promise(function(resolve, reject) {
    axios.get(PI_API_URL + '/teams/')
      .then(function (response) {
        for (var team of response.data.data) {  //get taken board positions
          available_positions = arrayRemove(available_positions, team.board_position);
        }
        resolve(available_positions);
      }).catch(function (error) {
          console.log(error);
          reject(error);
    });
  });
}
module.exports.getTeamByID = async function(team_id) {
  var result = [];
  return new Promise(function(resolve, reject) {
    axios.get(PI_API_URL + `/teams/${team_id}`)
      .then(function (response) {
        resolve(response.data);
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
          result.push({team:team.name, status:team.status, location:team.location});
        }
        resolve({teams: result});
      }).catch(function (error) {
          console.log(error);
          reject(error);
    });
  });
}

module.exports.createTeam = async function(team_name, location, board_position) {
  return new Promise(function(resolve, reject) {
    axios.post(PI_API_URL + '/teams/', 
    {
      name: team_name,
      location: location,
      board_position: board_position
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
        resolve("user already exists");
    });
  });
}

module.exports.addUserToTeam = async function(user, team) {
  await this.addUserToDB(user);
  console.log("ASDASDASDASD");
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

module.exports.updateTeamPosition = async function(team, position) {
  return new Promise(function(resolve, reject) {
    axios.patch(`${PI_API_URL}/teams/${team}`,{
      board_position:position
    }).then(function (response) {
        resolve('success');
    }).catch(function (error) {
        reject(error.data);
    });
  });
}

module.exports.getMyTeamNames = async function(user_id) {
  return new Promise(function(resolve, reject) {
    axios.get(`${PI_API_URL}/users/${user_id}`)
    .then(function (response) {
      let teamNames = [];
      if (response.data.data.teams.length < 1) {
        resolve('error');
      }
      else {
        for (team of response.data.data.teams) {
          teamNames.push(`\`${team.name}\`\n`);
        }
        resolve(teamNames)
      }
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