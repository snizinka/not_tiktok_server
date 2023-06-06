const config = require('../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class Text {
    constructor(textContentId, userId, postId, textContent, textTitle, datePublished) {
        this.textContentId = textContentId;
        this.userId = userId;
        this.postId = postId;
        this.textContent = textContent;
        this.textTitle = textTitle;
        this.datePublished = datePublished;
    }

    static async getTextContent(postId) {
        const textContent = JSON.parse(JSON.stringify(await query(`SELECT * FROM nottiktok.textcontent as txt WHERE txt.postId = ${postId}`)));
        let textArray = [];

        for(let text of textContent) {
            textArray.push(new Text(text.textContentId, text.userId, text.postId, text.textContent, text.textTitle, text.datePublished))
        }

        return textArray;
    }

    static async uploadContent(data) { }

    static async editContent(data) { }
}

module.exports = Text;