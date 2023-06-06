const config = require('../../dbConfig');
const util = require('util');
const User = require('./User');
const CheckUserEmail = require('./CheckUserEmail');
const CheckUserLink = require('./CheckUserLink');
const CheckUserPassword = require('./CheckUserPassword');
const StringConverter = require('../Hooks/StringConverter');
const query = util.promisify(config.query).bind(config)

class EditProfile extends User {
    static async editProfile(profile) {
        let success = false
        let validation = { email: true, userLink: true, password: true }
        validation.email = await CheckUserEmail.checkUnique({ userId: profile.userId, mailAddress: profile.mailAddress })
        validation.userLink = await CheckUserLink.checkUnique({ userId: profile.userId, userLink: profile.userLink })
        validation.password = profile.password.length > 0 ? await CheckUserPassword.checkUnique({ userId: profile.userId, password: profile.password }) : false

        if (!validation.email && !validation.userLink && !validation.password) {
            success = true
            
            let profileQuery = `UPDATE nottiktok.users 
            SET username = "${StringConverter.convertStringToSQL(profile.username)}", 
            userLink = "${StringConverter.convertStringToSQL(profile.userLink)}",
            mailAddress = "${StringConverter.convertStringToSQL(profile.mailAddress)}",
            phoneNumber = '${profile.phoneNumber}',
            userImage = "${StringConverter.convertStringToSQL(profile.userImage)}",
            description = "${StringConverter.convertStringToSQL(profile.description)}"`

            if (profile.password.length > 0) {
                profileQuery += `, password = "${StringConverter.convertStringToSQL(profile.newPassword)}"`
            }

            profileQuery += `WHERE userId = ${profile.userId}`

            const profileSettingsQuery = `UPDATE nottiktok.profile_settings 
            SET is_profile_private = '${profile.isProfilePrivate}', 
            show_profile_posts = '${profile.showProfilePosts}',
            recomend_user_posts = '${profile.recomendUsersPosts}'
            WHERE user_id = ${profile.userId}`

            await query(profileQuery)
            await query(profileSettingsQuery)
        }



        return { validation, success }
    }
}

module.exports = EditProfile