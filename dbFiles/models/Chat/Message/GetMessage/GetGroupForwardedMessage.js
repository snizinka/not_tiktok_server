const Message = require("../Message");
const config = require('../../../../dbConfig');
const util = require('util');
const GetMessageById = require("./GetMessageById");
const GetGroupMessageById = require("./GetGroupMessageById");
const query = util.promisify(config.query).bind(config)

class GetGroupForwardedMessage extends Message {
    static async getMessages(message) {
        if(message.forwarded === 'Private') {
            message.forwarded = await GetMessageById.getMessages(message.forwarded_from)
        } else {
            message.forwarded = await GetGroupMessageById.getMessages(message.forwarded_from)
        }
        return message
    }
}

module.exports = GetGroupForwardedMessage