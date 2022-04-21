const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");

const staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        maxlength: [50, "Name should be under 50 characters"],
      },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [6, "password should be atleast 6 char"],
        select: false,
      },
    empId: {
        type: String,
        required: [true, "Please provide a name"],
        maxlength: [10, "Name should be under 10 characters"],
      },
    department: {
        type: String,
        required: [true, "Please provide branch name"],
        maxlength: [50, "Name should be under 50 characters"],
      },
      dateOfJoining: {
        type: Date,
        required: [true, "Please provide Date of Joining of the Employee"],
      },
     
    personalEmail: {
        type: String,
        required: [true, "Please provide Employee personal email"],
        validate: [validator.isEmail, "Please enter email in correct format"],
        unique: true,
      },
    collegeEmail: {
        type: String,
        required: [true, "Please provide Employee college email"],
        validate: [validator.isEmail, "Please enter email in correct format"],
        unique: true,
      },
    phoneNumber: {
        type: String,
        required: [true, "Please provide student's PhoneNumber"],
      },
    address: {
        type: String,
        required: [true, "Please provide student's Address"],
      },
    role: {
        type: String,
        default: "staff",
      },
    photo: {
        id: {
          type: String,
          required: true,
        },
        secure_url: {
          type: String,
          required: true,
        },
      },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    createdAt: {
        type: Date,
        default: Date.now,
      },
});

staffSchema.pre("save", async function(next) {
    if(!this.isModified("password"))
    {
        return next();
    }
    this.password = await bcrypt.hash(this.password,10)
});

staffSchema.methods.isValidatedUser = async function(userPassword){

    return await bcrypt.compare(userPassword,this.password);
}

staffSchema.methods.getJwtToken = async function(){
    return  jwt.sign({id:this._id},processenv.JWTSECRET,{expiresIn:process.env.EXPIRESIN});
}


staffSchema.methods.getPasswordtoken = async function(){
    const forgottoken = crypto.randomBytes(20).toString('hex');

    //hasing generated token
    this.forgotPasswordToken = await crypto.hash("sha256").update(forgottoken).digest("hex");
    
    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
    
    return forgottoken
}


module.exports = mongoose.model("Student",staffSchema);