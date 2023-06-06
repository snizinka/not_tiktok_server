const Message = require("../Message");
const config = require('../../../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class EditPrivateMessageStatus extends Message {
    static async editMessage(messageId) {
        let edited = await query("UPDATE nottiktok.`chat-messages` SET " + `seen = 1 WHERE `+ "`chat-messagesId` = " + `${messageId}`)
        return edited
    }
}

module.exports = EditPrivateMessageStatus