const config = require('../../dbConfig');
const util = require('util');
const Text = require('./Text');
const query = util.promisify(config.query).bind(config)

class EditTextContent extends Text {
    static async editContent(data) {
        const title = data.title.replace(/["\\]/g, (match) => {
            if (match === '"') {
                return '""'
            } else {
                return '\\\\'
            }
        })

        const body = data.body.replace(/["\\]/g, (match) => {
            if (match === '"') {
                return '""'
            } else {
                return '\\\\'
            }
        })
        const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
        const queryString = `UPDATE nottiktok.textcontent SET textTitle = "${title}", textContent = "${body}", "${currentTime}" WHERE postId = ${data.postId} AND textContentId = ${data.textContentId}`;
        const newText = await query(queryString)
        
        return newText;
    }
}

module.exports = EditTextContent