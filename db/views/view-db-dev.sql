-- psql -f view-db-dev.sql > view-db-dev.txt

\c nc_news

SELECT * FROM topics;

SELECT * FROM users;

SELECT * FROM user_pwds;

SELECT * FROM articles;

SELECT * FROM comments;