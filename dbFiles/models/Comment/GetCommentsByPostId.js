const config = require('../../dbConfig');
const util = require('util');
const Comment = require("./Comment");
const query = util.promisify(config.query).bind(config)

class GetCommentsByPostId extends Comment {
    static async getCommentsAmount(id) {
        const commentsCountQuery = `SELECT COUNT(postId) as sharesCount FROM nottiktok.comments WHERE postId = ${id}`
        const commentsCount = await query(commentsCountQuery)
        
        return commentsCount
    }
}

module.exports = GetCommentsByPostId