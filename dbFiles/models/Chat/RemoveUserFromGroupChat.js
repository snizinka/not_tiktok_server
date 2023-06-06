const Chat = require("./Chat");
const config = require('../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class RemoveUserFromGroupChat extends Chat {
    static async removeUserFromChat(data) {
        let remove = await query(`DELETE FROM nottiktok.contactlink WHERE userId = ${data.userId} AND chatId = ${data.chatId}`)
        if (remove.affectedRows === 1) {
            return data.userId
        } else {
            return null
        }
    }
}

module.exports = RemoveUserFromGroupChat