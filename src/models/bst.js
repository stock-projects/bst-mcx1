const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// function for checking the length of mobile number is 10 or not 
  function mobileNumberLength(value) {
    var value1 = value
    return value1.toString().length === 10 ; 
  }

const userSchema = new mongoose.Schema({
    name:{
        required:true,
        type:String
    },
    mobile:{
        unique:true,
        required:true,
        type:Number,
        validate:mobileNumberLength
    },
    password:{
        required:true,
        type:String
    },
    trades:{
        Active:{
            type:Array()
        },
        Closed:{
            type:Array()
        }
    },
    portfolio:{
        type:Number
    },
    balance:{
        default:100000,
        type:Number
    },
    userType:{
        default:'user',
        type:String
    },
    tokens:[{
        token:{
            type:String, 
            required: true
        }
    }]
})

userSchema.methods.generateAuthToken = async function(){
    const user = this
    token = jwt.sign({_id: user._id.toString()}, process.env.secret_key)
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token 
}
  

userSchema.statics.findByCredentials = async(mobile, password) => {
    const user = await User.findOne({mobile})
    if(!user){
        throw new Error("unable to login")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error("unable to login")
    }
    return user
}

userSchema.pre('save', async function(next) {
    const user = this 
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})


const User =  mongoose.model('bst', userSchema)


module.exports = User