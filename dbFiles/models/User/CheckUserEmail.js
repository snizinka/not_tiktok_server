const config = require('../../dbConfig');
const util = require('util');
const User = require('./User');
const query = util.promisify(config.query).bind(config)

class CheckUserEmail extends User {
    static async checkUnique (data) {
        const checkMailAddressQuery = `SELECT * FROM nottiktok.users WHERE mailAddress = '${data.mailAddress}' AND userId != ${data.userId}`

        const mailAddress = await query(checkMailAddressQuery)

        return mailAddress.length > 0
    }
}

module.exports = CheckUserEmail