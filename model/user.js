const mongoose = require('mongoose'); // get mongoose instance
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    email: {
        type:String,
        required: true,
        unique: true
    },
    // password:{
    //     type: String,
    //     required: true
    // },
    name: {
        type: String,
        required: true
    },
    hash : String,
    salt : String
}, {
    timestamps: true
});

userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');

    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
}

userSchema.methods.notMatch = function(password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
    
    return this.hash !== hash;
}

/*
    ARG 1: model name for ref
    ARG 2: name of schema specified in current script
    ARG 3: name of schema you want in Mongo DB
*/
const User = mongoose.model('User', userSchema, 'user'); 

module.exports = User;