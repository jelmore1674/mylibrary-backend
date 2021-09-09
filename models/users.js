const bcrypt = require('bcrypt');

const db = require('./knex').db;

module.exports = {
    createNewUser: async(email, password, name) => {
        const hash = await bcrypt.hashSync(password, 10);
        try {
            const registerUser = await db.transaction(async(trx) => {
                const loginEmail = await trx
                    .insert({
                        hash: hash,
                        email: email,
                    })
                    .into('login')
                    .returning('email')
                    .transacting(trx);
                const newUser = await trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                    })
                    .transacting(trx);
                return newUser[0];
            });

            return registerUser;
        } catch (err) {
            return err;
        }
    },
    getUserByEmail: async(email) => {
        const user = await db.select('*').from('users').where('email', email);
        return user[0];
    },
    getUserHashByEmail: async(email) => {
        const user = await db('login')
            .select('email', 'hash')
            .where('email', '=', email);
        return user[0];
    },
    getUserByID: async(userId) => {
        const user = await db
            .select('email')
            .from('users')
            .where('userid', '=', userId);
        return user[0];
    },
};