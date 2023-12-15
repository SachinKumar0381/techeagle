const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const UserModel = require("./models/User.model");
const ProductModel = require("./models/Product.model");
const connection = require("./configs/db");
// const notesRouter = require("./routes/notes.routes");

const app = express();

app.use(cors());
app.use(express.json());
require("dotenv").config();

app.post("/addproduct",async(req,res)=>{
    const item = req.body
    const newitem = new ProductModel(item);
       await newitem.save();
    res.send("done");
})

app.get("/getproduct",async(req,res)=>{
    const items = await ProductModel.find();
    res.send(items);
})

app.put("/putproduct",async(req,res)=>{
    const item = req.body;
    const itemid = req.body._id;
    const newitem = await ProductModel.findByIdAndUpdate(itemid,item);
    res.send("done")
})

app.delete("/deleteproduct/:id",async(req,res)=>{
    const itemid = req.params.id;
    const newitem = await ProductModel.findByIdAndDelete(itemid);
    res.send("done")
})

app.post("/signup",async(req,res)=>{
    const {email,password} = req.body;
    const existuser = await UserModel.findOne({email});
    if(existuser)
    {
        return res.send({status : false, message : "Email already exist!"})
    }
    else
    {
    await bcrypt.hash(password,5,function(err,hash){
        if(err)
        {
            return res.send({status : false, message : "Something went wronge"});
        }
        const user = new UserModel({email,password:hash});
        user.save();
        return res.send({status : true, message : "Signup Successful"});
    })
}
});

app.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    const user = await UserModel.findOne({email});
    if(!user)
    {
        return res.send({status : false, message : "Invalid user"})
    }
    const hashed_password = user.password;
    await bcrypt.compare(password,hashed_password,function (err,result){
        if(err)
        {
            return res.send({status : false, message : "Please try again"})
        }

        if(result==true)
        {
            const token = jwt.sign({email : user.email, _id : user._id},process.env.jwt_secret_key);
            return res.send({status: true, message : "login successful", token, userId : user._id})
        }
        else
        {
            return res.send({status : false, message : "Invalid user"});
        }
    })
})


const authenticated = (req,res,next) =>{
    if(!req.headers.authorization)
    {
        return res.send("please login again")
    }
    const user_token = req.headers.authorization.split(" ")[1];
    jwt.verify(user_token,"sachin",function (err,decode){
        if(err)
        {
            return res.send("please login again")
        }
        console.log(decode);
        next();
    })
}

app.use(authenticated);
// app.use("/notes",notesRouter);

app.listen(7000, async()=>{
    try{
        await connection;
        console.log("connected to db")
    }
    catch(err){
        console.log(err)
    }
    console.log("server started")
})