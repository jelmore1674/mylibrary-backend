require('dotenv').config();
const express = require('express');
const knex = require('knex');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

app.get('/', (req, res) => {
    res.json('Server is working');
});

app.post('/signin', (req, res) => {});
app.post('/register', (req, res) => {});
app.put('/library-item', (req, res) => {});

app.get('/library-item', (req, res) => {});

app.listen(4500, () => {
    console.log('Server Is Running!');
});