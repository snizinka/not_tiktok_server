const Post = require("../Post");
const config = require('../../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class GetAllPostsViews extends Post {
    static async getPostAnalytics(id) {
        const queryString = `SELECT COUNT(views.post_id) as amount FROM nottiktok.post as pst
        JOIN nottiktok.post_views as views ON views.post_id = pst.postId
        WHERE pst.userId = ${id}`;
        const views = await query(queryString)
    
        return views
    }
  }

  module.exports = GetAllPostsViews