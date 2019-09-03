const express = require('express');
const Posts = require('./data/db.js')

const server = express();

server.use(express.json());

/**
 * POST: /api/posts - create a post -- DONE
 * POST: /api/posts/:id/comments - post comments for specific post
 * GET: /api/posts - returns array of ALL posts -- DONE
 * GET: /api/posts/:id - return a specific post -- DONE
 * GET: /api/posts/:id/comments - return all comments on a specific post -- DONE
 * DELETE: /api/posts/:id - delete a specific post -- DONE
 * PUT: /api/posts/:id - edit a specific post
 */

// POST: /api/posts - create a post -- DONE

 server.post('/api/posts', (req, res) => {
    const post = req.body;

    Posts.insert(post)
        .then(() => {
            if (!post.title || !post.contents) {
                // req.abort()
                res.status(400).json({
                    errorMessage: "Please provide title and contents for the post"
                })
            } else {
                res.status(201).json(post)
            }
        })
        .catch(() => {
            res.status(500).json({
                errorMessage: "There was an error while saving the post to the database."
            })
        })
 })

//  POST: /api/posts/:id/comments - post comments for specific post -- DONE

 server.post('./api/posts/:id/comments', (req, res) => {
    const id = req.params.id;
    const comment = req.body

    Posts.insertComment(comment)
        .then(() => {
            console.log("hmmm")
        })
        .catch(() => {
            res.status(500).json({
                errorMessage: "There was an error while saving the comment to the database."
            })
        })
 })


//  GET: /api/posts - returns array of ALL posts -- DONE

server.get('/api/posts', (req, res) => {
    Posts.find()
        .then((posts) => {
            res.status(200).json(posts)
        })
        .catch(() => {
            res.status(500).json({
                errorMessage: "The posts information could not be retrieved."
            })
        })
})

// GET: /api/posts/:id - return a specific post -- DONE

server.get('/api/posts/:id', (req, res) => {
    const id = req.params.id

    Posts.findById(id)
        .then((post) => {
            if (post.length === 0) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
                 
            } else {
                res.status(200).json(post) 
            }
        })
        .catch(() => {
            res.status(500).json({
                errorMessage: "The post information could not be retrieved."
            })
        })
})

// GET: /api/posts/:id/comments - return all comments on a specific post -- DONE

server.get('/api/posts/:id/comments', (req, res) => {
    const id = req.params.id

    Posts.findPostComments(id)
        .then((comments) => {
            if (comments.length === 0) {
               res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            } else {
                res.status(200).json(comments) 
            }
        })
        .catch(() => {
            res.status(500).json({
                errorMessage: "The comments information could not be retrieved."
            })
        })
})

// DELETE: /api/posts/:id - delete a specific post -- DONE

server.delete('/api/posts/:id', (req, res) => {
    const id = req.params.id

    Posts.findById(id)
        .then((post) => {
            if (post.length === 0) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            } else {
                Posts.remove(id)
                    .then(() => {
                        res.status(200).json(post)   
                    })
                    .catch(() => {
                        res.status(500).json({
                            errorMessage: "The post could not be removed."
                        })
                    })
            }
        })
        .catch(() => {
            res.status(500).json({
                errorMessage: "The post could not be removed."
            })
        })

})

// PUT: /api/posts/:id - edit a specific post

server.put('/api/posts/:id', (req, res) => {
    const id = req.params.id;
    const editedPost = req.body;

    if (!editedPost.title || !editedPost.contents) {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        })
    } else {
        Posts.update(id, editedPost)
        .then((edited) => {
            if (edited) {
                res.status(200).json(editedPost)
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
        })
        .catch(() => {
            res.status(500).json({
                errorMessage: "The post information could not be modified."
            })
        })
    }
})




module.exports = server;