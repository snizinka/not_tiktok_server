const Post = require("./Post");
const config = require('../../dbConfig');
const util = require('util');
const CreateTag = require('../../models/Tags/CreateTag')
const CreatePost = require('../../models/Post/CreatePost')
const AddCompletedRequest = require('../../models/Request/AddCompletedRequest')
const UploadContentFactory = require('../../models/Content/UploadContentFactory')
const query = util.promisify(config.query).bind(config)

class EditPost extends Post {
    static async editPost(data) {
        const description = data.description.replace(/["\\]/g, (match) => {
            if (match === '"') {
                return '""'
            } else {
                return '\\\\'
            }
        })

        let updatePostQuery = `UPDATE nottiktok.post SET previewImage = "${data.previewImage}", description = "${description}" WHERE postId = ${data.postId}`;
        await query(updatePostQuery)

        let deleteAllPhotoQuery = `DELETE FROM nottiktok.photocontent WHERE postId = ${data.postId}`
        let deleteAllVideoQuery = `DELETE FROM nottiktok.videocontent WHERE postId = ${data.postId}`
        let deleteAllTextQuery = `DELETE FROM nottiktok.textcontent WHERE postId = ${data.postId}`
        let deleteAllTagsQuery = `DELETE FROM nottiktok.category_link WHERE postId = ${data.postId}`

        await query(deleteAllPhotoQuery)
        await query(deleteAllVideoQuery)
        await query(deleteAllTextQuery)
        await query(deleteAllTagsQuery)

        const content = data.content
        const tags = data.tags

        for (let i = 0; i < content.length; i++) {
            const newContent = new UploadContentFactory(content[i].content.type)
            await newContent.uploadContent({ postId: data.postId, userId: data.userId, content: content[i] })
        }

        for (let i = 0; i < tags.length; i++) {
            await CreateTag.createTag(tags[i].tag, data.postId)
        }

        if (data.requstedPostId) {
            AddCompletedRequest.addRequest(data.postId, data.requstedPostId)
        }

        return data.postId
    }
}

module.exports = EditPost