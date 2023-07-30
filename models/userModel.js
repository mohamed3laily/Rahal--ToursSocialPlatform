const mongoose = require('mongoose');

const Schema = mongoose.Schema;
 const userSchema = new mongoose.Schema({
        userName: {
          type: String,
          required: true,
          trim:true,
        },
        password:{
            type: String,
            required: true

        },
        firstName:{
            type: String,
            required: false

        },
        secondName:{
            type: String,
            required: false

        },
        email:{
            type: String,
            required: true

        },
        phoneNumber:{
            type: Number,
            required: false

        },
        location:{
            type: String,
            required: true

        },
        createdAt:{
            type:Date,
            default: Date.now()
        }
    });

const User = mongoose.model('User', userSchema);
module.exports = User;