const config = require('../../dbConfig');
const util = require('util');
const Text = require('./Text');
const query = util.promisify(config.query).bind(config)

class UploadTextContent extends Text {
    static async uploadContent(data) {
        const title = data.content.content.title.replace(/["\\]/g, (match) => {
            if (match === '"') {
                return '""'
            } else {
                return '\\\\'
            }
        })

        const body = data.content.content.body.replace(/["\\]/g, (match) => {
            if (match === '"') {
                return '""'
            } else {
                return '\\\\'
            }
        })
        const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
        const queryString = `INSERT INTO nottiktok.textcontent (userId, postId, textTitle, textContent, datePublished) VALUES(${data.userId}, ${data.postId}, "${title}", "${body}", "${currentTime}")`;
        const newText = await query(queryString)
        
        return newText;
    }
}

module.exports = UploadTextContent;