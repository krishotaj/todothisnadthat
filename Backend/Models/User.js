const mongoose = require("mongoose");


const UserSchema = new mongoose.UserSchema ({
    username :{
        type:"String",
        required:true,
        unique:true,
        trim: true,
    },
    email:{
        type:"String",
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password:{
        type:"String",
        required:true,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
}, {timestamps: true});

UserSchema.pre('save', function (next){
    this.updatedAt = Date.now();
    next();
});


module.exports = mongoose.model("User", UserSchema);