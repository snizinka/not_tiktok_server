const Post = require("../Post");
const config = require('../../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class StorePostView extends Post {
    static async storeView(data) {
        const view = await query(`SELECT * FROM nottiktok.post_views WHERE post_id = ${data.postId} AND user_id = ${data.userId}`)

        if (view.length === 0) {
            const queryString = `INSERT INTO nottiktok.post_views (user_id, post_id, count, date_time) VALUES(${data.userId}, ${data.postId}, 1, "2022-11-11 01:00:00")`
            await query(queryString)
        } else {
            const queryString = `UPDATE nottiktok.post_views SET count = ${view[0].count + 1} WHERE post_id = ${data.postId} AND user_id = ${data.userId}`
            await query(queryString)
        }
    }
}

module.exports = StorePostView