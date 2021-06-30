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
            db.transaction((trx) => {
                trx.insert({
                        hash: hash,
                        email: email,
                    })
                    .into('login')
                    .returning('email')
                    .then((loginEmail) => {
                        return trx('users')
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
                    .then(trx.commit)
                    .catch(trx.rollback);
            }).catch((err) => res.status(400).json('unable to register'));
        });
    }
});

app.post('/library-item', (req, res) => {
    const { title, author, pages, completed, userid, email } = req.body;

    db.transaction((trx) => {
        trx.insert({
                userid: userid,
                title: title,
                author: author,
                pages: pages,
                completed: completed,
                email: email,
            })
            .into('library')
            .returning('library')
            .then(trx.commit)
            .catch(trx.rollback);
    }).catch((err) => res.json('cannot updated', err));
});

app.put('/library-item', (req, res) => {
    const { remove, update, id } = req.body;

    db.select('*').from('library').then(console.log);

    db.select('*')
        .from('library')
        .where('id', id)
        .then((book) => {
            if (update) {
                if (book[0].completed == true) {
                    return db
                        .transaction((trx) => {
                            trx.into('library')
                                .update('completed', false)
                                .where('id', '=', id);
                        })
                        .then(trx.commit)
                        .catch(trx.rollback);
                } else if (book[0].completed == false) {
                    return db
                        .transaction((trx) => {
                            trx.into('library')
                                .update('completed', false)
                                .where('id', '=', id);
                        })
                        .then(trx.commit)
                        .catch(trx.rollback);
                } else {
                    null;
                }
            } else if (remove) {
                db('library')
                    .del()
                    .where('id', id)
                    .then((data) => {
                        db('library')
                            .select('*')
                            .then((data) => console.log(data));
                    });
            } else {
                null;
            }
        })
        .catch(res.json('Unable to update library'));
});

app.get('/library-item/:userId', (req, res) => {
    const userId = req.params.userId;
    const demoEmail = 'demo@demo.com';
    db.transaction((trx) => {
        trx.del()
            .from('library')
            .where('email', '=', 'demo@demo.com')
            .then(trx.commit)
            .catch(trx.rollback);
    });

    db.select('*')
        .from('users')
        .where('email', '=', 'demo@demo.com')
        .then((user) =>
            db.transaction((trx) => {
                trx.insert([{
                            email: demoEmail,
                            title: 'Welcome To MyLibrary',
                            author: 'Justin Elmore',
                            pages: 23,
                            completed: true,
                            userid: user[0].userid,
                        },
                        {
                            email: demoEmail,
                            title: 'If you click the finished button',
                            author: 'It will change the status',
                            pages: 55,
                            completed: false,
                            userid: user[0].userid,
                        },
                        {
                            email: demoEmail,
                            title: 'To save history of books',
                            author: 'Create an Account!',
                            pages: 54,
                            completed: true,
                            userid: user[0].userid,
                        },
                    ])
                    .into('library')
                    .then(trx.commit)
                    .catch(trx.rollback);
            })
        );
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