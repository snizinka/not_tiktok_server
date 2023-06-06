const config = require('../../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class Message {
    constructor(messageId, contactId, message, deliveryTime, user, reply = [], forwarded_from, forwarded = {}, forward_chat = '', seen) {
        this.messageId = messageId,
            this.contactId = contactId,
            this.message = message,
            this.deliveryTime = deliveryTime,
            this.user = user,
            this.reply = reply,
            this.forwarded_from = forwarded_from,
            this.forward_chat = forward_chat,
            this.forwarded = forwarded,
            this.seen = seen
    }

    static async getMessages(parameter) { }

    static async addMessage(message) { }

    static async replyToMessage(message) { }

    static async deleteMessage(messageId) { }

    static async editMessage(message) { }

    static async forwardMessage(messageId) { }
}

module.exports = Message