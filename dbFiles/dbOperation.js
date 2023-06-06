const config = require('./dbConfig');
const util = require('util');
const GetPostsByUserId = require('./models/Post/GetPostsByUserId');
const GetRecentPosts = require('./models/Post/GetRecentPosts');
const GetSavedPosts = require('./models/Post/GetSavedPosts');
const GetResponsesPosts = require('./models/Post/GetResponsesPosts');
const GetPostsFactory = require('./models/Post/Factories/GetPostsFactory');
const PostType = require('./models/Post/PostType');
const CategoryByUser = require('./models/Category/CategoryByUser');
const UserAuthor = require('./models/User/UserAuthor');
const AddComment = require('./models/Comment/AddComment');
const RemoveComment = require('./models/Comment/RemoveComment');
const AddContact = require('./models/Contact/AddContact');
const StorePostShare = require('./models/Post/Shares/StorePostShare');
const StorePostView = require('./models/Post/Views/StorePostView');
const GetLimitedPostsAmount = require('./models/Post/GetLimitedPostsAmount');
const GetProfile = require('./models/User/GetProfile');
const CheckUserLink = require('./models/User/CheckUserLink');
const CheckUserEmail = require('./models/User/CheckUserEmail');
const EditProfile = require('./models/User/EditProfile');
const GetUserOrPostByTitle = require('./models/Admin/GetUserOrPostByTitle');
const SelectUserOrPostByTitle = require('./models/Admin/SelectUserOrPostByTitle');
const GetPostById = require('./models/Post/GetPostById');
const ChangePostBlockState = require('./models/Admin/ChangePostBlockState');
const GetPostByIdWithBlocked = require('./models/Post/GetPostByIdWithBlocked');
const GetRangePostViewsById = require('./models/Post/Views/GetRangePostViewsById');
const nodemailer = require('nodemailer');
const GetPostRequests = require('./models/Request/GetPostRequests');
const DeleteRequestNotification = require('./models/Request/DeleteRequestNotification');

const query = util.promisify(config.query).bind(config)

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'snizinkavolshebna@gmail.com',
        pass: 'mdzvcgvzmdzqscnl'
    }
});

const signUp = async (email, password, username) => {
    let confirmationNumber = makeid(5);
    var mailOptions = {
        from: 'Not TikTok <snizinkavolshebna@gmail.com>',
        to: email,
        subject: 'Not TikTok account Confirmation',
        text: confirmationNumber
    }
    try {
        return new Promise((resolve, reject) => {

            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    reject({ error: 'Mail not found' });
                } else {
                    resolve({ confirmationNumber: confirmationNumber, email: email, password: password, username: username });
                }
            })
        })
    }
    catch (err) {
        resolve({ error: 'Mail not found' })
    }
}


const getProfile = async (id) => {
    let categories = []
    let posts = []
    let userProfile = {}

    try {
        userProfile = new UserAuthor(id)
        await userProfile.fetchUserData();
        categories = CategoryByUser.getCategory(id)
        userProfile.followers = await userProfile.getAmmountOfFollowes()
        userProfile.following = await userProfile.getAmmountOfFollowing()
        posts = await GetPostsByUserId.getPosts(userProfile.userId)

        await Promise.all(posts.map(post => post.getData(id)))
    } catch (err) {
        console.log(err)
    }

    return { data: { categories, posts, userProfile } }
}

const getRecentProfile = async (id) => {
    let posts = []

    try {
        posts = await GetRecentPosts.getPosts(id)
        await Promise.all(posts.map(post => post.getData(id)))
    } catch (err) {
        console.log(err)
    }

    return { data: posts }
}

const getAllProfilePosts = async (id) => {
    let posts = []

    try {
        posts = await GetPostsByUserId.getPosts(id)
        await Promise.all(posts.map(post => post.getData(id)))
    } catch (err) {
        console.log(err)
    }

    return { data: posts }
}

const getSavedProfilePosts = async (id) => {
    let posts = []

    try {
        posts = await GetSavedPosts.getPosts(id)
        await Promise.all(posts.map(post => post.getData(id)))
    } catch (err) {
        console.log(err)
    }

    return { data: posts }
}

const getProfileResponses = async (id) => {
    let posts = []

    try {
        posts = await GetResponsesPosts.getPosts(id)
        await Promise.all(posts.map(post => post.post.getData(id)))
    } catch (err) {
        console.log(err)
    }

    return { data: posts }
}

const getPosts = async (parameter = PostType.DEFAULT, id = 0, userId) => {
    const post = new GetPostsFactory(parameter);
    let _posts = [];

    try {
        let posts = []
        posts = await post.getPosts(id);

        for (let postForm of posts) {
            const data = await postForm.getData(userId);
            _posts.push(data);
        }

        return { converted: { _posts } };
    } catch (error) {
        console.log(error);
    }
}

const signUser = async (login, password) => {
    try {
        let data = JSON.parse(JSON.stringify(await query(`SELECT * FROM nottiktok.users WHERE username = '${login}'`)));

        return { data }
    } catch (err) {
        console.log(err)
    }
}

const changeLikeState = async (postId, userId) => {
    try {
        let result = JSON.parse(JSON.stringify(await query(`SELECT ls.likesId, ls.postId FROM nottiktok.likes as ls WHERE ls.postId = ${postId} AND ls.userId = ${userId}`)));
        let changeResult;

        if (result.length === 0) {
            await query(`INSERT INTO nottiktok.likes(userId, postId) VALUES(${userId}, ${postId})`)
            changeResult = JSON.parse(JSON.stringify(await query(`SELECT ls.likesId, ls.postId FROM nottiktok.likes as ls WHERE ls.userId = ${userId} AND ls.postId = '${postId}'`)))
        } else {
            await query(`DELETE FROM nottiktok.likes WHERE postId = ${postId} AND userId = ${userId}`);
            changeResult = {}
        }

        return { data: changeResult.length > 0 ? true : false }
    } catch (err) {
        console.log(err)
    }
}

const changeFollowState = async (authorId, userId) => {
    try {
        if (authorId === userId) {
            return false
        }
        const checkFollowing = await query(`SELECT * FROM nottiktok.follows as fs WHERE fs.followerId = ${userId} AND fs.userId = ${authorId}`)
        let isFollowing = {}

        if (checkFollowing.length === 0) {
            await query(`INSERT INTO nottiktok.follows(followerId, userId) VALUES(${userId}, ${authorId})`)
            const checkIfContacts = await query(`SELECT * FROM nottiktok.contacts WHERE (fuserId = ${userId} AND suserId = ${authorId}) OR (fuserId = ${authorId} AND suserId = ${userId})`)
            if (checkIfContacts.length === 0) {
                await AddContact.addContact({ fuserId: userId, suserId: authorId, contactDate: '2023-11-30 00:00:00' })
            }
            isFollowing = true
        } else {
            await query(`DELETE FROM nottiktok.follows WHERE followerId = ${userId} AND userId = ${authorId}`)
            isFollowing = false
        }

        return { data: isFollowing }
    } catch (err) {
        console.log(err)
    }
}

const usersToAccomplish = async (categories) => {
    try {
        let data = [];

        if (categories.userToFind !== '') {
            let temp = (await query(`SELECT u.username, u.userId, u.userLink FROM nottiktok.users as u
            WHERE u.username LIKE '%${categories.userToFind}%'`));
            data.push(temp);
        } else {
            for (let i = 0; i < categories.categories.length; i++) {

                let temp = (await query(`SELECT u.username, u.userId, u.userLink, ctgr.categoryName FROM nottiktok.users as u
                LEFT JOIN nottiktok.post as pst ON pst.userId = u.userId
                LEFT JOIN nottiktok.category_link as cl ON cl.postId = pst.postId
                LEFT JOIN nottiktok.category as ctgr ON ctgr.categoryId = cl.categoryId
                WHERE ctgr.categoryName = '${categories.categories[i]}'`));
                data.push(temp);
            }
        }

        return { data }
    } catch (err) {
        console.log(err)
    }
}

const createRequest = async (request) => {
    try {
        console.log(request)
        let resultMain = await query(`INSERT INTO nottiktok.requests (task, budget, deadline, moredetails, userId, requestDate) VALUES("${request.task}", ${request.budget}, "${request.deadline}", "${request.detailsFile}", ${request.user}, "2023.03.12")`);
        console.log(resultMain)
        for (let i = 0; i < request.userToAccomplish.length; i++) {
            let resultSub = await query(`INSERT INTO nottiktok.userstoaccomplish (requestId, userId, isPrimary) VALUES(${resultMain.insertId}, ${request.userToAccomplish[i].userId}, 1)`);
        }
        for (let i = 0; i < request.topic.length; i++) {
            let findTopic = JSON.parse(JSON.stringify(await query(`SELECT * FROM nottiktok.category WHERE categoryName = "${request.topic[i]}"`)));
            if (findTopic.length !== 0) {
                let requestcategory = await query(`INSERT INTO nottiktok.requestcategory (requestId, categoryId) VALUES(${resultMain.insertId}, ${findTopic[0].categoryId})`);
            } else {
                let topic = await query(`INSERT INTO nottiktok.category (categoryName) VALUES("${request.topic[i]}")`);
                let requestcategory = await query(`INSERT INTO nottiktok.requestcategory (requestId, categoryId) VALUES(${resultMain.insertId}, ${topic.insertId})`);
            }
        }

        return {
            data: {
                status: true
            }
        };
    } catch (err) {
        console.log(err)
    }
}

const addComment = async (data) => {
    try {
        const newComment = await AddComment.sendComment(data)

        return {
            data: newComment
        }
    } catch (err) {
        console.log(err)
    }
}

const removeComment = async (data) => {
    try {
        const removedComment = await RemoveComment.removeComment(data)

        return {
            data: removedComment
        }
    } catch (err) {
        console.log(err)
    }
}

const sharePost = async (data) => {
    try {
        await StorePostShare.storeShare(data)
    } catch (err) {
        console.log(err)
    }
}

const addViewCount = async (data) => {
    try {
        await StorePostView.storeView(data)
    } catch (err) {
        console.log(err)
    }
}

const getAdditionalPosts = async (data) => {
    try {
        let posts = await GetLimitedPostsAmount.getPosts(data)
        let fetchedPosts = []

        for (let postForm of posts) {
            const fetCheddata = await postForm.getData(data.userId)
            fetchedPosts.push(fetCheddata)
        }

        return { data: fetchedPosts }
    } catch (err) {
        console.log(err)
    }
}

const getPostById = async (data) => {

}

const getProfileSettings = async (data) => {
    const profileSettings = await GetProfile.fetchProfileSettings(data)

    return profileSettings
}

const checkIfUserLinkExists = async (userLink, userId) => {
    const checkUserLink = await CheckUserLink.checkUnique({ userLink, userId })

    return checkUserLink
}

const checkIfMailAddressExists = async (mailAddress, userId) => {
    const checkMailAddress = await CheckUserEmail.checkUnique({ mailAddress, userId })

    return checkMailAddress
}

const editProfileSettings = async (profile) => {
    const profileSettings = await EditProfile.editProfile(profile)

    return profileSettings
}

const findUserOrPost = async (title) => {
    const response = await GetUserOrPostByTitle.getData(title)

    return response
}

const selectUserOrPost = async (item) => {
    const response = await SelectUserOrPostByTitle.getData(item)

    return response
}

const loadPost = async (id) => {
    let response = await GetPostByIdWithBlocked.getPosts(id)
    response = await response[0].getData(1)

    return response
}

const manageBlockPost = async (id) => {
    const isBlocked = await ChangePostBlockState.setData(id)

    return isBlocked
}

const loadPostAnalytics = async (id) => {
    let response = await GetPostById.getPosts(id)
    response = await response[0].getData(1)
    let views = await GetRangePostViewsById.getPostAnalytics(id)

    for(let i = 0; i < views.length; i++) {
        views[i].dates = views[i].dates.split(',') 
    }

    return { response, views }
}

const getAllRequestsNotifications = async (id) => {
    const notifications = await GetPostRequests.getRequest(id)

    return notifications
}

const removeTaskNotification = async (id, requestId) => {
    await DeleteRequestNotification.deleteRequest(id, requestId)
}

module.exports = {
    getPosts,
    signUser,
    signUp,
    changeLikeState,
    changeFollowState,
    getProfile,
    createRequest,
    usersToAccomplish,
    getRecentProfile,
    getAllProfilePosts,
    getSavedProfilePosts,
    getProfileResponses,
    addComment,
    removeComment,
    sharePost,
    addViewCount,
    getAdditionalPosts,
    getProfileSettings,
    checkIfUserLinkExists,
    checkIfMailAddressExists,
    editProfileSettings,
    findUserOrPost,
    selectUserOrPost,
    loadPost,
    manageBlockPost,
    loadPostAnalytics,
    getAllRequestsNotifications,
    removeTaskNotification
}