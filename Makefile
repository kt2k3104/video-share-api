db_create_migration:
	docker exec video-share-api yarn migration:create src/migrations/$(name)

db_run_migration:
	docker exec video-share-api yarn migration:run

db_revert_migration:
	docker exec video-share-api yarn migration:revert