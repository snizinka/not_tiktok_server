const Post = require("../Post");
const config = require('../../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class StorePostShare extends Post {
    static async storeShare(data) {
        const queryString = `INSERT INTO nottiktok.shares (userId, postId, publishDate) VALUES(${data.userId}, ${data.postId}, "2022-11-11 01:00:00")`
        const shared = await query(queryString)
    
        return shared
    }
  }

  module.exports = StorePostShare