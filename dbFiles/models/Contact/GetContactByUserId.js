const Contact = require("./Contact");
const config = require('../../dbConfig');
const util = require('util');
const User = require('../User/User');
const query = util.promisify(config.query).bind(config)

class GetContactByUserId extends Contact {
    static async getContact(userId) {
        let user = await query(`Select c.contactId, c.fuserId, c.suserId, c.contactDate 
    from nottiktok.contacts as c
    where (c.fuserId = ${userId}) OR (c.suserId = ${userId})`)

        let users = []
        for (let i = 0; i < user.length; i++) {
            let userOne = new User(user[i].fuserId === userId ? user[i].fuserId : user[i].suserId)
            let userTwo = new User(user[i].fuserId === userId ? user[i].suserId : user[i].fuserId)
            await userOne.fetchUserData()
            await userTwo.fetchUserData()
            users.push({ owner: userOne, receiver: userTwo, contactId: user[i].contactId })
        }

        return { users, chat: { chatType: 'Private' }, chatType: 'Private' }
    }
}

module.exports = GetContactByUserId