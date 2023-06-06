const Post = require("../Post");
const config = require('../../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class GetRangePostViewsById extends Post {
    static async getPostAnalytics(id) {
        const queryString = `SELECT MONTH(date_time) AS month, COUNT(*) AS viewed, GROUP_CONCAT(DATE_FORMAT(date_time, '%d')) as dates
        FROM nottiktok.post_views
        WHERE date_time >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH) AND post_id = ${id}
        GROUP BY month
        ORDER BY month ASC`;
        const views = await query(queryString)
    
        return views
    }
  }

  module.exports = GetRangePostViewsById