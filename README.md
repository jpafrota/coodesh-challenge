# Free Dictionary

This is a full stack Free Dictionary app with API + Frontend.

## Implementation process

## Backend

Since I'm more of a backend-side dev, I started with it. I chose NestJS for its beautiful architecture that manages to even speed up the development process with the CLI and built-in decorators. 

### Database setup

In order to setup a mongodb database, I chose to go with Docker, since it cuts a lot of the pain and allows it to be replicated in other environments. I had some challenges with the .env files for the different repos and with the db. Pending to solve:

- Create a default non-root user when starting the db service. Without this, we have to manually create a user using the mongodb shell in the target database.
  - found a solution. yet to implement: https://stackoverflow.com/questions/34559557/how-to-enable-authentication-on-mongodb-through-docker
- Decide how the environment variables dynamic will work: how to make things secure while keeping the environments well separated and without too much cost to replicate?

### Endpoint/Modules skeleton

I added a few skeleton endpoints just to outline the overall features of the API, such as listing words, creating users, etc. 

### JWT Auth

I added JWT authentication following NestJS documentation, which used Passport.js behind the scenes:
https://docs.nestjs.com/security/authentication#jwt-token

### Importing words

I decided to use Node.js to import the words to the database, since I have more familiarity. I could have also used Python but I like JS more for these simple tasks! And the whole project is already configured in JS so yeah.

First, I needed to have the `words` collection's schema already in mind, so that I replicated that in the script's mongoose connection. 

I had to be careful here because if the models don't match, it would (probably - not sure) lead to inconsistencies in the db when I started the backend app.

Another point was that the `english.txt` had **multiple words** counting as a single one. I decided to just add them to the database regardless. But I excluded one-letter words and words that had any number/digit on it as I filtered/treated the words array.

After filtering/mapping the in-memory words array, I started processing it in batches of 1000 to not overload the db, using upsert.

Also, **since I treated/regexed a few words, some of them might have ended up being exact copies of existing ones**. So that's why I used **upsert**. 

There were more than 200000 words to process, but everything went just fine in the end.

### 

### Favoriting words

To favorite a word, I had to decide how to store it in the database. I had two main options:

1) For each user, keep a `favoriteWords` array that stores all favorite words as strings and the added date.
2) Have a separate table for favorite words, that would be a collection with objects in the format: { userId, word, added }

There is no need to store `wordId` since the word will hardly ever change its definition/ortography. So just word as string is fine.

The main problem with approach #1 is that it will not scale well. If user has many favorites it could become cumbersome to fetch for them.
Second approach provides more scalability at the cost of a lookup in the users table, but since it's indexed (would be O(logN)) it would not impact too much on performance. But if we had the need to do some aggregations in the future, it would benefit greatly!

Despite its problems, I decided to go with approach #1 for simplicity.


## Frontend



---- 

## Technologies used 

### Backend

- Yarn
- TypeScript
- Node.js
- NestJS
- Passport.js (auth)
- MongoDB / Mongoose

### Frontend

- TypeScript
- React
- Vite
- TailwindCSS

----

## What could be improved?

- Currently, the backend is tightly coupled to MongoDB. If we ever want to change databases, we would have trouble updating all services at once. I could have used the **Repository** pattern if I had more time.
- I would split core functionality into useCases that should be injected into controllers. This way, it would make testing a lot easier and would also allow mocking.
- We could implement cachin with redis to enhance the api's overall speed.

>  This is a challenge by [Coodesh](https://coodesh.com/)
