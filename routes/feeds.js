const express = require('express')
const Post = require('../models/feeds')

const app = express()


// Get all posts
app.get("/", async (req, res) => {
    try {
        const posts = await Post.find()
        res.send(posts)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Get single post
app.get("/:id", getPost, (req, res) => {
    res.json(res.post)
})

// Insert new post
app.post("/", async (req, res) => {
    const post = new Post({
        name: req.body.name,
        content_url: req.body.content_url
    })

    try {
        const newPost = await post.save()
        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Modify existing post
app.put("/:id", getPost, async (req, res) => {
    if (req.body.name != null) {
        res.post.name = req.body.name
    }
    if (req.body.content_url != null) {
        res.post.content_url = req.body.content_url
    }
    if (req.body.likes != null) {
        res.post.likes += 1
    }
    if (req.body.comment != null) {
        res.post.comments.push(req.body.comment)
    }
    if (req.body.tag != null) {
        res.post.tags.push(req.body.tag)
    }

    try {
        const updatedPost = await res.post.save()
        res.json(updatedPost)
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
})

// Delete a post
app.delete("/:id", getPost, async (req, res) => {
    try {
        await res.post.remove()
        res.send({ message: "Deleted Post" })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
})

// Gives the requested post object
async function getPost(req, res, next) {
    let post
    try {
        post = await Post.findById(req.params.id)
        if (post == null) {
            return res.status(400).json({ message: "Cannot find the post" })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.post = post
    next()
}

module.exports = app