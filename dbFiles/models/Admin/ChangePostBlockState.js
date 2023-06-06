const Admin = require("./Admin");
const config = require('../../dbConfig');
const util = require('util');
const GetPostByIdWithBlocked = require("../Post/GetPostByIdWithBlocked");
const query = util.promisify(config.query).bind(config)

class ChangePostBlockState extends Admin {
    static async setData(item) {
        let isBlocked = await GetPostByIdWithBlocked.getPosts(item)

        if (isBlocked.length > 0) {
            if (isBlocked[0].isBlocked) {
                isBlocked = await query(`UPDATE nottiktok.post SET isBlocked = NULL WHERE postId = ${item}`)
                isBlocked.isBlocked = false
            } else {
                isBlocked = await query(`UPDATE nottiktok.post SET isBlocked = 1 WHERE postId = ${item}`)
                isBlocked.isBlocked = true
            }
        }

        return isBlocked
    }
}

module.exports = ChangePostBlockState