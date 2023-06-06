class Contact {
    constructor(contactId, fuserId, suserId, contactDate) {
        this.contactId = contactId,
            this.fuserId = fuserId,
            this.suserId = suserId,
            this.contactDate = contactDate
    }

    static async getContact(parameter) {}

    static async removeContact(parameter) {}
    
    static async addContact(parameter) {}
}

module.exports = Contact