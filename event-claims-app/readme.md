
### Replace your_username with your PostgreSQL username, your_database with the name of your database, and path/to/reset_schema.sql with the path to your reset_schema.sql file.

## 1. Create your own .env file for example 
- PGHOST=localhost
- PGUSER=development
- PGDATABASE=task_nex
- PGPASSWORD=development

## 2. Install dependencies: npm i

## 3. run node taskServer.js on your terminal 

## 4. Reset database. Open your terminal and use the following command to execute the reset_schema.sql script file.

- psql -U your_username -d your_database -f path/to/reset_schema.sql