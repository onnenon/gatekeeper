## SAI-GATEKEEPER
The slack_api portion of this project is built and deployed with CodePipeline and CodeBuild. For deploying to production, manual approval in CodePipeline/Slack (#cicd-notifications) is required.

You can view the pipeline here (log into aws shared account first): https://console.aws.amazon.com/codesuite/codepipeline/pipelines/sai-gatekeeper-pipeline/view



## Dependencies

- Python3-devel or Python3-dev
- Python3 >= 3.6
- GCC

## Getting Started

Create a python virtual environment with `python3 -m venv {venv name}`

Activate the virtual environment `source ${VENV_DIR}/bin/activate`

Install poetry with pip `pip install poetry`

Install all dependencies with poetry `poetry install`

Set necessary Environment:

```
export FLASK_APP=gatekeeper
export FLASK_ENV=development
```
