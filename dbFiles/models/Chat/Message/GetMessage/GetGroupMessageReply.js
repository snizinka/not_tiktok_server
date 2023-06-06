const Message = require("../Message");
const config = require('../../../../dbConfig');
const util = require('util');
const GetGroupMessageById = require("./GetGroupMessageById");
const query = util.promisify(config.query).bind(config)

class GetGroupMessageReply extends Message {
    static async getMessageReplies(message) {
        let data = await query(`SELECT * FROM nottiktok.group_replies WHERE newmessageId = ${message.messageId}`)
        
        if (data.length > 0) {
            message.reply = await GetGroupMessageById.getMessages(data[0].replyId)
        } else {
            message.reply = {}
        }
        return message
    }
}

module.exports = GetGroupMessageReply