const config = require('../../dbConfig');
const util = require('util');
const Picture = require('./Picture');
const query = util.promisify(config.query).bind(config)

class UploadPicture extends Picture {
    static async editContent(data) {
        const queryString = `UPDATE nottiktok.photocontent SET photoLink = "${data.content.link}" WHERE postId = ${data.postId} AND photoContentId = ${data.photoContentId}`
        const newPicture = await query(queryString)
        
        return newPicture;
    }
}

module.exports = UploadPicture;