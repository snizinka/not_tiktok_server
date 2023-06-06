const config = require('../../dbConfig');
const util = require('util');
const Video = require('./Video');
const query = util.promisify(config.query).bind(config)

class UploadVideo extends Video {
    static async uploadContent(data) {
        const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
        const queryString = `INSERT INTO nottiktok.videocontent (userId, postId, videoLink, videoLength, datePublished) VALUES(${data.userId}, ${data.postId}, "${data.content.content.link}", 0, "${currentTime}")`;
        const newVideo = await query(queryString);
        
        return newVideo;
    }
}

module.exports = UploadVideo;