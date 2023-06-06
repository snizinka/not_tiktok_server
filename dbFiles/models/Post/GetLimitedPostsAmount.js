const Post = require("./Post");
const config = require('../../dbConfig');
const util = require('util');
const User = require("../User");
const query = util.promisify(config.query).bind(config)

class GetLimitedPostsAmount extends Post {
    static async getPosts(data) {
        let queryString = `SELECT pt.postId, pt.description, us.userId, us.userLink, us.username, us.userImage, 
        pt.previewImage 
        FROM nottiktok.post as pt 
        JOIN nottiktok.users as us ON us.userId = pt.userId
        WHERE pt.isBlocked is null
        LIMIT ${(data.threshold - 6)}, 6`;

        //JOIN post_views as pv on pv.post_id = pt.postId AND pv.user_id != 2
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

  module.exports = GetLimitedPostsAmount;