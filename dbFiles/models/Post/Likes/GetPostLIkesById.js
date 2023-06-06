const Post = require("../Post");
const config = require('../../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class GetPostLIkesById extends Post {
    static async getPostAnalytics(id) {
        const queryString = `SELECT COUNT(postId) as likesCount FROM nottiktok.likes WHERE postId = ${id}`;
        const likes = await query(queryString)

        console.log(likes)
    
        return likes
    }
  }

  module.exports = GetPostLIkesById