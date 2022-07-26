const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    work: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})

schema.pre("save", function (next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 12)
        this.cpassword = bcrypt.hashSync(this.cpassword, 12)
    }
    next()
})

// we are generating token
schema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({ token: token })
        await this.save()
        return token;
    } catch (e) {
        console.log(e);
    }
}

const User = new mongoose.model('user', schema)

module.exports = User