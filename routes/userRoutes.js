const express = require("express")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { UserModel } = require("../model/userModel");
const { BlacklistModel } = require("../model/blacklistModel");

const userRouter = express.Router()

// register new user
userRouter.post("/register",async(req,res)=>{
    const {name,email,gender,password,age,city,is_married} = req.body
    try {
        const checkUser = await UserModel.findOne({email})
        if(checkUser){
            return res.send({"msg":"User already exist, please login"})
        }
        bcrypt.hash(password, 7, async(err, hash)=>{
            if(err){
                res.send({"msg":err})
            }
            else{
                const newUser = new UserModel({name,email,gender,age,city,is_married,password:hash})
                await newUser.save()
                res.status(200).json({"msg":"New user has been register"})
            }
        })
    } catch (error) {
        res.status(400).send({"msg":error})
    }
})


// login 
userRouter.post("/login",async(req,res)=>{
    const {email,password} = req.body
    try {
        const user =await UserModel.findOne({email})
        if(user){
            bcrypt.compare(password, user.password, (err, result)=>{
                if(result){
                    const token = jwt.sign({userId:user._id,user:user.name},"masai",{expiresIn:"7d"})
                    res.status(200).send({"msg":"Login Successfully",token})
                }
            })
        }else{
            res.send({"msg":"wrong credential"})
        }
    } catch (error) {
        res.status(400).send({"msg":error})
    }
})


userRouter.get("/logout",async(req,res)=>{
    const token = req.headers.authorization
    try {
        if(token){
            await BlacklistModel.updateMany({}, {$push: {blacklist: [token]}})
            res.status(200).json({"msg":"Logged out successfully"})
        }
    } catch (error) {
        
    }
})

module.exports = {userRouter}