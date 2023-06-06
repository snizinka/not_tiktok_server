const GetContactByUserId = require('./models/Contact/GetContactByUserId')
const GetMessagesByContactId = require('./models/Chat/Message/GetMessage/GetMessagesByContactId')
const GetGroupMessageReply = require('./models/Chat/Message/GetMessage/GetGroupMessageReply')
const GetMessageReply = require('./models/Chat/Message/GetMessage/GetMessageReply')
const AddMessageToPrivateChat = require('./models/Chat/Message/AddMessage/AddMessageToPrivateChat')
const AddMessageToGroupChat = require('./models/Chat/Message/AddMessage/AddMessageToGroupChat')
const GetMessageById = require('./models/Chat/Message/GetMessage/GetMessageById')
const ReplyToPrivateMessage = require('./models/Chat/Message/ReplyToMessage/ReplyToPrivateMessage')
const ReplyToGroupMessage = require('./models/Chat/Message/ReplyToMessage/ReplyToGroupMessage')
const DeletePrivateMessage = require('./models/Chat/Message/DeleteMessage/DeletePrivateMessage')
const DeleteGroupMessage = require('./models/Chat/Message/DeleteMessage/DeleteGroupMessage')
const EditPrivateMessage = require('./models/Chat/Message/EditMessage/EditPrivateMessage')
const EditGroupMessage = require('./models/Chat/Message/EditMessage/EditGroupMessage')
const GetGroupContactsByUserId = require('./models/Contact/GetGroupContactsByUserId')
const GetGroupContacts = require('./models/Contact/GetGroupContacts')
const GetGroupMessagesById = require('./models/Chat/Message/GetMessage/GetGroupMessagesById')
const GetGroupMessageById = require('./models/Chat/Message/GetMessage/GetGroupMessageById')
const ForwardPrivateMessage = require('./models/Chat/Message/ForwardMessage/ForwardPrivateMessage')
const ForwardGroupMessage = require('./models/Chat/Message/ForwardMessage/ForwardGroupMessage')
const GetPrivateForwardedMessage = require('./models/Chat/Message/GetMessage/GetPrivateForwardedMessage')
const GetLastPrivateMessagesByContactId = require('./models/Chat/Message/GetMessage/GetLastPrivateMessagesByContactId')
const e = require('cors')
const GetGroupForwardedMessage = require('./models/Chat/Message/GetMessage/GetGroupForwardedMessage')
const { group } = require('console')
const CreateGroupChat = require('./models/Chat/CreateGroupChat')
const AddUserToGroupChat = require('./models/Chat/AddUserToGroupChat')
const RemoveUserFromGroupChat = require('./models/Chat/RemoveUserFromGroupChat')
const GetNotInGroupContacts = require('./models/Contact/GetNotInGroupContacts')
const RemoveGroupContact = require('./models/Contact/RemoveGroupContact')
const RemovePrivateContact = require('./models/Contact/RemovePrivateContact')
const GetChatMembers = require('./models/Chat/GetChatMembers')
const GetLimitPivateMessages = require('./models/Chat/Message/GetMessage/GetLimitPivateMessages')
const EditPrivateMessageStatus = require('./models/Chat/Message/EditMessage/EditPrivateMessageStatus')
const GetUnreadPrivateMessagesById = require('./models/Chat/Message/GetMessage/GetUnreadPrivateMessagesById')
const GetUnreadPrivateMessages = require('./models/Chat/Message/GetMessage/GetUnreadPrivateMessages')

const getChatUsers = async (userId) => {
    let contacts = await GetContactByUserId.getContact(userId)
    let groupContacts = await GetGroupContactsByUserId.getContact(userId)
    let unitedContacts = [contacts, groupContacts]

    return { data: unitedContacts }
}

const getMessagesFromPrivateChat = async (contactId, userId) => {
    let messages = await GetLastPrivateMessagesByContactId.getMessages({ contactId, userId }) //GetMessagesByContactId.getMessages(contactId)
    for (let i = 0; i < messages.length; i++) {
        messages[i] = await GetMessageReply.getMessageReplies(messages[i])
        messages[i] = await GetPrivateForwardedMessage.getMessages(messages[i])
    }
    messages.reverse()

    return { data: messages }
}

const getMessagesFromGroupChat = async (chatId) => {
    let messages = await GetGroupMessagesById.getMessages(chatId)

    for (let i = 0; i < messages.length; i++) {
        messages[i] = await GetGroupMessageReply.getMessageReplies(messages[i])
        messages[i] = await GetGroupForwardedMessage.getMessages(messages[i])
    }
    //messages.reverse()

    return { data: messages }
}

const addMessagesToChat = async (message) => {
    let added = {}


    if (message.chatMode.mode === 'Forward') {
        added = await ForwardPrivateMessage.forwardMessage(message)
    } else {
        added = await AddMessageToPrivateChat.addMessage(message)
    }

    let createdMessage = await GetMessageById.getMessages(added.insertId)
    if (message.chatMode.mode === 'Reply') {
        await ReplyToPrivateMessage.replyToMessage({ message: createdMessage, chatMode: message.chatMode })
    }

    createdMessage = await GetMessageReply.getMessageReplies(createdMessage)
    createdMessage = await GetPrivateForwardedMessage.getMessages(createdMessage)

    return { data: createdMessage }
}

const insertMessagesToGroupChat = async (message) => {
    let added = {}

    if (message.chatMode.mode === 'Forward') {
        added = await ForwardGroupMessage.forwardMessage(message)
    } else {
        added = await AddMessageToGroupChat.addMessage(message)
    }
    let createdMessage = await GetGroupMessageById.getMessages(added.insertId)

    if (message.chatMode.mode === 'Reply') {
        await ReplyToGroupMessage.replyToMessage({ message: createdMessage, chatMode: message.chatMode })
    }

    createdMessage = await GetGroupMessageReply.getMessageReplies(createdMessage)
    createdMessage = await GetGroupForwardedMessage.getMessages(createdMessage)

    return { data: createdMessage }
}

const removeMessagesFromChat = async (messageId) => {
    let removed = await DeletePrivateMessage.deleteMessage(messageId)

    return { data: removed }
}

const removeMessagesFromGroupChat = async (messageId) => {
    let removed = await DeleteGroupMessage.deleteMessage(messageId)

    return { data: removed }
}

const editMessagesFromChat = async (message) => {
    let edited = await EditPrivateMessage.editMessage(message)

    return { data: edited }
}

const editGroupMessagesFromChat = async (message) => {
    let edited = await EditGroupMessage.editMessage(message)

    return { data: edited }
}

const addGroup = async (group) => {
    let createGroupChat = await CreateGroupChat.createChat(group)

    let userList = group.userList
    for (let i = 0; i < userList.length; i++) {
        await AddUserToGroupChat.addUserToChat({ chatId: createGroupChat.insertId, userId: userList[i] })
    }

    let newChat = await GetGroupContacts.getContact(createGroupChat.insertId)

    return { data: newChat }
}

const getUsersAvailableForChat = async (chat) => {
    let usersForChat = await GetNotInGroupContacts.getContact(chat)

    return { data: usersForChat }
}

const addUsersToChat = async (chat) => {
    let addedUsers = []
    let userList = chat.userList
    for (let i = 0; i < userList.length; i++) {
        addedUsers.push(await AddUserToGroupChat.addUserToChat({ chatId: chat.chatId, userId: userList[i] }))
    }

    const chatMembers = await GetChatMembers.getChatMembers(chat.chatId)

    return { data: { users: addedUsers, chat: chat.chatId, members: chatMembers.members } }
}

const removeFromGroup = async (data) => {
    let remove = await RemoveUserFromGroupChat.removeUserFromChat(data)
    const chatMembers = await GetChatMembers.getChatMembers(data.chatId)

    return { data: { remove, members: chatMembers.members } }
}

const leaveChat = async (data) => {
    let chatLeft = await RemoveGroupContact.removeContact(data)

    return { data: data }
}

const leavePrivateChat = async (data) => {
    let chatLeft = await RemovePrivateContact.removeContact(data)

    return { data: data }
}

const getLimitMessagesFromPrivateChat = async (contactId, limit) => {
    let messages = await GetLimitPivateMessages.getMessages(contactId, limit)
    for (let i = 0; i < messages.length; i++) {
        messages[i] = await GetMessageReply.getMessageReplies(messages[i])
        messages[i] = await GetPrivateForwardedMessage.getMessages(messages[i])
    }
    messages.reverse()

    return { data: messages }
}

const setSeenPrivate = async (messageId) => {
    let messages = await EditPrivateMessageStatus.editMessage(messageId)
    return { data: messages }
}

// TODO: Get Unread Messages To Notification List
const getUnreadMessages = async (userId) => {
    let messages = await GetUnreadPrivateMessages.getMessages(userId)
    return { data: messages }
}

module.exports = {
    getChatUsers,
    getMessagesFromPrivateChat,
    getMessagesFromGroupChat,
    addMessagesToChat,
    insertMessagesToGroupChat,
    removeMessagesFromChat,
    removeMessagesFromGroupChat,
    editMessagesFromChat,
    editGroupMessagesFromChat,
    addGroup,
    getUsersAvailableForChat,
    addUsersToChat,
    removeFromGroup,
    leaveChat,
    leavePrivateChat,
    getLimitMessagesFromPrivateChat,
    setSeenPrivate,
    getUnreadMessages
};