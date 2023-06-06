const Analytics = require("./Analytics");
const config = require('../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class GetSubscriptionByUserId extends Analytics {
    static async getData(userId) {
        let subscription = await query(`SELECT MONTH(subscribtionDate) AS month, COUNT(*) AS subscribed, GROUP_CONCAT(DATE_FORMAT(subscribtionDate, '%d')) as dates
       FROM nottiktok.subscription
       WHERE subscribtionDate >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH) AND userId = ${userId}
       GROUP BY month
       ORDER BY month ASC`)

        for (let i = 0; i < subscription.length; i++) {
            subscription[i].dates = subscription[i].dates.split(",")
        }

        return subscription
    }
}


module.exports = GetSubscriptionByUserId