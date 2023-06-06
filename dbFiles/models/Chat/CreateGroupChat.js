const Chat = require("./Chat");
const config = require('../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class CreateGroupChat extends Chat {
    static async createChat(group) {
        const chatName = group.chatName.replace(/["\\]/g, (match) => {
            if (match === '"') {
                return '""'
            } else {
                return '\\\\'
            }
        })

        const chatLink = group.chatLink.replace(/["\\]/g, (match) => {
            if (match === '"') {
                return '""'
            } else {
                return '\\\\'
            }
        })

        let addedGroup = await query(`INSERT INTO nottiktok.chat (chatName, chatType, chat_link, chat_image) VALUES("${chatName}", "${group.chatType}", "${chatLink}", "${group.chatImage}")`);
        return addedGroup
    }
}

module.exports = CreateGroupChat