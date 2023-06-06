const GetUserPostByDesctiption = require('./models/Post/GetUserPostByDesctiption')

const getPostsByTitle = async (data) => {
    const createdPost = await GetUserPostByDesctiption.getPosts(data)
   
    return { data: createdPost }
}


module.exports = {
    getPostsByTitle
}