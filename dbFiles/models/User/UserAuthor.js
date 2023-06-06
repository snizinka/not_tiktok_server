const config = require('../../dbConfig');
const util = require('util');
const User = require('./User');
const query = util.promisify(config.query).bind(config)

class UserAuthor extends User {
    async getAmmountOfFollowes () {
        const amountOfFollowers = await query(`SELECT COUNT(*) as followers FROM nottiktok.follows as fs WHERE fs.userId = ${this.userId}`);

        return amountOfFollowers[0].followers;
    }

    async getAmmountOfFollowing () {
        const amountOfFollowing = await query(`SELECT COUNT(*) as following FROM nottiktok.follows as fs WHERE fs.followerId = ${this.userId}`)

        return amountOfFollowing[0].following;
    }
}

module.exports = UserAuthor;