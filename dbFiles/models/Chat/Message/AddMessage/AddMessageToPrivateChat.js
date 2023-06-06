const Message = require("../Message");
const config = require('../../../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class AddMessageToPrivateChat extends Message {
    static async addMessage(message) {
        const formattedMessage = message.message.replace(/["\\]/g, (match) => {
            if (match === '"') {
                return '""'
            } else {
                return '\\\\'
            }
        })
        const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
        let added = await query("INSERT INTO nottiktok.`chat-messages` (authorId, contactId, message, deliveryTime) VALUES" + `(${message.author}, ${message.chat}, "${formattedMessage}", "${currentTime}")`);
        return added
    }
}

module.exports = AddMessageToPrivateChat