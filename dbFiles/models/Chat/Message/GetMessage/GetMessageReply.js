const Message = require("../Message");
const config = require('../../../../dbConfig');
const util = require('util');
const GetMessageById = require("./GetMessageById");
const query = util.promisify(config.query).bind(config)

class GetMessageReply extends Message {
    static async getMessageReplies(message) {
        let data = await query(`SELECT * FROM nottiktok.message_replies WHERE newmessageId = ${message.messageId}`);
        
        if (data.length > 0) {
            message.reply = await GetMessageById.getMessages(data[0].replyId)
        } else {
            message.reply = {}
        }
        return message
    }
}

module.exports = GetMessageReply