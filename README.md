# README

## Hosted Version

https://nc-be-news-project.herokuapp.com/api/

## API docs

https://nc-be-news-project.herokuapp.com/api-docs/

## Summary

Portfolio project for backend module of Northcoders Coding Bootcamp: https://northcoders.com/

- We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture. \*

== The minimum versions of Node.js and Postgres to run the project are: ==

- Node.js
- Postgres

## Instructions

- [x] Clone
- [ ] Install dependencies
- [ ] Create .env files
- [ ] Seed local database
- [ ] Run tests

### Clone

Clone down the repo using the following command:

git clone https://github.com/HarveyJRob/be-nc-news-public.git

### Install dependencies

- npm install

### Create .env files

Create two .env files in the top level directory:

- .env.dev
- .env.test

Into .env.dev add the line:
PGDATABASE=nc_news

Into .env.test add the line:
PGDATABASE=nc_news_test

Double check these .env files are .gitignored.

### Seed local database

- npm run setup-dbs
- npm run seed

### Run tests

- npm run test

## To do

- Improve swagger docs
- Best practice for gitignore
- Run tests automatically when pushed to github/heroku
- Full-text search
- User authentication, authorization & encryption
- version using async-await
- logging for production version
- Additional endpoints:
