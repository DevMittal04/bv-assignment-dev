const express = require('express')
const User = require('../models/users')

const app = express()


// Get all users
app.get("/", async (req, res) => {
    // console.log("as")
    try {
        // console.log("in")
        const users = await User.find()
        res.send(users)
        // console.log("in")
    } catch (err) {
        // console.log("out")
        res.status(500).json({ message: err.message })
        // console.log("out")
    }
})

// Get single User
app.get("/:id", getUser, (req, res) => {
    res.json(res.user)
})

// Insert new user
app.post("/", async (req, res) => {
    const user = new User({
        name: req.body.name,
        phone_number: req.body.phone_number,
        profile_url: req.body.profile_url,
        address: req.body.address,
    })

    try {
        const newUser = await user.save()
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Modify existing user
app.put("/:id", getUser, async (req, res) => {
    if (req.body.name != null) {
        res.user.name = req.body.name
    }
    if (req.body.phone_number != null) {
        res.user.phone_number = req.body.phone_number
    }
    if (req.body.profile_url != null) {
        res.user.profile_url = req.body.profile_url
    }
    if (req.body.address != null) {
        res.user.address = req.body.address
    }

    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
})

// Delete a user
app.delete("/:id", getUser, async (req, res) => {
    try {
        await res.user.remove()
        res.send({ message: "Deleted User" })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
})

// Gives the requested user object
async function getUser(req, res, next) {
    let user
    try {
        user = await User.findById(req.params.id)
        if (user == null) {
            return res.status(400).json({ message: "Cannot find user" })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.user = user
    next()
}


module.exports = app