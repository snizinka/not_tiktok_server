const Chat = require("./Chat");
const config = require('../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class isChatLinkUnique extends Chat {
    static async isChatLinkUnique(link) {
        let isUnique = await query(`SELECT * FROM nottiktok.chat WHERE chat_link = "${link}"`)
        
        return isUnique.length > 0 ? false : true
    }
}

module.exports = isChatLinkUnique