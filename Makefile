db_create_migration:
	docker exec e-commerce-api yarn migration:create src/migrations/$(name)

db_run_migration:
	docker exec e-commerce-api yarn migration:run

db_revert_migration:
	docker exec e-commerce-api yarn migration:revert