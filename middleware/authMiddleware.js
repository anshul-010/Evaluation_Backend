const express = require("express")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { BlacklistModel } = require("../model/blacklistModel");

const auth = async(req,res,next)=>{
    const token = req.headers.authorization
    const BToken = await BlacklistModel.find({
        blacklist : {$in : token}
    })
    if(BToken.length>0){
        res.send({"msg":"Please login"})
    }
    else{
        jwt.verify(token, "masai",(err,decode)=>{
            if(decode){
                req.body.userId = decode.userId
                req.body.user = decode.user
                next()
            }
            else{
                res.send(err)
            }
        })
    }

}


module.exports = {auth}