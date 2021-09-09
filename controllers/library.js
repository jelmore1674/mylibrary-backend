const libraryModel = require('../models/library');
const userModel = require('../models/users');

module.exports = {
    addToLibrary: async(req, res) => {
        // Destruct the Request Object
        const { title, author, pages, completed, userid, email } = req.body;
        const newBook = {
            userid: userid,
            title: title,
            author: author,
            pages: pages,
            completed: completed,
            email: email,
        };
        // Insert into the databse
        try {
            const addBook = await libraryModel.addBook(newBook);
            if (addBook === 'Success') {
                res.status(201).json('success');
            }
        } catch (err) {
            res.status(401).json(err);
        }
    },

    updateLibrary: async(req, res) => {
        // Destruct the Request Object
        const { remove, update, id, completed } = req.body;
        // Checks for remove
        if (remove) {
            try {
                const removedBook = await libraryModel.removeBook(id);
                res.status(202).json(removedBook);
            } catch (err) {
                res.status(400).json(err);
            }
        } // Checks for update of book finished status
        else if (update) {
            try {
                const updatedBook = await libraryModel.updateCompletedStatus(
                    id,
                    completed
                );
                res.status(202).json(updatedBook);
            } catch (err) {
                res.status(406).json(err);
            }
        }
    },

    displayLibrary: async(req, res, db) => {
        // Destruct the Request Object
        const userId = req.params.userId;
        // API, Queries Database, returning all books for user
        const user = await userModel.getUserByID(userId);
        const library = await libraryModel.getLibrary(user);
        res.json(library);
    },
};