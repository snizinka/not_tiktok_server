const config = require('../../dbConfig');
const util = require('util');
const User = require('./User');
const StringConverter = require('../Hooks/StringConverter');
const query = util.promisify(config.query).bind(config)

class GetUserByUsername extends User {
    static async getUserData(username) {
        const profileQuery = `SELECT * FROM nottiktok.users as usr
        WHERE usr.username LIKE '%${StringConverter.convertStringToSQL(username)}%'`

        const profile = await query(profileQuery)

        return profile
    }
}

module.exports = GetUserByUsername