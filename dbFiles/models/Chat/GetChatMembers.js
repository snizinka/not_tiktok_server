const Chat = require("./Chat");
const config = require('../../dbConfig');
const util = require('util');
const User = require("../User/User");
const query = util.promisify(config.query).bind(config)

class GetChatMembers extends Chat {
    static async getChatMembers(chatId) {
        let addedUser = await query(`SELECT chat.userId FROM nottiktok.contactlink as chat WHERE chat.chatId = ${chatId}`)
        let groupUsers = []

        for (const newUser of addedUser) {
            let user = new User(newUser.userId)
            await user.fetchUserData()
            groupUsers.push(user)
        }

        return { members: groupUsers }
    }
}

module.exports = GetChatMembers