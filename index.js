const express = require('express');
const dbAnalytics = require('./dbFiles/dbAnalytics');
const dbContent = require('./dbFiles/dbContent');
const dbOperation = require('./dbFiles/dbOperation');
const dbChat = require('./dbFiles/dbChat');
const dbRequests = require('./dbFiles/dbRequests');
const cors = require('cors');
const http = require('http')
const multer = require('multer')
const { Server } = require('socket.io');
const e = require('express');
const GetGroupContacts = require('./dbFiles/models/Contact/GetGroupContacts');

const API_PORT = 9000;
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const server = http.createServer(app)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'C:/Users/USER/Desktop/not_tiktok/front/not_tiktok/src/post_content/pictures')
    },
    filename: function (req, file, cb) {
        const searchString = '.';
        const postContentIndex = file.originalname.indexOf(searchString);
        let postfix = ''
        if (postContentIndex !== -1) {
            postfix = file.originalname.substring(postContentIndex + searchString.length);
        }

        console.log(file)

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + `.${postfix}`)
    }
})
const upload = multer({ storage: storage })
app.post('/profile', async function (req, res) {
    let data = await dbOperation.getProfile(req.body.id).then(res => {
        return res
    })

    res.send({ result: data })
})

app.post('/recentprofile', async function (req, res) {
    let data = await dbOperation.getRecentProfile(req.body.id).then(res => {
        return res
    })

    res.send({ result: data })
})

app.post('/allprofileposts', async function (req, res) {
    let data = await dbOperation.getAllProfilePosts(req.body.id).then(res => {
        return res
    })

    res.send({ result: data })
})

app.post('/postsbydescription', async function (req, res) {
    let props = {
        description: req.body.description, 
        userId: req.body.userId
    }
    let data = await dbAnalytics.getPostsByTitle(props).then(res => {
        return res
    })

    res.send({ result: data })
})

app.post('/savedprofileposts', async function (req, res) {
    let data = await dbOperation.getSavedProfilePosts(req.body.id).then(res => {
        return res
    })

    res.send({ result: data })
})

app.post('/responseprofileposts', async function (req, res) {
    let data = await dbOperation.getProfileResponses(req.body.id).then(res => {
        return res
    })

    res.send({ result: data })
})

app.post('/api', async function (req, res) {
    let data = await dbOperation.getPosts(req.body.parameter, req.body.id, req.body.userId).then(res => {
        return res
    })
    res.send({ result: data })
})

app.post('/signin', async function (req, res) {
    let data = await dbOperation.signUser(req.body.login, req.body.password).then(res => {
        return res
    })
    let error = ''

    if (data.data.length > 0) {
        if (data.data[0].password !== req.body.password) {
            console.log('Error executed 1')
            res.status(400).send({
                message: 'This is an error!',
                data: {}
            });
        } else {
            res.send({ result: data.data })
        }
    } else {
        console.log('Error executed 2')
        res.status(400).send({
            message: 'This is an error!',
            data: {}
        });
    }
})

app.post('/signup', async function (req, res) {
    let data
    try{
        data =  await dbOperation.signUp(req.body.email, req.body.password, req.body.username).then(res => {
            return res
        })
        console.log(data)
        res.send({ result: data })
    }catch(err) {
        res.status(400).send({
            message: 'This is an error!',
            data: {}
        });
    }
})

app.post('/likehandle', async function (req, res) {
    let data = await dbOperation.changeLikeState(req.body.postId, req.body.userId).then(res => {
        return res
    })

    res.send({ result: data })
})

app.post('/followhandle', async function (req, res) {
    let data = await dbOperation.changeFollowState(req.body.authorId, req.body.userId).then(res => {
        return res
    })

    res.send({ result: data })
})


app.post('/registerviewedpost', async function (req, res) {
    let data = await dbOperation.addViewCount(req.body.data).then(res => {
        return res
    })

    res.send({ result: data })
})

app.post('/getadditionalposts', async function (req, res) {
    console.log('Asks for additional posts')
    let data = await dbOperation.getAdditionalPosts(req.body.data).then(res => {
        return res
    })

    res.send({ result: data })
})

app.post('/chatusers', async function (req, res) {
    let data = await dbChat.getChatUsers(req.body.userId).then(res => {
        return res
    })

    res.send({ result: data })
})

app.post('/messages', async function (req, res) {
    const contact = req.body.contact
    const userId = req.body.userId
    let data = []

    if (contact.type === 'Private') {
        data = await dbChat.getMessagesFromPrivateChat(contact.id, userId).then(res => {
            return res
        })
    } else {
        data = await dbChat.getMessagesFromGroupChat(contact.id).then(res => {
            return res
        })
    }

    res.send({ result: data })
})

app.post('/limitmessages', async function (req, res) {
    const contact = req.body.contact
    const limit = req.body.limit
    let data = []

    data = await dbChat.getLimitMessagesFromPrivateChat(contact.id, limit).then(res => {
        return res
    })

    res.send({ result: data })
})

app.post('/userstoaccomplish', async function (req, res) {
    let data = await dbOperation.usersToAccomplish(req.body.categories).then(res => {
        return res;
    })

    res.send({ result: data })
})

app.post('/request', async function (req, res) {
    let data = await dbOperation.createRequest(req.body.request).then(res => {
        return res;
    })

    res.send({ result: data })
})

app.post('/createchat', async function (req, res) {
    let data = await dbChat.addGroup(req.body.chat).then(res => {
        return res;
    })

    res.send({ result: data })
})

app.post('/availableforchat', async function (req, res) {
    let data = await dbChat.getUsersAvailableForChat(req.body.chat).then(res => {
        return res;
    })

    res.send({ result: data })
})

app.post('/adduserstochat', async function (req, res) {
    let data = await dbChat.addUsersToChat(req.body.chat).then(res => {
        return res;
    })

    res.send({ result: data })
})

app.post('/allrequestsforcreator', async function (req, res) {
    let data = await dbRequests.getRequestsByCreatorId(req.body.id).then(res => {
        return res;
    })

    res.send({ result: data })
})

app.post('/removeuserfromchat', async function (req, res) {
    let data = await dbChat.removeFromGroup(req.body.chat).then(res => {
        return res;
    })

    res.send({ result: data })
})

app.post('/addcomment', async function (req, res) {
    let data = await dbOperation.addComment(req.body.data).then(res => {
        return res;
    })

    res.send({ result: data })
})

app.post('/removecomment', async function (req, res) {
    let data = await dbOperation.removeComment(req.body.data).then(res => {
        return res;
    })

    res.send({ result: data })
})

app.post('/leavechat', async function (req, res) {
    let chat = req.body.chat;
    let data = []

    if (chat.chatType === 'Group') {
        data = await dbChat.leaveChat(chat).then(res => {
            return res;
        })
    } else {
        data = await dbChat.leavePrivateChat(chat).then(res => {
            return res;
        })
    }

    res.send({ result: data })
})

app.post('/uploadpost', async function (req, res) {
    let data = await dbContent.uploadContent(req.body.content).then(res => {
        return res;
    })

    res.send({ result: data })
})

app.post('/uploadeditedpost', async function (req, res) {
    let data = await dbContent.editContent(req.body.content).then(res => {
        return res;
    })

    res.send({ result: data })
})

app.post('/profilesettings', async function (req, res) {
    let data = await dbOperation.getProfileSettings(req.body.userId).then(res => {
        return res;
    })

    res.send({ result: data })
})

app.post('/checkuserlink', async function (req, res) {
    let data = await dbOperation.checkIfUserLinkExists(req.body.userLink, req.body.userId).then(res => {
        return res;
    })

    res.send({ result: data })
})

app.post('/checkemail', async function (req, res) {
    let data = await dbOperation.checkIfMailAddressExists(req.body.mailAddress, req.body.userId).then(res => {
        return res;
    })

    res.send({ result: data })
})

app.post('/editprofile', async function (req, res) {
    let data = await dbOperation.editProfileSettings(req.body.profile).then(res => {
        return res;
    })

    res.send({ result: data })
})

app.post('/finduserorpost', async function (req, res) {
    let data = await dbOperation.findUserOrPost(req.body.title).then(res => {
        return res;
    })

    res.send({ result: data })
})

app.post('/selectuserorpost', async function (req, res) {
    let data = await dbOperation.selectUserOrPost(req.body.item).then(res => {
        return res;
    })

    res.send({ result: data })
})

app.post('/loadpost', async function (req, res) {
    let data = await dbOperation.loadPost(req.body.id).then(res => {
        return res;
    })

    res.send({ result: data })
})

app.post('/managepostblockstate', async function (req, res) {
    let data = await dbOperation.manageBlockPost(req.body.id).then(res => {
        return res;
    })

    res.send({ result: data })
})

app.post('/loadpostanalytics', async function (req, res) {
    let data = await dbOperation.loadPostAnalytics(req.body.id).then(res => {
        return res;
    })

    res.send({ result: data })
})

app.post('/messageseen', async function (req, res) {
    let data = await dbChat.setSeenPrivate(req.body.messageId).then(res => {
        return res;
    })

    res.send({ result: data })
})

app.post('/fetchnotifications', async function (req, res) {
    let data = await dbChat.getUnreadMessages(req.body.userId).then(res => {
        return res;
    })

    res.send({ result: data })
})

app.post('/fetchtasksnotifications', async function (req, res) {
    let data = await dbOperation.getAllRequestsNotifications(req.body.userId).then(res => {
        return res;
    })

    res.send({ result: data })
})

app.post('/settaskseen', async function (req, res) {
    let data = await dbOperation.removeTaskNotification(req.body.userId, req.body.requestId).then(res => {
        return res;
    })

    res.send({ result: data })
})

app.post('/uploadfile', upload.single('file'), async function (req, res) {
    const searchString = 'pictures\\';
    const postContentIndex = req.file.path.indexOf(searchString);
    let trimmedString = ''
    if (postContentIndex !== -1) {
        trimmedString = req.file.path.substring(postContentIndex + searchString.length);
    }
    res.send({ result: trimmedString })
})

app.post('/quit', function (req, res) {
    res.send({ result: 'Eat' })
})

async function run() {
    let data = await dbOperation.getPosts().then(res => {
        return res
    })
    console.log(data[0])
}



const io = new Server(server, {
    transports: ['websocket', 'polling'],
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"]
    },
})

let rooms = {}

io.on('connection', (socket) => {
    socket.on('join_chat', (data) => {
        console.log(data)
        if (data.joinMethod === 'private') {
            socket.join(data.id)
            rooms[data.id] = [data.id]
        } else {
            socket.join(data.rooms)
            rooms[data.rooms[0]] = data.rooms
        }
        console.log(data)
        console.log(rooms)
    })

    socket.on('send_message', async (data) => {
        let insert = {}

        if (data.chatType === 'Private') {
            insert = await dbChat.addMessagesToChat(data).then(res => { return res })
        } else {
            insert = await dbChat.insertMessagesToGroupChat(data).then(res => { return res })
        }

        if (data.shared) {
            await dbOperation.sharePost({userId: data.author, postId: data.postId})
        }

        if (data.chatType === 'Private') {
            socket.to(data.receiver).emit('receive_message_notification', insert.data)
            socket.to(data.receiver).emit('receive_message', insert.data)
            io.to(data.author).emit('receive_message', insert.data)
        } else {
            socket.broadcast.to(data.chat).emit('receive_message', insert.data)
            io.to(data.author).emit('receive_message', insert.data)
        }
    })

    socket.on('remove_message', async (data) => {
        if (data.chat.type === 'Private') {
            await dbChat.removeMessagesFromChat(data.messageId)
        } else {
            await dbChat.removeMessagesFromGroupChat(data.messageId)
        }

        if (data.chat.type === 'Private') {
            socket.to(data.chat.receiver).emit('message_removed', data)
            io.to(data.author).emit('message_removed', data)
        } else {
            socket.broadcast.to(data.chat.id).emit('message_removed', data)
            io.to(data.author).emit('message_removed', data)
        }
    })

    socket.on('edit_message', async (data) => {
        console.log(data)
        if (data.chat.type === 'Private') {
            await dbChat.editMessagesFromChat(data)
        } else {
            await dbChat.editGroupMessagesFromChat(data)
        }

        if (data.chat.type === 'Private') {
            socket.to(data.chat.receiver).emit('message_edited', data)
            io.to(data.author).emit('message_edited', data)
        } else {
            socket.broadcast.to(data.chat.id).emit('message_edited', data)
            io.to(data.author).emit('message_edited', data)
        }
    })

    socket.on('create_chat', async (data) => {
        let createChat = await dbChat.addGroup(data).then(res => {
            return res;
        })

        data.userList.map((userId) => {
            io.to(userId).emit('added_to_chat', createChat.data)
        })
    })

    socket.on('add_user_to_chat', async (data) => {
        let addUserToChat = await dbChat.addUsersToChat(data).then(res => {
            return res;
        })

        const group = await GetGroupContacts.getContact(data.chatId)

        data.userList.map((user) => {
            io.to(user).emit('added_to_chat', group)
        })

        addUserToChat.data.members.map((member) => {
            io.to(member.userId).emit('added_user_to_chat', addUserToChat.data)
        })
    })

    socket.on('remove_from_chat', async (data) => {
        if (data.chatType === 'Group') {
            let removedUser = await dbChat.removeFromGroup(data).then(res => {
                return res;
            })

            io.to(data.userId).emit('removed_from_chat', data)
            removedUser.data.members.map((member) => {
                io.to(member.userId).emit('removed_from_chat', data)
            })
        } else {
            let removedUser = await dbChat.leavePrivateChat(data).then(res => {
                return res;
            })

            io.to(data.userId).emit('removed_from_chat', data)
            io.to(data.seconUserId).emit('removed_from_chat', data)
        }
    })

    socket.on('disconnect', (room) => {
        console.log('Disconnected')
    })
})


server.listen(API_PORT, () => console.log('listening'));