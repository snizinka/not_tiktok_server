const Post = require("../Post");
const GetAllPosts = require('../GetAllPosts');
const GetPostById = require('../GetPostById');
const GetPostsByUserId = require('../GetPostsByUserId');
const GetPostsByDescription = require('../GetPostsByDescription');
const PostType = require('../PostType');

class GetPostsFactory {
    constructor(type) {
        switch (type) {
            case PostType.DEFAULT:
                return GetAllPosts
            case PostType.BY_USER_ID:
                return GetPostsByUserId
            case PostType.BY_POST_ID:
                return GetPostById
            case PostType.BY_DESCRIPTION:
                return GetPostsByDescription
            default:
                throw new Error(`Invalid parameter: ${parameter}`);
        }
    }
}

module.exports = GetPostsFactory;