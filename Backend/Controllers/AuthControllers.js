//register
//accept user data (email, password, username)
//hash the password bcrypt
//save the user in db
//return success token

const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();
const SALT_ROUNDS= process.env.SALT_ROUNDS;
const SECRET_KEY = process.env.SECRET_KEY;
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  });
    


//Register
exports.register = async (req,res) => {
  //extract the data
  const {email, password, username} = req.body;
  //validate 
  if(!email || !password || !username){
    return res.status(400).json({msg: "Please fill in all the fields"})
  }
  //validate password pattern
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordPattern.test(password)) {
    return res.status(400).json({msg: "Password does not meet the requirements"})
  }
  //check if user exists
  const existingUser = await User.findOne({email})
  if(existingUser){
    return res.status(400).json({msg: "User already exists"})
    }
    //hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = new User({email, password: hashedPassword , username, isVerified: false});
    await newUser.save();
    //generate verification token
    const verificationToken = jwt.sign({ id: newUser._id}, SECRET_KEY,{expiresIn: '1d'});
    
    //verification email
    const verificationUrl= `${process.env.CLIENT_URL}/verify-email>token=${verificationToken}`;
    const mailOptions = {
      from: "process.env.EMAIL_USER",
      to: email,
      subject: "Verify your email",
      html:`<p>Thank you for registering! Please click the link below to verify your email:</p> <a href="${verificationUrl}">Verify Email</a>`,
    };
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        return res.status(500).json({msg: "Error sending verification email", err})
        }
        res.status(201).json({msg: "Registration successful! Please check your email to verify your account."})
        });
    };

//email verification
exports.verifyEmail = async (req, res) => {
  const {token} = req.query;
  try{
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded.id);
    if(!user){
      return res.status(400).json({msg: "Invalid token"})
      }
      user.isVerified = true;
      await user.save();

      res.status(200).json({msg: "Email successfully verified!"})
      }catch (error){
        res.status(400).json({msg: "Invalid or expired token"})
      }
}
