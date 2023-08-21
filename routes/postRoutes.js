const express = require("express")
const { PostModel } = require("../model/postModel")
const { auth } = require("../middleware/authMiddleware")


const postRouter = express.Router()
postRouter.use(auth)
// post the Data
postRouter.post("/add",async(req,res)=>{
    try {
        const post = new PostModel(req.body)
        await post.save()
        res.status(200).send({"msg":"new post added"})
    } catch (error) {
        res.status(400).send({"msg":error})
    }
})

postRouter.get("/",async(req,res)=>{
    const {title,body,device,no_of_comments} = req.query
    const page = req.query.page
    const limit = req.query.limit
    try {
        let filter = {
            userId : req.body.userId
        }

        if(title){
            filter.title=title
        }

        const posts = await PostModel.find(filter)
        .skip((page-1) * limit)
        .limit(3)
        
        res.status(200).send(posts)
    } catch (error) {
        
    }    
})

// top 3
postRouter.get("/top",async(req,res)=>{
    const {title,body,device,no_of_comments} = req.query
    const page = req.query.page
    const limit = req.query.limit
    try {
        let filter = {
            userId : req.body.userId
        }

        if(title){
            filter.title=title
        }

        const posts = await PostModel.find(filter)
        .skip((page-1) * limit)
        .limit(3)
        
        res.status(200).send(posts)
    } catch (error) {
        
    }    
})


// update
postRouter.patch("/update/:postID",async(req,res)=>{
    const {postID} = req.params
    const post = await PostModel.findOne({_id:postID})
    try {
        if(req.body.userId!=post.userId){
            res.send({"msg":"you are not authorize"})
        }
        else{
            await PostModel.findByIdAndUpdate({_id:postID},req.body)
            res.status(200).send({"msg":"your post has updated"})
        }
    } catch (error) {
        
    }
})

// delete
postRouter.delete("/update/:postID",async(req,res)=>{
    const {postID} = req.params
    const post = await PostModel.findOne({_id:postID})
    try {
        if(req.body.userId!=post.userId){
            res.send({"msg":"you are not authorize"})
        }
        else{
            await PostModel.findByIdAndDelete({_id:postID})
            res.status(200).send({"msg":"your post has updated"})
        }
    } catch (error) {
        
    }
})

module.exports = {postRouter}

