const config = require('../../dbConfig');
const util = require('util');
const User = require('./User');
const query = util.promisify(config.query).bind(config)

class CheckUserPassword extends User {
    static async checkUnique (data) {
        const checkUserLinkQuery = `SELECT * FROM nottiktok.users 
        WHERE password = '${data.password}' AND userId = ${data.userId}`

        const checkUserLink = await query(checkUserLinkQuery)

        return checkUserLink.length === 0
    }
}

module.exports = CheckUserPassword