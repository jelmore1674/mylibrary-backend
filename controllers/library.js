const addToLibrary = (req, res, db) => {
    // Destruct the Request Object
    const { title, author, pages, completed, userid, email } = req.body;
    // Insert into the databse
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
};

const updateLibrary = (req, res, db) => {
    // Destruct the Request Object
    const { remove, update, id, completed } = req.body;
    // Checks for remove
    if (remove) {
        db('library')
            .del()
            .where('id', id)
            .then((data) => {
                db('library')
                    .select('*')
                    .then((data) => res.json(data));
            });
    } // Checks for update of book finished status
    else if (update) {
        db.select('*')
            .from('library')
            .where('id', id)
            .update({ completed: completed })
            .then((item) => {
                return;
            });
    }
};

const displayLibrary = (req, res, db) => {
    // Destruct the Request Object
    const userId = req.params.userId;
    // API, Queries Database, returning all books for user
    db.select('*')
        .from('library')
        .where('userid', '=', userId)
        .then((data) => {
            res.json(data);
        });
};

module.exports = {
    addToLibrary: addToLibrary,
    updateLibrary: updateLibrary,
    displayLibrary: displayLibrary,
};