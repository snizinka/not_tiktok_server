const GetPostRequestsByCreatorId = require('./models/Request/GetPostRequestsByCreatorId')

const getRequestsByCreatorId = async (id) => {
    const requests = await GetPostRequestsByCreatorId.getRequest(id)

    return { data: requests }
}


module.exports = {
    getRequestsByCreatorId
}