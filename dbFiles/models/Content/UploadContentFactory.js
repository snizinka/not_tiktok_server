const ContentType = require('./ContentType');
const UploadPicture = require('../Picture/UploadPicture');
const UploadVideo = require('../Video/UploadVideo');
const UploadTextContent = require('../Text/UploadTextContent');

class UploadContentFactory {
    constructor(type) {
        switch (type) {
            case ContentType.PICTURE:
                return UploadPicture
            case ContentType.VIDEO:
                return UploadVideo
            case ContentType.TEXT:
                return UploadTextContent
            default:
                throw new Error(`Invalid parameter: ${type}`);
        }
    }
}

module.exports = UploadContentFactory;