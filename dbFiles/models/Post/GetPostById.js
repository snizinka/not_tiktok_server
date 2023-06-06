const Post = require("./Post");
const config = require('../../dbConfig');
const util = require('util');
const User = require("../User");
const query = util.promisify(config.query).bind(config)

class GetPostById extends Post {
    static async getPosts(id) {
        let queryString = `SELECT pt.postId, pt.description, us.userId, us.userLink, us.username, us.userImage, pt.previewImage 
        FROM nottiktok.post as pt 
        JOIN nottiktok.users as us ON us.userId = pt.userId 
        WHERE pt.postId = ${id} AND pt.isBlocked is null`;
        let posts = await query(queryString);
        const postclass = [];

        for (let row of posts) {
            const post = new Post(
                row.postId,
                row.description,
                row.previewImage,
                new User(row.userId, row.userLink, row.username, row.userImage)
            );

            postclass.push(post);
        }

        return postclass;
    }
  }


  module.exports = GetPostById;