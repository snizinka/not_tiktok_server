const Admin = require("./Admin");
const GetUserById = require("../User/GetUserById");
const GetPostsByUserIdWithBlocked = require("../Post/GetPostsByUserIdWithBlocked");
const GetPostByIdWithBlocked = require("../Post/GetPostByIdWithBlocked");
const GetAllPostsViews = require("../Post/Views/GetAllPostsViews");
const GetSubscriptionByUserId = require("../Analytics/GetSubscriptionByUserId");

class SelectUserOrPostByTitle extends Admin {
    static async getData(item) {
        console.log(item)
        let user = await GetUserById.getUserData(item.userId)
        let posts = await GetPostsByUserIdWithBlocked.getPosts(item.userId)
        let selectedPost = item.selectedPost ? await GetPostByIdWithBlocked.getPosts(item.selectedPost) : null
        let postsViews = await GetAllPostsViews.getPostAnalytics(item.userId)
        const subscription = await GetSubscriptionByUserId.getData(item.userId)

        if (selectedPost) {
            selectedPost = await selectedPost[0].getData(item.userId)
        }

        user.postsViews = postsViews.length > 0 ? postsViews[0].amount : 0

        return { user, posts, selectedPost: selectedPost, subscription }
    }
}

module.exports = SelectUserOrPostByTitle