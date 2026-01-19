# Start services
up:
	docker-compose up -d

# Wait until postgres is healthy
wait:
	until [ $$(docker inspect --format='{{.State.Health.Status}}' to_do_db) = "healthy" ] && \
	      [ $$(docker inspect --format='{{.State.Health.Status}}' to_do_db_two) = "healthy" ]; do \
		echo "Waiting for databases..."; \
		sleep 2; \
	done; \
	echo "Both databases are healthy!"

# Stop services
down:
	docker-compose down

# Start and wait
start: up wait
