const config = require('../../dbConfig');
const util = require('util');
const Category = require('./Category');
const query = util.promisify(config.query).bind(config)

class CategoryByUser extends Category {
    static async getCategory (id) {
        const categories = await query(`SELECT distinct cy.categoryId, cy.categoryName FROM nottiktok.category_link as ck LEFT JOIN nottiktok.category as cy ON cy.categoryId = ck.categoryId LEFT JOIN nottiktok.post as pt ON pt.postId = ck.postId WHERE pt.userId = ${id}`)

        return new Category(categories.categoryId, categories.categoryName)
    }
}

module.exports = CategoryByUser