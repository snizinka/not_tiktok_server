const Message = require("../Message");
const config = require('../../../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class DeletePrivateMessage extends Message {
    static async deleteMessage(messageId) {
        let removed = await query("DELETE FROM nottiktok.`chat-messages` WHERE `chat-messagesId` = " + messageId)

        return removed
    }
}

module.exports = DeletePrivateMessage