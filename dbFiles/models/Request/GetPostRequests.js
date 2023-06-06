const config = require('../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class GetPostRequests {
    static async getRequest(id) {
        let queryString = `SELECT request.* 
        FROM nottiktok.requests as request
        JOIN nottiktok.userstoaccomplish as possible ON possible.userId = ${id} AND possible.requestId = request.requestId
        WHERE request.request_status = 'Pending' AND possible.seen is NULL`;
        let postRequest = await query(queryString);

        return postRequest;
    }
  }

  module.exports = GetPostRequests;