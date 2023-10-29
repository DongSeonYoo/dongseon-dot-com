const bcrypt = require("bcrypt");

const hashing = async (password) => {
    try {
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);

        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.log(error);
    }
}

const compare = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { hashing, compare };
