require('dotenv').config();
const { DB_PASS, DB_NAME, DB_HOST, DB_CLIENT, DB_USER } = process.env;

const express = require('express');
const knex = require('knex');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

// const db = knex({
//     client: DB_CLIENT,
//     connection: {
//         host: DB_HOST,
//         user: DB_USER,
//         password: DB_PASS,
//         database: DB_NAME,
//     },
// });
// db.select('*')
//     .from('users')
//     .then((data) => {
//         console.log(data);
//     });

const db = {
    users: [{
            id: 1,
            name: 'john',
            email: 'john@gmail.com',
            password: 'john',
        },
        {
            id: 2,
            name: 'joey',
            email: 'joey@gmail.com',
            password: 'joey',
        },
    ],
};

const books = [{
        id: 1,
        title: 'Smokey and the Bandit',
        author: 'Burt Reynolds',
        pages: 33,
        finished: true,
        email: 'john@gmail.com',
    },
    {
        id: 2,
        title: 'Smokey and the Bandit',
        author: 'Burt Reynolds',
        pages: 33,
        finished: false,
        email: 'joey@gmail.com',
    },
    {
        id: 3,
        title: 'Smokey and the Bandit',
        author: 'Burt Reynolds',
        pages: 233,
        finished: true,
        email: 'john@gmail.com',
    },
    {
        id: 4,
        title: 'Smokey and the Bandit',
        author: 'Burt Reynolds',
        pages: 33,
        finished: true,
        email: 'john@gmail.com',
    },
    {
        id: 5,
        title: 'Smokey and the Bandit',
        author: 'Burt Reynolds',
        pages: 353,
        finished: true,
        email: 'joey@gmail.com',
    },
    {
        id: 6,
        title: 'Smokey and the Bandit',
        author: 'Burt Reynolds',
        pages: 33,
        finished: true,
    },
    {
        id: 7,
        title: 'Smokey and the Bandit',
        author: 'Burt Reynolds',
        pages: 33,
        finished: true,
    },
    {
        id: 8,
        title: 'Smokey and the Bandit',
        author: 'Burt Reynolds',
        pages: 33,
        finished: true,
    },
];

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json('Server is working');
});

app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    console.log(email);
    if (email && password) {
        for (let i = 0; i < db.users.length; i++) {
            if (
                db.users[i].email == email &&
                db.users[i].password == password
            ) {
                res.json(db.users[i]);
            }
        }
    }
});

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        res.json('missing credentials');
    } else {
        db.users.push({
            id: 12,
            name: name,
            email: email,
            password: password,
            date: new Date(),
        });
    }
    res.json(db.users);
});

app.post('/library-item', (req, res) => {
    const { title, author, pages, finished } = req.body;
    console.log(books);
    console.log(title);
    books.push({
        id: 21,
        title: title,
        author: author,
        pages: pages,
        finished: finished,
    });
    res.json(books);
    console.log(books);
});

app.put('/library-item', (req, res) => {
    const { remove, update, id } = req.body;
    for (let i = 0; i < books.length; i++) {
        if (books[i].id === id) {
            if (remove) {
                res.json(books[i]);
                console.log(books[i].id);
                books.splice(i, 1);
                console.log('successfully remove book');
                console.log(books);
            } else if (update) {
                if (books[i].finished === true) {
                    books[i].finished = false;
                } else if (!books[i].finished) {
                    books[i].finished = true;
                }
                console.log(books[i]);
                res.json(books[i]);
            } else {
                res.json('error, something is wrong with code ');
            }
        }
    }
});

app.get('/library-item/:userId', (req, res) => {
    const userId = req.params.userId;
    const library = [];
    for (let i = 0; i < db.users.length; i++) {
        if (userId == db.users[i].id) {
            for (let j = 0; j < books.length; j++) {
                if (db.users[i].email == books[j].email) {
                    library.push(books[j]);
                }
            }
        }
    }
    res.json(library);
});

app.listen(4500, () => {
    console.log('Server Is Running!');
});