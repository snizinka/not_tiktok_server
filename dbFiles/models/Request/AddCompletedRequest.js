const config = require('../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class AddCompletedRequest {
    static async addRequest(postId, requestId) {
        let queryString = `INSERT INTO nottiktok.requested_content (post_id, request_id) VALUES(${postId}, ${requestId})`
        let completedRequest = await query(queryString)
        // Create procedure
        return completedRequest;
    }
  }

  module.exports = AddCompletedRequest;