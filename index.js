const express = require("express")
const { connection } = require("./db")
const { userRouter } = require("./routes/userRoutes")
const { postRouter } = require("./routes/postRoutes")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors())

app.use("/users",userRouter)
app.use("/posts",postRouter)

// app.get("/",(req,res)=>{
//     res.send(`This Is A Home Page`)
// })


app.listen(8080,async()=>{
    try {
        await connection
        console.log(`Connected to DB`)
        console.log(`Server is Running on Port 8080`)
    } catch (error) {
        console.log(error)
    }
})