const Contact = require("./Contact");
const config = require('../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class AddContact extends Contact {
    static async addContact(data) {
        let user = await query(`INSERT INTO nottiktok.contacts (fuserId, suserId, contactDate) VALUES(${data.fuserId}, ${data.suserId}, "${data.contactDate}")`)

        return user.insertId
    }
}

module.exports = AddContact