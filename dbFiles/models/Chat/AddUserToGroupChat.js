const Chat = require("./Chat");
const config = require('../../dbConfig');
const util = require('util');
const User = require("../User/User");
const query = util.promisify(config.query).bind(config)

class AddUserToGroupChat extends Chat {
    static async addUserToChat(data) {
        let addedUser = await query("INSERT INTO nottiktok.contactlink (chatId, userId) VALUES('" + data.chatId + "', '" + data.userId + "')")
        let groupUser = new User(data.userId)
        await groupUser.fetchUserData()

        return { user: groupUser }
    }
}

module.exports = AddUserToGroupChat