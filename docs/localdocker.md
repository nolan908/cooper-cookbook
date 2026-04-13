1. cd /Users/nolangriffith/Desktop/ECE366
2. docker run --name cookbook-db \
  -e POSTGRES_PASSWORD=password123 \
  -e POSTGRES_DB=cookbook_db \
  -e POSTGRES_USER=postgres \
  -p 5432:5432 \
  -d postgres
3. set up connection on DBeaver; use docker ps to sanity check
4. use docker desktop to stop container or use docker stop cookbook-db
