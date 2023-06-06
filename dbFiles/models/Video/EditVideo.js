const config = require('../../dbConfig');
const util = require('util');
const Video = require('./Video');
const query = util.promisify(config.query).bind(config)

class EditVideo extends Video {
    static async editContent(data) {
        const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
        const queryString = `UDPATE nottiktok.videocontent SET videoLink = "${data.link}" WHERE postId = ${data.postId} AND videoContentId = ${data.videoContentId}`;
        const newVideo = await query(queryString);
        
        return newVideo;
    }
}

module.exports = EditVideo