# Free Dictionary

This is a full stack Free Dictionary app with API + Frontend.

## Implementation process

### Backend

Since I'm more of a backend-side dev, I started with it. I chose NestJS for its beautiful architecture that manages to even speed up the development process with the CLI and built-in decorators. 

### Database setup

In order to setup a mongodb database, I chose to go with Docker, since it cuts a lot of the pain and allows it to be replicated in other environments. I had some challenges with the .env files for the different repos and with the db. Pending to solve:

- Create a default non-root user when starting the db service. Without this, we have to manually create a user using the mongodb shell in the target database.
  - found a solution. yet to implement: https://stackoverflow.com/questions/34559557/how-to-enable-authentication-on-mongodb-through-docker
- Decide how the environment variables dynamic will work: how to make things secure while keeping the environments well separated and without too much cost to replicate?

### Requirements gathering


## Technologies used 

### Backend

- Yarn
- NestJS
- Node.js
- TypeScript
- MongoDB
- Redis (cache)

### Frontend

- 

----

>  This is a challenge by [Coodesh](https://coodesh.com/)
