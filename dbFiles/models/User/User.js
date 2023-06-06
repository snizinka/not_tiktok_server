const config = require('../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class User {
    constructor(userId) {
        this.userId = userId
        this.username = ''
        this.userLink = ''
        this.userImage = ''
    }

    async fetchUserData () {
        const user = await query(`SELECT * FROM nottiktok.users as us WHERE us.userId = ${this.userId}`)
        this.username = user[0].username
        this.userLink = user[0].userLink
        this.userImage = user[0].userImage
    }

    static async getUserData (data) { }

    static async fetchProfileSettings (data) { }

    static async checkUnique (data) { }

    static async editProfile (data) { }
}

module.exports = User;