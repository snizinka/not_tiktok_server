const Contact = require("./Contact");
const config = require('../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class RemovePrivateContact extends Contact {
    static async removeContact(data) {
        let user = await query(`DELETE FROM nottiktok.contacts WHERE contactId = ${data.contactId}`)
       
        return user
    }
}

module.exports = RemovePrivateContact