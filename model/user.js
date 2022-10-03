const mongoose = require('mongoose'); // get mongoose instance

const userSchema = new mongoose.Schema({
    email: {
        type:String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

/*
    ARG 1: model name for ref
    ARG 2: name of schema specified in current script
    ARG 3: name of schema you want in Mongo DB
*/
const User = mongoose.model('User', userSchema, 'user'); 

module.exports = User;