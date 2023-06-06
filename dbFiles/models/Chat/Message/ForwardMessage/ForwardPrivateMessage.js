const Message = require("../Message");
const config = require('../../../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class ForwardPrivateMessage extends Message {
    static async forwardMessage(message) {
        let added = await query("INSERT INTO nottiktok.`chat-messages` (authorId, contactId, forwarded_from, forward_chat) VALUES(" + message.author + ", " + message.chat + "," +  message.chatMode.message + ", '" + message.chatMode.from + "')");
        return added
    }
}

module.exports = ForwardPrivateMessage