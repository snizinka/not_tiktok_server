const Message = require("../Message")
const config = require('../../../../dbConfig')
const util = require('util')
const query = util.promisify(config.query).bind(config)

class DeleteGroupMessage extends Message {
    static async deleteMessage(messageId) {
        let removed = await query("DELETE FROM nottiktok.groupmessages WHERE messageId = " + messageId)

        return removed
    }
}

module.exports = DeleteGroupMessage