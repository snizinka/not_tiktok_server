const config = require('../../dbConfig');
const util = require('util');
const User = require('./User');
const query = util.promisify(config.query).bind(config)

class GetUserById extends User {
    static async getUserData(id) {
        const profileQuery = `SELECT * FROM nottiktok.users as usr
        WHERE usr.userId = ${id}`

        const profile = await query(profileQuery)

        return profile[0]
    }
}

module.exports = GetUserById