const Post = require("./Post");
const config = require('../../dbConfig');
const util = require('util');
const User = require("../User");
const query = util.promisify(config.query).bind(config)

class GetResponsesPosts extends Post {
    static async getPosts(id) {
        let queryString = `SELECT 
        pt.postId, pt.description, pt.previewImage,
        us.userId, us.userLink, us.username, us.userImage,
        customer.userId as customerId, customer.userLink as customerLink, customer.username as customerUsername, customer.userImage as customerImage
        FROM nottiktok.post as pt 
        JOIN nottiktok.users as us ON us.userId = pt.userId
        JOIN nottiktok.requested_content as response ON response.post_id = pt.postId
        JOIN nottiktok.requests as request ON request.requestId = response.request_id
        JOIN nottiktok.users as customer ON customer.userId = request.userId
        WHERE pt.userId = ${id} AND pt.isBlocked is null`;
        let posts = await query(queryString);
        const postclass = [];

        for (let row of posts) {
            const post = new Post(
                row.postId,
                row.description,
                row.previewImage,
                new User(row.userId, row.userLink, row.username, row.userImage)
            );

            postclass.push({post, customer: new User(row.customerId, row.customerLink, row.customerUsername, row.customerImage)});
        }

        return postclass;
    }
  }

  module.exports = GetResponsesPosts;