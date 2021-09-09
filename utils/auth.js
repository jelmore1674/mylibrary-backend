const bcrypt = require('bcrypt');
const userModel = require('../models/users');
module.exports = {
    userSignin: async(email, password) => {
        try {
            if (!email || !password) {
                return Promise.reject('incorrect form submission');
            }
            const data = await userModel.getUserHashByEmail(email);
            if (data) {
                const isValid = await bcrypt.compareSync(password, data.hash);
                if (isValid) {
                    const user = await userModel.getUserByEmail(email);
                    return user;
                }
            }
        } catch (err) {
            console.log(err);
        }
    },
};