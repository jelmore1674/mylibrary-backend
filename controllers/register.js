const handleRegister = (req, res, bcrypt, db) => {
    // Destruct the Request object
    const { email, name, password } = req.body;
    // If missing crediential, return missing credientials
    if (!email || !name || !password) {
        res.json('missing credentials');
    } else {
        res.json({
            email,
            password,
            name,
        });
        // hash the password
        bcrypt.hash(password, 10, function(err, hash) {
            // Insert into the login table of the database
            db('login')
                .insert({
                    hash: hash,
                    email: email,
                })
                .returning('email')
                .then((loginEmail) => {
                    // Insert into the users table of the database
                    db('users')
                        .returning('*')
                        .insert({
                            email: loginEmail[0],
                            name: name,
                        })
                        .then((user) => {
                            // Create Default library
                            db.insert([{
                                        userid: user[0].userid,
                                        email: user[0].email,
                                        title: 'Welcome to Your Library',
                                        author: 'Created by Justin Elmore',
                                        pages: 3,
                                        completed: true,
                                    },
                                    {
                                        userid: user[0].userid,
                                        email: user[0].email,
                                        title: 'If you click the finished button',
                                        author: 'It will change the status',
                                        pages: 55,
                                        completed: false,
                                    },
                                    {
                                        userid: user[0].userid,
                                        email: user[0].email,
                                        title: 'To save history of books',
                                        author: 'Create an Account!',
                                        pages: 35,
                                        completed: true,
                                    },
                                ])
                                .into('library')
                                .then(() => {
                                    console.log('added');
                                });
                            // Return User
                            res.json(user[0]);
                        });
                })
                .catch((err) => res.status(400).json('unable to register'));
        });
    }
};

module.exports = {
    handleRegister: handleRegister,
};