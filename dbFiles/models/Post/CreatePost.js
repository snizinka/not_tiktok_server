const config = require('../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class CreatePost {
    static async createPost(data) {
        const description = data.description.replace(/["\\]/g, (match) => {
            if (match === '"') {
                return '""'
            } else {
                return '\\\\'
            }
        })
        const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
        const queryString = `INSERT INTO nottiktok.post (userId, description, previewImage, postDate) VALUES(${data.userId}, "${description}", "${data.previewImage}", "${currentTime}")`
        const newPost = await query(queryString)

        return newPost
    }
}

module.exports = CreatePost;