const handleSignin = (req, res, bcrypt, db) => {
    // Destruct the Request Object
    const { email, password } = req.body;
    // Check for email and password
    if (email && password) {
        // Query database for match
        db('library')
            .del()
            .where('email', '=', 'demo@demo.com')
            .then(
                db
                .insert([{
                        userid: 1,
                        email: 'demo@demo.com',
                        title: 'Welcome to Your Library',
                        author: 'Created by Justin Elmore',
                        pages: 3,
                        completed: true,
                    },
                    {
                        userid: 1,
                        email: 'demo@demo.com',
                        title: 'If you click the finished button',
                        author: 'It will change the status',
                        pages: 55,
                        completed: false,
                    },
                    {
                        userid: 1,
                        email: 'demo@demo.com',
                        title: 'To save history of books',
                        author: 'Create an Account!',
                        pages: 35,
                        completed: true,
                    },
                ])
                .into('library')
                .then(() => {
                    console.log('added');
                })
            )
            .then(
                db
                .select('*')
                .from('users')
                .then((users) => {
                    for (let i = 0; i < users.length; i++) {
                        // if a match compare hashes
                        const match = bcrypt.compare(
                            password,
                            users[i].hash
                        );
                        // if match return user
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
                })
            );
    }
};

module.exports = {
    handleSignin: handleSignin,
};