const express = require("express")
const UserModel = require("../models/UserSchema")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()


//for register 
router.post("/register", async (req, res) => {
    const { firstName, email, username, password } = req.body

    try {
        const UserNameExist = await UserModel.findOne({ username })

        if (UserNameExist) {
            return res.status(400).json({ message: "user name already exist, change username" })

        }
        const UserEmailExist = await UserModel.findOne({ email })

        if (UserEmailExist) {
            return res.status(400).json({ message: "email already exist, change email" })

        }


        const hashedPassword = await bcrypt.hash(password, 10)
        const NewUser = new UserModel({ firstName, username, email, password: hashedPassword })
        await NewUser.save()

        res.json({ message: "User Registration Successfully Completed" })



    } catch (err) {
        res.status(500).send({ err: 'An error occurred while fetching users' })
    }


})

//for login
router.post("/login", async (req, res) => {
    const { username, password } = req.body

    if (username.length < 1 || password.length < 2) {
        return res.status(400).json({ message: "check your username or password " })
    }

    const User = await UserModel.findOne({ username })

    if (!User) {
        return res.status(400).json({ message: "username or password is incorrect" })
    }

    const isPasswordValid = await bcrypt.compare(password, User.password)


    if (!isPasswordValid) {
        return res.status(400).json({ message: "username or password is incorrect" })
    }

    const token = jwt.sign({ id: User._id }, process.env.Token_password, { expiresIn: '124d' })
    res.json({ token, User });
})




exports.UserRouter = router;