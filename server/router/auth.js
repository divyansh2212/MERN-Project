const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const router = express.Router()

require("../db/conn")
const User = require("../models/schema")

// router.post("/register", (req, res) => {
//     const { name, email, phone, work, password, cpassword } = req.body

//     if (!name || !email || !phone || !work || !password || !cpassword) {
//         res.status(422).json({ error: "Please fill all the details" })
//     }
//     else {
//         User.findOne({ email: email }).then((userExist) => {
//             if (userExist) {
//                 res.status(422).json({ error: "User already exists!" });
//             }
//             const user = new User({ name, email, phone, work, password, cpassword });
//             user.save().then(() => {
//                 res.status(201).json({ message: "User registered successfully!" })
//             }).catch((e) => res.status(501).json({ error: "Fail to register the user" }))
//         }).catch((e) => {
//             console.log(e);
//         })
//     }
// })

router.post("/register", async (req, res) => {
    const { name, email, phone, work, password, cpassword } = req.body

    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "Please fill all the details!" })
    }

    try {
        const isUserExist = await User.findOne({ email: email })
        if (isUserExist) {
            return res.status(422).json({ error: "User already exists!" })
        }
        else if (password != cpassword) {
            return res.status(422).json({ error: "Passwords should be same!" })
        }

        const user = new User({ name, email, phone, work, password, cpassword });
        await user.save();
        res.status(201).json({ message: "User registered successfully" })
    } catch (e) {
        console.log(e);
    }
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(422).json({ error: "Incomplete Credentials!" })
    }

    try {
        const isUserExist = await User.findOne({ email: email })
        if (!isUserExist) {
            return res.status(422).json({ error: "Invalid Credentials!" })
        }
        const isMatch = await bcrypt.compare(password, isUserExist.password)
        if (!isMatch)
            return res.status(422).json({ error: "Invalid Credentials!" })

        const token = await isUserExist.generateAuthToken()
        // console.log(token);
        res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 25892000000),
            httpOnly: true
        })

        res.status(201).json({ message: "Login Successful!" })

    } catch (e) {
        console.log(e);
    }
})

module.exports = router