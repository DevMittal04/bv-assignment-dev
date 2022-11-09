const express = require('express')
const User = require('../models/users')
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

const app = express()
const storage = multer.memoryStorage();
const upload = multer({ storage });
app.use(express.static("./uploads"));

// Get all users
app.get("/", async (req, res) => {
    try {
        const users = await User.find()
        res.send(users)
    } catch (err) {
        res.status(500).json({ message: err.message })
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
    updateUser(req, res);
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

// Upload Profile Pic after Compressing and Converting
app.post("/upload/:id", [upload.single("file"), getUser], async (req, res) => {
    fs.access("./uploads", (error) => {
        if (error) {
            fs.mkdirSync("./uploads");
        }
    });
    const { buffer, originalname } = req.file;
    const timestamp = new Date().toISOString();
    const ref = `${timestamp}-${originalname}.png`.replaceAll(':', '');
    await sharp(buffer)
        .png({ quality: 20 })
        .toFile("./uploads/" + ref);
    const link = `http://localhost:3000/users/${ref}`;
    res.user.profile_url = link
    updateUser(req, res);
});

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

// Update User Util
async function updateUser(req, res, next) {
    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
}

module.exports = app