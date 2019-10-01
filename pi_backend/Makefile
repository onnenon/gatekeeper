run: 
	flask run --host=0.0.0.0 --port=8000

clean:
	find . -name '*.pyc' -exec rm '{}' ';'
	find . -name '__pycache__' -type d -prune -exec rm -rf '{}' '+'
	find . -name '.pytest_cache' -type d -prune -exec rm -rf '{}' '+'

scrub: clean
	find . -name '*.egg-info' -type d -prune -exec rm -rf '{}' '+'
	rm -rf htmlcov
	rm -f .coverage

dbup:
	docker run --rm -d \
		--name test-db \
		-p 5432:5432 \
		-e "POSTGRES_USER=admin" \
		-e "POSTGRES_PASSWORD=pass" \
		-e "POSTGRES_DB=gate_db" \
		postgres:9.6-alpine

dbdown:
	docker kill test-db

format:
	isort -rc gatekeeper tests
	black gatekeeper tests

test:
	python3 -m coverage run --source gatekeeper -m pytest tests -p no:warnings

run-prod:
	gunicorn -w 1 -b "0.0.0.0:8000" gatekeeper:app

review: format test
