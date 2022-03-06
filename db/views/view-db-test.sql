-- psql -f view-db-test.sql > view-db-dev-test.txt

\c nc_news_test

SELECT * FROM topics;

SELECT * FROM users;

SELECT * FROM user_pwds;

SELECT * FROM articles;

SELECT * FROM comments;