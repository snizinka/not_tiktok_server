const config = require('../../dbConfig');
const util = require('util');
const Comment = require("./Comment");
const GetCommentById = require('./GetCommentById');
const query = util.promisify(config.query).bind(config)

class AddComment extends Comment {
    static async sendComment(data) {
        const commentContent = data.commentContent.replace(/["\\]/g, (match) => {
            if (match === '"') {
                return '""'
            } else {
                return '\\\\'
            }
        })
        const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
        const newComment = await query(`INSERT INTO nottiktok.comments (userId, postId, replyTo, commentContent, publishDate) VALUES(${data.userId}, ${data.postId}, ${data.replyTo}, "${commentContent}", "${currentTime}")`)
        const comment = await GetCommentById.getComments(newComment.insertId)
        
        return comment
    }
}

module.exports = AddComment