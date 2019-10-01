# Slack API
This project is setup in the following way:
Node 10

# Structure
This section of the project is used to handle events from slack. The project then communicates with the Raspberry PI's flask api.

- Routes: endpoints for slack webhooks
- verifySiganture: used to handle slack signing

- Controllers:
  - commandsController: Parses event commands from slack
  - messageController: Builds modals and sends messages to users
  - interactionsControllers: Handles callbacks from the modals
- Services:
  - teamService: Handles api requests to the Raspberry PI
  - slackService: Only works to resolve slack usernames from slack user IDs
 
# Requires the following environment variables

- SLACK_ACCESS_TOKEN=
- SLACK_USER_TOKEN=
- SLACK_SIGNING_SECRET=
- SLACK_API_URL=https://slack.com/api
- PI_API_URL=
