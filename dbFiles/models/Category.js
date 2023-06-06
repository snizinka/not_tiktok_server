const config = require('../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class Category {
    constructor(category_linkId, categoryId, categoryName) {
        this.category_linkId = category_linkId;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }

    static async getCategories(postId) {
        const categories = JSON.parse(JSON.stringify(await query(`SELECT * FROM nottiktok.category_link as cl LEFT JOIN nottiktok.category as cy ON cy.categoryId = cl.categoryId WHERE cl.postId = ${postId}`)));
        let categoryArray = [];

        for(let category of categories)
            categoryArray.push(new Category(category.category_linkId, category.categoryId, category.categoryName));

        return categoryArray;
    }
}

module.exports = Category;