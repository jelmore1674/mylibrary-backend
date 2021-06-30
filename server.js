require('dotenv').config();
const { DB_PASS, DB_NAME, DB_HOST, DB_CLIENT, DB_USER } = process.env;

const express = require('express');
const knex = require('knex');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

const db = knex({
    client: DB_CLIENT,
    connection: {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
    },
});

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json('Server is working');
});

app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        db.select('*')
            .from('login')
            .then((users) => {
                for (let i = 0; i < users.length; i++) {
                    const match = bcrypt.compare(password, users[i].hash);
                    if (match) {
                        return db
                            .select('*')
                            .from('users')
                            .where('email', email)
                            .then((user) => {
                                res.json(user);
                            });
                    }
                }
            });
    }
});

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        res.json('missing credentials');
    } else {
        bcrypt.hash(password, 10, function(err, hash) {
            db('login')
                .insert({
                    hash: hash,
                    email: email,
                })
                .returning('email')
                .then((loginEmail) => {
                    db('users')
                        .returning('*')
                        .insert({
                            email: loginEmail[0],
                            name: name,
                        })
                        .then((user) => {
                            console.log(user[0]);
                            res.json(user[0]);
                        });
                })
                .catch((err) => res.status(400).json('unable to register'));
        });
    }
});

app.post('/library-item', (req, res) => {
    const { title, author, pages, completed, userid, email } = req.body;

    db('library')
        .insert({
            userid: userid,
            title: title,
            author: author,
            pages: pages,
            completed: completed,
            email: email,
        })
        .into('library')
        .returning('library')
        .catch(() => res.json('cannot updated'));
});

app.put('/library-item', (req, res) => {
    const { remove, update, id, completed } = req.body;

    db.select('*')
        .from('library')
        .where('id', id)
        .update({ completed: completed });

    if (remove) {
        db('library')
            .del()
            .where('id', id)
            .then((data) => {
                db('library')
                    .select('*')
                    .then((data) => res.json(data));
            });
    }
});

app.get('/library-item/:userId', (req, res) => {
    const userId = req.params.userId;

    db.select('*')
        .from('library')
        .where('userid', '=', userId)
        .then((data) => {
            res.json(data);
        });
});

app.listen(4500, () => {
    console.log('Server Is Running!');
});