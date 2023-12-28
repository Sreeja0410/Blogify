const {Router} = require("express");
const User = require("../models/user");
const { createTokenForUser } = require("../services/authentication");

const router = Router();

router.get("/signin", (req, res) => {
    //console.log(req.user);
    return res.render("signin",{user: req.user});
})

router.get("/signup", ( req, res) => {
    return res.render("signup",{user: req.user});
})

router.get("/logout", (req, res) => {
    return res.clearCookie("token").redirect("/");
})

router.post("/signin", async(req,res) => {
    const { email, password } = req.body;
    try {

        const { token, user } = await User.matchPasswordAndGenerateToken(email,password);
        //console.log("User information from matchPasswordAndGenerateToken:", user);


        const tokenWithFullName = createTokenForUser(user);
        //console.log("Token created with fullName:", tokenWithFullName);
        
        return res.cookie("token", tokenWithFullName).redirect("/");
        
    } catch (error) {
        return res.render("signin", {
            error: "Incorrect Email or Password",
        });
    }
    
})

router.post("/signup", async(req, res) => {
    const {fullName, email, password } = req.body;

    await User.create({
        fullName,
        email,
        password,
    });

    return res.redirect("/");
})



module.exports = router;