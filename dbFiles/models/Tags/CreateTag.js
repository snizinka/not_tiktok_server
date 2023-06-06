const config = require('../../dbConfig');
const util = require('util');
const query = util.promisify(config.query).bind(config)

class CreateTag {
    static async createTag (categoryName, postId) {
        const newCat = categoryName.replace(/["\\]/g, (match) => {
            if (match === '"') {
                return '""'
            } else {
                return '\\\\'
            }
        })

        const newCategory = await query(`INSERT nottiktok.category (categoryName) VALUES("${newCat}")`)
        const newLinkedCategory = await query(`INSERT nottiktok.category_link (categoryId, postId) VALUES(${newCategory.insertId}, ${postId})`)
        
        return newLinkedCategory
    }
}

module.exports = CreateTag