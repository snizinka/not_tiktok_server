class StringConverter {
    static convertStringToSQL(string) {
        const convertedString = string.replace(/["\\]/g, (match) => {
            if (match === '"') {
                return '""'
            } else {
                return '\\\\'
            }
        })

        return convertedString
    }
}

module.exports = StringConverter