# Library App Backend

Link to Front End Repository

Link to Live Site

---

## About

This is the backend for the My Library app I created. The app has user
authentication using bcrypt. Stores and recalls the data from the database.

---

## Technologies

<img src='https://raw.githubusercontent.com/devicons/devicon/9f4f5cdb393299a81125eb5127929ea7bfe42889/icons/nodejs/nodejs-original-wordmark.svg' width="75px" style="background-color: white">
<img src='https://raw.githubusercontent.com/devicons/devicon/9f4f5cdb393299a81125eb5127929ea7bfe42889/icons/express/express-original-wordmark.svg' width="75px" style="background-color: white">
<img src='https://raw.githubusercontent.com/devicons/devicon/9f4f5cdb393299a81125eb5127929ea7bfe42889/icons/postgresql/postgresql-original-wordmark.svg' width="75px" style="background-color: white">

---

### Technical Bits

I used knex to connect to the PostgreSQL database. I have 3 different tables for
my database.

Users userid | name | email --- | --- | --- 1 | Justin | justin@justin.com

Login id | email | hash --- | --- | --- 1 | justin@justin.com | randomhash

Library id | email | title | author | pages | completed | userid --- | --- | ---
| --- | --- | --- | --- | 1 | justin@justin.com | Test Book | Justin Elmore | 34
| true | 1
