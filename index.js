require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const path=require("path");
const cookieParser = require("cookie-parser");
const checkForAuthenticationCookie = require('./middlewares/authentication');

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const Blog = require("./models/blog");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));
app.use(checkForAuthenticationCookie("token"));



app.set("view engine", "ejs");

const db = process.env.MONGOURI;
mongoose.connect(db)
.then(() => console.log("db connected"))
.catch(err => console.log(err));

app.get("/", async (req,res)=>{
    //console.log('User information:', req.user);
    const allBlogs = await Blog.find({});
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
})

app.use("/user", userRoute);
app.use("/blog", blogRoute);

const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`Server started at port: ${PORT}`);
})

