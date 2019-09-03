const express = require("express");
const Posts = require('../data/db.js')

const router = express.Router();

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

router.post('/', (req, res) => {
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

 router.post('/:id/comments', (req, res) => {
    // const id = req.params
    const comment = req.body

    if (!comment.text) {
        res.status(400).json({
            errorMessage: "Please provide text for the comment." 
        }) 
    } else {
        Posts.insertComment(comment)
            .then((commentID) => {
                if (commentID) {
                    res.status(201).json(comment) 
                } else {
                    res.status(404).json({
                        message: "The post with the specified ID does not exist."
                    })
                }
            })
            .catch((err) => {
                console.log(err)
                res.status(500).json({
                    errorMessage: "There was an error while saving the comment to the database."
                })
            })
    }
 })


//  GET: /api/posts - returns array of ALL posts -- DONE

router.get('/', (req, res) => {
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

router.get('/:id', (req, res) => {
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

router.get('/:id/comments', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

// PUT: /api/posts/:id - edit a specific post -- DONE

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const editedPost = req.body;

    if (!editedPost.title || !editedPost.contents) {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        })
    } else {
        Posts.update(id, editedPost)
        .then((editSuccess) => {
            if (editSuccess) {
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

module.exports = router;