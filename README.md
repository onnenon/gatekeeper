## SAI-GATEKEEPER

The slack_api portion of this project is built and deployed with CodePipeline and CodeBuild. For deploying to production, manual approval in CodePipeline/Slack (#cicd-notifications) is required.

You can view the pipeline here (log into aws shared account first): https://console.aws.amazon.com/codesuite/codepipeline/pipelines/sai-gatekeeper-pipeline/view

## Dependencies

- Python3-devel or Python3-dev
- Python3 >= 3.6
- GCC

## Getting Started

### Setting up the Pi Backend

Change to the pi_backend directory: `cd pi_backend`

Create a python virtual environment with `python3 -m venv {venv name}`

Activate the virtual environment `source ${VENV_DIR}/bin/activate`

Install poetry with pip `pip install poetry`

Install all dependencies with poetry `poetry install`

When running the pi backend on a device that isn't a raspberry pi, some pips will fail to install, which is ok.

Set necessary Environment:

```
export FLASK_APP=gatekeeper
export FLASK_ENV=development
```

if running on a dev board set the USE_BOARD environment variable to any value:

```
export USE_BOARD=true
```

### Running the Pi Backend Locally

The simplest way to have a fully functioning backend is to have docker installed on the dev machine.

With docker installed, bring up the database: `make dbup`

Start the Flask dev server: `make run`

You can now access the Flask backend running on your local machine at `0.0.0.0:8000/status`.

When done, bring the database down with `make dbdown`

### Setting up Slack

See [this page](https://github.com/sourceallies/sai-gatekeeper/wiki/Slack-API-Deployment-Instructions) for instructions on how to setup and deploy the Slack API. 

## Contributing

Github users in the "All Teammates" team have Write access to this repository. The `master` branch is protected, and requires a PR with at least one approving review to merge.
