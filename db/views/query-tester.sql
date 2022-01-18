-- psql -f view-db-test-query.sql > view-db-dev-test-query.txt

\c nc_news_test

SELECT articles.*, COUNT(comments.comment_id) AS comment_count
FROM articles
LEFT OUTER JOIN comments ON articles.article_id = comments.article_id
GROUP BY articles.article_id
ORDER BY %I ASC
LIMIT 10;