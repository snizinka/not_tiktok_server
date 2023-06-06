const Admin = require("./Admin");
const GetUserByUsername = require("../User/GetUserByUsername");
const GetPostsByDescription = require("../Post/GetPostsByDescription");

class GetUserOrPostByTitle extends Admin {
    static async getData(title) {
        let users = await GetUserByUsername.getUserData(title)
        let posts = await GetPostsByDescription.getPosts(title)

        users = users.map(user => {
            return {...user, type: 'user'}
        })

        posts = posts.map(post => {
            return {...post, type: 'post'}
        })

        return { users, posts }
    }
}


module.exports = GetUserOrPostByTitle