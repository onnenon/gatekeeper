const commandsController = require('./controllers/commandsController');
const interactionsController = require('./controllers/interactionsController');
const teamService = require('./services/teamService');
let handleRoutes = function(app) {
    app.get('/', async (req, res) => {
        res.send(200);
    });
    
    app.get('/healthcheck', async (req, res) => {
        res.send(200);
    });

    app.post('/events', (req, res) => { //Parse '/' commands from slack
        commandsController.run(req, res);
    });

    app.post('/interactions', async (req, res) => { //Handles callback functions when someone submits a modal
        interactionsController.run(req, res);
    });

    app.post('/data', async (req, res) => { //Used for custom slack data for filling the teams in the modal dropdowns
        let teams = await teamService.getTeams();
        res.status(200).send(JSON.stringify(teams));
    });
}

module.exports.use = function(app) {
    handleRoutes(app);
}
