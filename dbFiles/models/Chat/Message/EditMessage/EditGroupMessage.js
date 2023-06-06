const Message = require("../Message");
const config = require('../../../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class EditGroupMessage extends Message {
    static async editMessage(message) {
        const formattedMessage = message.newmessage.replace(/["\\]/g, (match) => {
            if (match === '"') {
                return '""'
            } else {
                return '\\\\'
            }
        })
        let edited = await query(`UPDATE nottiktok.groupmessages SET message = "${formattedMessage}" WHERE messageId = ${message.messageId}`)
        return edited
    }
}

module.exports = EditGroupMessage