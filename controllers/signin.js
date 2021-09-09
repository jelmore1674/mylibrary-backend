// Import models
const libraryModel = require('../models/library');
const auth = require('../utils/auth');

module.exports = {
    handleSignin: async(req, res) => {
        // Destruct the Request Object
        const { email, password } = req.body;

        // Check for email and password
        if (!email || !password) {
            res.status(401).json('Invalid User Credentials');
        } else if (email && password) {
            // Query database for match
            await libraryModel.deleteDemoLibrary();
            await libraryModel.createDemoLibrary(64);
            const user = await auth.userSignin(email, password);
            res.json(user);
        }
    },
};