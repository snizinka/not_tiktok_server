const config = require('../../dbConfig');
const util = require('util');
const User = require('../User');
const query = util.promisify(config.query).bind(config)

class GetPostRequestsByCreatorId {
    static async getRequest(id) {
        let queryString = `SELECT request.*, customer.userId, customer.userLink, customer.username, customer.userImage 
        FROM nottiktok.requests as request
        JOIN nottiktok.userstoaccomplish as possible ON possible.userId = ${id} AND possible.requestId = request.requestId
        JOIN nottiktok.users as customer on customer.userId = request.userId
        WHERE request.request_status = 'Pending'`;
        let postRequest = await query(queryString);
        const requests = [];

        for (let row of postRequest) {
            const request = {
                requestId: row.requestId,
                topic: row.topic,
                budget: row.budget,
                deadline: row.deadline,
                moredetails: row.moredetails,
                requestDate: row.requestDate,
                task: row.task
            }
            const customer = new User(row.userId, row.userLink, row.username, row.userImage)
            requests.push({request, customer});
        }

        return requests;
    }
}

module.exports = GetPostRequestsByCreatorId;