const Contact = require("./Contact");
const config = require('../../dbConfig');
const util = require('util');
const User = require('../User/User');
const query = util.promisify(config.query).bind(config)

class GetGroupContactsByUserId extends Contact {
    static async getContact(userId) {
        let chat = await query(`SELECT cht.chatId, cht.chatName, cht.chatType, cht.chat_link, cht.chat_image 
        FROM nottiktok.chat as cht
        JOIN nottiktok.contactlink as cntclnk on cntclnk.chatId = cht.chatId
        WHERE cntclnk.userId = ${userId}`)

        let chatList = []
        
        for (let i = 0; i < chat.length; i++) {
            chat[i].chatType = 'Group'
            chat[i].chatImage = undefined
            chat[i].chatUser = userId

            let groupUser = await query(`Select c.userId, c.chatId, c.contactLinkId 
            from nottiktok.contactlink as c
            where chatId = ${chat[i].chatId}`)
            
            let users = []
            for (let i = 0; i < groupUser.length; i++) {
                if (groupUser[i] !== undefined) {
                    let userOne = new User(groupUser[i].userId)
                    await userOne.fetchUserData()
                    users.push(userOne)
                }
            }

            chat[i].users = users

            chatList.push(chat[i])
        }

        
       

        return { chat: chatList, chatType: 'Group' }
    }
}

module.exports = GetGroupContactsByUserId