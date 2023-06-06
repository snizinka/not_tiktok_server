const config = require('../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class User {
    constructor(userId, username, userLink, userImage) {
        this.userId = userId;
        this.username = username;
        this.userLink = userLink;
        this.userImage = userImage;
    }

    static async getUser(userId) {
        const user = await query(`SELECT * FROM nottiktok.users as us WHERE us.userId = ${userId}`);

        return new User(user[0].userId, user[0].username, user[0].userLink, user[0].userImage);
    }
}

module.exports = User;