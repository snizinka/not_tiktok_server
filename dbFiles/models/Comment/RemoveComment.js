const config = require('../../dbConfig');
const util = require('util');
const Comment = require("./Comment");
const query = util.promisify(config.query).bind(config)

class RemoveComment extends Comment {
    static async removeComment(data) {
        const removedComment = await query(`DELETE FROM nottiktok.comments WHERE commentId = ${data.commentId}`)
        
        return data
    }
}

module.exports = RemoveComment