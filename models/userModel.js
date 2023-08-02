const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;
 const userSchema = new mongoose.Schema({
        userName: {
          type: String,
          required: true,
          trim:true,
        },
        password:{
            type: String,
            required: [true, 'Please provide a password correctly'],
            minlenght:8,
            select: false

        },
        passwordConform:{
            type: String,
            required: [true, 're-enter your password'],
            minlenght:8,
            validate:{ // This only works on CREATE and SAVE!!!
                validator: function(el){
                    return el === this.password;
                },
                message: 'Passwords are not the same!'
            }

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
            required: [true, 'Please provide your email'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email'],

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

    userSchema.pre('save', async function(next) {
        try {
          if (!this.isModified('password')) {
            return next(); // If the password hasn't changed, no need to hash it again
          }
            this.password = await bcrypt.hash(this.password, 10);
            this.passwordConform = undefined;           
          next();
        } catch (error) {
          next(error);
        }
      });
    
const User = mongoose.model('User', userSchema);
module.exports = User;