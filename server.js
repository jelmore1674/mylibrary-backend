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
                    if (users[i].email == email && users[i].hash == password) {
                        return db
                            .select('*')
                            .from('users')
                            .where('email', '=', email)
                            .then((user) => res.json(user));
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
        db('users')
            .select('*')
            .insert({
                name: name,
                email: email,
            })
            .then((data) => {
                console.log(data);
            });
        console.log('added user');
        db('login')
            .select('*')
            .insert({
                email: email,
                hash: password,
            })
            .then((user) => console.log(user));
    }
    db('users')
        .select('*')
        .then((users) => res.json(users));
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
        .then((data) => {
            console.log(data);
        });
});

app.put('/library-item', (req, res) => {
    const { remove, update, id } = req.body;
    db.select('*')
        .from('library')
        .where('id', '=', id)
        .then((book) => {
            console.log(book[0].completed);
            if (update) {
                if (book[0].completed == true) {
                    return db('library')
                        .update('completed', false)
                        .where('id', '=', id);
                } else if (book[0].completed == false) {
                    return db('library')
                        .update('completed', true)
                        .where('id', '=', id);
                }
            }
        });
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