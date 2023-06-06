const config = require('../../dbConfig');
const util = require('util');
const User = require("../User/User");
const Comment = require("./Comment");
const query = util.promisify(config.query).bind(config)

class GetCommentById extends Comment {
    static async getComments(id) {
        const comment = await query(`SELECT * from nottiktok.comments as cs LEFT JOIN nottiktok.users as us ON us.userId = cs.userId WHERE cs.commentId = ${id}`)
        let commentWriter = new User(comment[0].userId)
        await commentWriter.fetchUserData()

        return new Comment(
            comment[0].commentId,
            comment[0].userId,
            comment[0].postId,
            comment[0].commentContent,
            comment[0].publishDate,
            commentWriter,
            comment[0].replyTo
        )
    }
}

module.exports = GetCommentById