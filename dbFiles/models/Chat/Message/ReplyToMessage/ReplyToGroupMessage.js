const Message = require("../Message");
const config = require('../../../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class ReplyToGroupMessage extends Message {
    static async replyToMessage(message) {
        let reply = await query(`INSERT INTO nottiktok.group_replies (newmessageId, replyId) VALUES(${message.message.messageId}, ${message.chatMode.message.messageId})`)
        message.message.message_repliesId = reply.insertId
        message.message.newmessageId = message.message.messageId
        message.message.replyId = message.chatMode.message.messageId

        return message.message
    }
}

module.exports = ReplyToGroupMessage