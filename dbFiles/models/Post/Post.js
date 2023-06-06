const config = require('../../dbConfig');
const util = require('util');
const Comment = require('../Comment/Comment');
const User = require('../User');
const Picture = require('../Picture/Picture');
const Video = require('../Video/Video');
const Category = require('../Category');
const Text = require('../Text/Text');

const query = util.promisify(config.query).bind(config)
class Post {
    constructor(postId, description, previewImage, user, isBlocked = false) {
        this.postId = postId;
        this.description = description;
        this.previewImage = previewImage;
        this._user = user;
        this.isBlocked = isBlocked
    }

    async getPictures() {
        this._picture = await Picture.getPictures(this.postId);
    }

    async getVideos() {
        this._videos = await Video.getVideos(this.postId);
    }

    async getTextContent() {
        this._textContent = await Text.getTextContent(this.postId);
    }

    async getCategories() {
        this._categories = await Category.getCategories(this.postId);
    }

    async getComments() {
        this._comments = await Comment.getComments(this.postId);
    }

    async getLikes() {
        const likes = JSON.parse(JSON.stringify(await query(`SELECT count(*) as likes, ls.postId FROM nottiktok.likes as ls WHERE ls.postId = ${this.postId}`)));
        this._likes = likes.length > 0 ? likes[0].likes : 0;
    }

    async getShares() {
        const shares = JSON.parse(JSON.stringify(await query(`SELECT count(*) as shares, ss.postId FROM nottiktok.shares as ss WHERE ss.postId = ${this.postId}`)));
        this._shares = shares.length > 0 ? shares[0].shares : 0;
    }

    async getUserLiked(userId) {
        const userLiked = JSON.parse(JSON.stringify(await query(`SELECT ls.likesId, ls.postId FROM nottiktok.likes as ls WHERE ls.postId = ${this.postId} AND ls.userId = ${userId}`)));
        this._userLiked = userLiked.length > 0
    }

    async getIsUserFollowing(userId) {
        const isFollowing = await query(`SELECT * FROM nottiktok.follows as fs WHERE fs.followerId = ${userId} AND fs.userId = ${this._user.userId}`)

        this.isFollowing = isFollowing.length > 0
    }

    async getPhotoContent() {
        let tempPhoto = JSON.parse(JSON.stringify(await query(`SELECT * FROM nottiktok.photocontent as pht WHERE pht.postId = ${this.postId}`)));

        return tempPhoto;
    }

    async getPostViews() {
        const queryString = `SELECT COUNT(id) as amount FROM nottiktok.post_views WHERE post_id = ${this.postId}`;
        const views = await query(queryString)
    
        this._views = views[0].amount
    }

    static async getPosts(id) { }

    static async getPostAnalytics(id) { }

    static async storeShare(data) { }

    static async storeView(data) { }

    static async editPost(data) { }

    async getData(userId) {
        await this.getPictures();
        await this.getVideos();
        await this.getTextContent();
        await this.getCategories();
        await this.getLikes();
        await this.getShares();
        await this.getComments();
        await this.getUserLiked(userId);
        await this.getIsUserFollowing(userId)
        await this.getPostViews()
        return {
            postId: this.postId,
            description: this.description,
            previewImage: this.previewImage,
            _user: this._user,
            _picture: this._picture,
            _video: this._videos,
            _text: this._textContent,
            _category: this._categories,
            likes: this._likes,
            shares: this._shares,
            _comments: this._comments,
            iliked: this._userLiked,
            isFollowing: this.isFollowing,
            views: this._views,
            isBlocked: this.isBlocked
        }
    }
}

module.exports = Post;