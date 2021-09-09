const userModel = require('../models/users');
const libraryModel = require('../models/library');

module.exports = {
    handleRegister: async(req, res) => {
        // Destruct the Request object
        const { email, name, password } = req.body;
        // If missing crediential, return missing credientials
        try {
            if (!email || !name || !password) {
                res.status(401).json('missing credentials');
            } else {
                // Create New User
                const user = await userModel.createNewUser(
                    email,
                    password,
                    name
                );
                // Create Default library
                await libraryModel.createDefaultLibrary(user);
                // Return User
                res.status(201).json(user);
            }
        } catch (err) {
            res.status(400).json(err);
        }
    },
};