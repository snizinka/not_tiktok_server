const Contact = require("./Contact");
const config = require('../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class RemoveGroupContact extends Contact {
    static async removeContact(data) {
        let user = await query(`DELETE FROM nottiktok.contactlink WHERE chatId = ${data.chatId} and userId = ${data.userId}`)
       
        return user
    }
}

module.exports = RemoveGroupContact