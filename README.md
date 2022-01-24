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
- Full-text search
- User authentication, authorization & encryption
- version using async-await
- logging for production version
- Additional endpoints:

### Easier

- [ ] Patch: Edit an article body
- [ ] Patch: Edit a comment body
- [ ] Patch: Edit a user's information
- [ ] Get: Search for an article by title
- [ ] Post: add a new user

### Harder

- [ ] Protect your endpoints with JWT authorization. We have notes on this that will help a bit, _but it will make building the front end of your site a little bit more difficult_
- [ ] Get: Add functionality to get articles created in last 10 minutes
- [ ] Get: Get all articles that have been liked by a user. This will require an additional junction table.
- [ ] Research and implement online image storage or random generation of images for topics
