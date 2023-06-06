const Post = require("../Post");
const config = require('../../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class GetPostViewsById extends Post {
    static async getPostAnalytics(id) {
        const queryString = `SELECT COUNT(id) FROM nottiktok.post_views WHERE post_id = ${id}`;
        const views = await query(queryString)
    
        return views
    }
  }

  module.exports = GetPostViewsById