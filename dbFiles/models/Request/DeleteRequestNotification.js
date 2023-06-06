const config = require('../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class DeleteRequestNotification {
    static async deleteRequest(id, requestId) {
        let queryString = `UPDATE nottiktok.userstoaccomplish SET seen = 'true' WHERE userId = ${id} AND requestId = ${requestId}`
        await query(queryString)
    }
  }

  module.exports = DeleteRequestNotification