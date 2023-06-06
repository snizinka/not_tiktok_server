const config = require('../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class Picture {
    constructor(photoContentId, userId, postId, photoLink, datePublished) {
        this.photoContentId = photoContentId;
        this.userId = userId;
        this.postId = postId;
        this.photoLink = photoLink;
        this.datePublished = datePublished;
    }

    static async getPictures(postId) {
        const pictures = JSON.parse(JSON.stringify(await query(`SELECT * FROM nottiktok.photocontent as pht WHERE pht.postId = ${postId}`)));
        let _pictures = [];

        for(let picture of pictures)
            _pictures.push(new Picture(picture.photoContentId, picture.userId, picture.postId, picture.photoLink, picture.datePublished))

        return _pictures;
    }

    static async uploadContent(data) { }

    static async editContent(data) { }
}

module.exports = Picture;