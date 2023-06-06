const CreateTag = require('./models/Tags/CreateTag')
const CreatePost = require('./models/Post/CreatePost')
const AddCompletedRequest = require('./models/Request/AddCompletedRequest')
const UploadContentFactory = require('./models/Content/UploadContentFactory')
const EditPost = require('./models/Post/EditPost')

const uploadContent = async (contentData) => {
    const createdPost = await CreatePost.createPost(contentData)
    const content = contentData.content
    const tags = contentData.tags

    for (let i = 0; i < content.length; i++) {
        const newContent = new UploadContentFactory(content[i].content.type)
        const uploadStatus = await newContent.uploadContent({postId: createdPost.insertId, userId: contentData.userId, content: content[i]})
    }

    for (let i = 0; i < tags.length; i++) {
        const newTag = await CreateTag.createTag(tags[i].tag, createdPost.insertId)
    }

    if (contentData.requstedPostId) {
        const completedRequest = AddCompletedRequest.addRequest(createdPost.insertId, contentData.requstedPostId)
    }

    return { data: createdPost }
}

const editContent = async (contentData) => {
    const editPost = await EditPost.editPost(contentData)

    return { data: editPost }
}


module.exports = {
    uploadContent,
    editContent
}