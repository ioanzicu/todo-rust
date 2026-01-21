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


###################################
# 			FRONTEND			  #
###################################

backend-up:
	cd backend/ && cargo run

react-dev:
	cd frontend/ && npm run dev


electron-dev:
	cd backend && cargo run &     # background
	cd frontend && npm run dev &  # background
	sleep 1
	cd frontend && npm run electron:dev


electron-prod: backend-up
	cd backend && cargo run &     # background
	cd frontend && npm run dev &  # background
	sleep 1
	cd frontend && npm run electron:prod


