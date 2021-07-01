require('dotenv').config();
// Destruct process.env
const { DB_PASS, DB_NAME, DB_HOST, DB_CLIENT, DB_USER } = process.env;
// Import node libraries
const express = require('express');
const knex = require('knex');
const cors = require('cors');
const bcrypt = require('bcrypt');
// Import Controllers
const signin = require('./controllers/signin');
const register = require('./controllers/register');
const library = require('./controllers/library');

const app = express();
// Connect to DB
const db = knex({
    client: DB_CLIENT,
    connection: {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
    },
});
// Req Obj as JSON, add CORS
app.use(express.json());
app.use(cors());
// To see if server is working
app.get('/', (req, res) => {
    res.json('Server is working');
});
// Signin, Logic is in Signin Controller
app.post('/signin', (req, res) => {
    signin.handleSignin(req, res, bcrypt, db);
});
// Register, Logic is in Register Controller
app.post('/register', (req, res) => {
    register.handleRegister(req, res, bcrypt, db);
});
// Add Book to library, Logic is in Library Controller
app.post('/library-item', (req, res) => {
    library.addToLibrary(req, res, db);
});
// Updated Library Items, Logic is in Library Controller
app.put('/library-item', (req, res) => {
    library.updateLibrary(req, res, db);
});
// API that displays books in library based on userid, Logic is in Library Controller
app.get('/library-item/:userId', (req, res) => {
    library.displayLibrary(req, res, db);
});

app.listen(process.env.PORT || 4500, () => {
    console.log('Server Is Running!');
});