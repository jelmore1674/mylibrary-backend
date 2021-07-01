const handleSignin = (req, res, bcrypt, db) => {
    // Destruct the Request Object
    const { email, password } = req.body;
    // Check for email and password
    if (email && password) {
        // Query database for match
        db.select('*')
            .from('login')
            .then((users) => {
                for (let i = 0; i < users.length; i++) {
                    // if a match compare hashes
                    const match = bcrypt.compare(password, users[i].hash);
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
            });
    }
};

module.exports = {
    handleSignin: handleSignin,
};