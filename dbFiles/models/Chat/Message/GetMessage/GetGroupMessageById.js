const Message = require("../Message");
const config = require('../../../../dbConfig');
const util = require('util');
const User = require("../../../User/User");
const query = util.promisify(config.query).bind(config)

class GetGroupMessageById extends Message {
    static async getMessages(messageId) {
        let messages = await query("SELECT msgs.messageId, msgs.seen, msgs.chatId as contactId, msgs.message, msgs.deliveryTime, msgs.authorId, msgs.forwarded_from, msgs.forward_chat " +
            "FROM nottiktok.groupmessages as msgs " +
            "WHERE msgs.messageId = " + messageId)

        if (messages.length > 0) {
            let messageAuthor = new User(messages[0].authorId)
            await messageAuthor.fetchUserData()

            let message = new Message(
                messages[0].messageId,
                messages[0].contactId,
                messages[0].message,
                messages[0].deliveryTime,
                messageAuthor,
                [],
                messages[0].forwarded_from,
                messages[0].forward_chat,
                messages[0].seen
                )
            return message
        } else {
            return
        }
    }
}

module.exports = GetGroupMessageById