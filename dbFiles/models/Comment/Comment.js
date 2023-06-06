const config = require('../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)
const User = require('../User');

class Comment {
    constructor(commentId, userId, postId, commentContent, publishDate, _user, replyTo = null) {
        this.commentId = commentId;
        this.userId = userId;
        this.postId = postId;
        this.commentContent = commentContent;
        this.publishDate = publishDate;
        this._user = _user;
        this.replyTo = replyTo;
    }

    static async getComments(postId) {
        const textContent = JSON.parse(JSON.stringify(await query(`SELECT * from nottiktok.comments as cs LEFT JOIN nottiktok.users as us ON us.userId = cs.userId WHERE cs.postId = ${postId}`)));
        let textArray = [];

        for(let text of textContent) {
            let user = await User.getUser(text.userId);
            textArray.push(new Comment(text.commentId, text.userId, text.postId, text.commentContent, text.publishDate, user, text.replyTo))
        }

        return textArray;
    }

    static async sendComment(data) { }

    static async removeComment(data) { }

    static async getCommentsAmount(data) { }
}

module.exports = Comment;