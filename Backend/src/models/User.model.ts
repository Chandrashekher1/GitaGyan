import mongoose from "mongoose"
import jwt from 'jsonwebtoken'
import Joi from 'joi'

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        minlength: 2,
        maxlength:200
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    }
   
})
UserSchema.methods.generateAuthToken = function(){
    const jwtPrivateKey = process.env.jwtPrivateKey;
    if (!jwtPrivateKey) {
        throw new Error('JWT private key is not defined');
    }
    const token = jwt.sign({_id: this._id}, jwtPrivateKey);
    return token
}

function validateUser(user:any){
    const Schema = Joi.object({
        name: Joi.string().min(3).max(200).required(),
        email: Joi.string().required(),
        password: Joi.string().min(5).max(1024).required(),
    })
    return Schema.validate(user)
}

const UserModel = mongoose.model('users', UserSchema)

export { UserModel as Users, validateUser as Validate }