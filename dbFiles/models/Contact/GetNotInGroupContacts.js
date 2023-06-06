const Contact = require("./Contact");
const config = require('../../dbConfig');
const util = require('util');
const User = require('../User/User');
const query = util.promisify(config.query).bind(config)


class GetNotInGroupContacts extends Contact {
    static async getContact(chat) {
        let user = await query(`SELECT distinct us.*
        FROM nottiktok.contacts as contact
        JOIN nottiktok.users as us on us.userId = contact.fuserId OR us.userId = contact.suserId AND us.userId != ${chat.userId}
        JOIN nottiktok.contactlink as cntclnk on cntclnk.chatId = ${chat.chatId} and us.userId != all(select userId from nottiktok.contactlink where chatId = ${chat.chatId})
        WHERE contact.fuserId = ${chat.userId} OR contact.suserId = ${chat.userId}`)

        let users = []
        for (let i = 0; i < user.length; i++) {
            let availableUser = new User(user[i].userId)
            await availableUser.fetchUserData()
            users.push(availableUser)
        }

        return { users }
    }
}

module.exports = GetNotInGroupContacts