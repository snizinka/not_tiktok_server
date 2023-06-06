const config = require('../../dbConfig');
const util = require('util');
const User = require('./User');
const query = util.promisify(config.query).bind(config)

class GetProfile extends User {
    static async fetchProfileSettings (userId) {
        const profileQuery = `SELECT * FROM nottiktok.users as usr
        JOIN nottiktok.profile_settings as pr_set ON pr_set.user_id = usr.userId
        WHERE usr.userId = ${userId}`

        const profile = await query(profileQuery)

        return profile[0]
    }
}

module.exports = GetProfile;